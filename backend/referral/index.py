"""
Реферальная система «Я Люблю Юмор»
GET  ?action=stats              — топ пользователей и кол-во участников
GET  ?action=user&email=...     — данные пользователя по email
POST (body: username, email, ref_code?) — регистрация с реферальной ссылкой
"""

import json
import os
import random
import string
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


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    method = event.get("httpMethod", "GET")
    params = event.get("queryStringParameters") or {}
    action = params.get("action", "stats")

    conn = get_conn()
    cur = conn.cursor()

    try:
        # POST — регистрация пользователя
        if method == "POST":
            body = json.loads(event.get("body") or "{}")
            username = body.get("username", "").strip()
            email = body.get("email", "").strip().lower()
            referred_by = body.get("ref_code", "").strip().upper() or None

            if not username or not email:
                return {
                    "statusCode": 400,
                    "headers": CORS_HEADERS,
                    "body": json.dumps({"error": "Имя и email обязательны"}),
                }

            cur.execute("SELECT id, ref_code, points FROM ylu_users WHERE email = %s", (email,))
            existing = cur.fetchone()
            if existing:
                return {
                    "statusCode": 200,
                    "headers": CORS_HEADERS,
                    "body": json.dumps({
                        "status": "exists",
                        "ref_code": existing[1],
                        "points": existing[2],
                        "message": "Вы уже зарегистрированы!",
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
                "INSERT INTO ylu_users (username, email, ref_code, referred_by) VALUES (%s, %s, %s, %s) RETURNING id",
                (username, email, ref_code, referred_by if referrer_valid else None),
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

        # GET ?action=user&email=... — данные пользователя
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
