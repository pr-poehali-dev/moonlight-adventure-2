"""
Реферальная система «Я Люблю Юмор»
POST (body: username, email, password, ref_code?) — регистрация
POST ?action=login (body: email, password)           — вход
GET  ?action=stats                                   — топ участников
GET  ?action=user&email=...                          — данные пользователя
"""

import json
import os
import random
import string
import hashlib
import psycopg2

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def generate_ref_code(length=8):
    chars = string.ascii_uppercase + string.digits
    return "".join(random.choices(chars, k=length))


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    method = event.get("httpMethod", "GET")
    params = event.get("queryStringParameters") or {}
    action = params.get("action", "register")

    conn = get_conn()
    cur = conn.cursor()

    try:
        # POST ?action=login — вход по email + пароль
        if method == "POST" and action == "login":
            body = json.loads(event.get("body") or "{}")
            email = body.get("email", "").strip().lower()
            password = body.get("password", "").strip()

            if not email or not password:
                return {
                    "statusCode": 400,
                    "headers": CORS_HEADERS,
                    "body": json.dumps({"error": "Email и пароль обязательны"}),
                }

            cur.execute(
                """
                SELECT u.username, u.ref_code, u.points,
                    (SELECT COUNT(*) FROM ylu_referrals WHERE referrer_code = u.ref_code) as invites
                FROM ylu_users u
                WHERE u.email = %s AND u.password_hash = %s
                """,
                (email, hash_password(password)),
            )
            row = cur.fetchone()
            if not row:
                return {
                    "statusCode": 401,
                    "headers": CORS_HEADERS,
                    "body": json.dumps({"error": "Неверный email или пароль"}),
                }

            return {
                "statusCode": 200,
                "headers": CORS_HEADERS,
                "body": json.dumps({
                    "status": "ok",
                    "username": row[0],
                    "ref_code": row[1],
                    "points": row[2],
                    "invites": int(row[3]),
                    "message": f"Добро пожаловать, {row[0]}!",
                }),
            }

        # POST (register) — регистрация с паролем
        if method == "POST":
            body = json.loads(event.get("body") or "{}")
            username = body.get("username", "").strip()
            email = body.get("email", "").strip().lower()
            password = body.get("password", "").strip()
            referred_by = body.get("ref_code", "").strip().upper() or None

            if not username or not email or not password:
                return {
                    "statusCode": 400,
                    "headers": CORS_HEADERS,
                    "body": json.dumps({"error": "Имя, email и пароль обязательны"}),
                }

            if len(password) < 6:
                return {
                    "statusCode": 400,
                    "headers": CORS_HEADERS,
                    "body": json.dumps({"error": "Пароль должен быть не менее 6 символов"}),
                }

            cur.execute("SELECT id, ref_code, points FROM ylu_users WHERE email = %s", (email,))
            existing = cur.fetchone()
            if existing:
                return {
                    "statusCode": 200,
                    "headers": CORS_HEADERS,
                    "body": json.dumps({
                        "status": "exists",
                        "message": "Этот email уже зарегистрирован. Войдите в аккаунт.",
                    }),
                }

            ref_code = generate_ref_code()
            while True:
                cur.execute("SELECT id FROM ylu_users WHERE ref_code = %s", (ref_code,))
                if not cur.fetchone():
                    break
                ref_code = generate_ref_code()

            referrer_valid = None
            if referred_by:
                cur.execute("SELECT id FROM ylu_users WHERE ref_code = %s", (referred_by,))
                referrer_valid = cur.fetchone()

            cur.execute(
                "INSERT INTO ylu_users (username, email, ref_code, referred_by, password_hash) VALUES (%s, %s, %s, %s, %s) RETURNING id",
                (username, email, ref_code, referred_by if referrer_valid else None, hash_password(password)),
            )
            new_user_id = cur.fetchone()[0]

            if referrer_valid:
                cur.execute(
                    "UPDATE ylu_users SET points = points + 10 WHERE ref_code = %s",
                    (referred_by,),
                )
                cur.execute(
                    "INSERT INTO ylu_referrals (referrer_code, invited_user_id, points_awarded) VALUES (%s, %s, 10)",
                    (referred_by, new_user_id),
                )

            conn.commit()
            return {
                "statusCode": 201,
                "headers": CORS_HEADERS,
                "body": json.dumps({
                    "status": "created",
                    "ref_code": ref_code,
                    "points": 0,
                    "invites": 0,
                    "message": "Регистрация успешна! Делитесь ссылкой и копите очки.",
                }),
            }

        # GET ?action=stats — топ участников
        if method == "GET" and action == "stats":
            cur.execute(
                """
                SELECT username, points,
                    (SELECT COUNT(*) FROM ylu_referrals WHERE referrer_code = u.ref_code) as invites
                FROM ylu_users u
                ORDER BY points DESC
                LIMIT 10
                """
            )
            rows = cur.fetchall()
            top = [{"username": r[0], "points": r[1], "invites": int(r[2])} for r in rows]

            cur.execute("SELECT COUNT(*) FROM ylu_users")
            total = cur.fetchone()[0]

            return {
                "statusCode": 200,
                "headers": CORS_HEADERS,
                "body": json.dumps({"top": top, "total_users": int(total)}),
            }

        # GET ?action=user&email=...
        if method == "GET" and action == "user":
            email = params.get("email", "").lower()
            if not email:
                return {"statusCode": 400, "headers": CORS_HEADERS, "body": json.dumps({"error": "email обязателен"})}

            cur.execute(
                """
                SELECT u.username, u.ref_code, u.points,
                    (SELECT COUNT(*) FROM ylu_referrals WHERE referrer_code = u.ref_code) as invites
                FROM ylu_users u WHERE u.email = %s
                """,
                (email,),
            )
            row = cur.fetchone()
            if not row:
                return {"statusCode": 404, "headers": CORS_HEADERS, "body": json.dumps({"error": "Пользователь не найден"})}

            return {
                "statusCode": 200,
                "headers": CORS_HEADERS,
                "body": json.dumps({
                    "username": row[0],
                    "ref_code": row[1],
                    "points": row[2],
                    "invites": int(row[3]),
                }),
            }

        return {"statusCode": 404, "headers": CORS_HEADERS, "body": json.dumps({"error": "Not found"})}

    finally:
        cur.close()
        conn.close()
