"""
Мини-игра «Гномы» — «Я Люблю Юмор»
POST ?action=buy   — купить карточку гнома за очки (body: email, password, card_type)
POST ?action=collect — собрать добытые очки (body: email, password)
GET  ?action=status&email=... — карточки и накопленные очки пользователя
"""

import json
import os
import hashlib
import psycopg2
from datetime import datetime, timezone

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}

CARD_CONFIG = {
    1: {"name": "Обычный гном",   "emoji": "🧙",  "cost_points": 1000,  "rate_per_hour": 5},
    2: {"name": "Редкий гном",    "emoji": "🧙‍♂️", "cost_points": 10000, "rate_per_hour": 30},
    3: {"name": "Легендарный гном","emoji": "🧙‍♀️","cost_points": 50000, "rate_per_hour": 80},
}


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def hash_password(p: str) -> str:
    return hashlib.sha256(p.encode()).hexdigest()


def get_user(cur, email: str, password: str):
    cur.execute(
        "SELECT id, points FROM ylu_users WHERE email = %s AND password_hash = %s",
        (email.strip().lower(), hash_password(password.strip())),
    )
    return cur.fetchone()


def calc_pending(last_collected_at, rate_per_hour: int) -> int:
    now = datetime.now(timezone.utc)
    if last_collected_at.tzinfo is None:
        last_collected_at = last_collected_at.replace(tzinfo=timezone.utc)
    hours = (now - last_collected_at).total_seconds() / 3600
    return int(hours * rate_per_hour)


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    method = event.get("httpMethod", "GET")
    params = event.get("queryStringParameters") or {}
    action = params.get("action", "status")

    conn = get_conn()
    cur = conn.cursor()

    try:
        # POST ?action=buy — купить карточку за очки
        if method == "POST" and action == "buy":
            body = json.loads(event.get("body") or "{}")
            email = body.get("email", "")
            password = body.get("password", "")
            card_type = int(body.get("card_type", 0))

            if card_type not in CARD_CONFIG:
                return {"statusCode": 400, "headers": CORS_HEADERS,
                        "body": json.dumps({"error": "Неверный тип карточки"})}

            user = get_user(cur, email, password)
            if not user:
                return {"statusCode": 401, "headers": CORS_HEADERS,
                        "body": json.dumps({"error": "Неверный email или пароль"})}

            user_id, points = user
            cost = CARD_CONFIG[card_type]["cost_points"]

            if points < cost:
                return {"statusCode": 400, "headers": CORS_HEADERS,
                        "body": json.dumps({"error": f"Недостаточно очков. Нужно {cost}, у вас {points}"})}

            cur.execute("UPDATE ylu_users SET points = points - %s WHERE id = %s", (cost, user_id))
            cur.execute(
                "INSERT INTO ylu_gnome_cards (user_id, card_type) VALUES (%s, %s)",
                (user_id, card_type),
            )
            conn.commit()

            return {"statusCode": 200, "headers": CORS_HEADERS,
                    "body": json.dumps({
                        "status": "ok",
                        "message": f"{CARD_CONFIG[card_type]['emoji']} {CARD_CONFIG[card_type]['name']} куплен!",
                        "points_left": points - cost,
                    })}

        # POST ?action=collect — собрать накопленные очки
        if method == "POST" and action == "collect":
            body = json.loads(event.get("body") or "{}")
            email = body.get("email", "")
            password = body.get("password", "")

            user = get_user(cur, email, password)
            if not user:
                return {"statusCode": 401, "headers": CORS_HEADERS,
                        "body": json.dumps({"error": "Неверный email или пароль"})}

            user_id, points = user

            cur.execute(
                "SELECT id, card_type, last_collected_at FROM ylu_gnome_cards WHERE user_id = %s",
                (user_id,),
            )
            cards = cur.fetchall()

            if not cards:
                return {"statusCode": 400, "headers": CORS_HEADERS,
                        "body": json.dumps({"error": "У вас нет карточек гномов"})}

            total_earned = 0
            for card_id, card_type, last_collected_at in cards:
                rate = CARD_CONFIG[card_type]["rate_per_hour"]
                earned = calc_pending(last_collected_at, rate)
                if earned > 0:
                    total_earned += earned
                    cur.execute(
                        "UPDATE ylu_gnome_cards SET last_collected_at = NOW() WHERE id = %s",
                        (card_id,),
                    )

            if total_earned > 0:
                cur.execute("UPDATE ylu_users SET points = points + %s WHERE id = %s", (total_earned, user_id))

            conn.commit()

            cur.execute("SELECT points FROM ylu_users WHERE id = %s", (user_id,))
            new_points = cur.fetchone()[0]

            return {"statusCode": 200, "headers": CORS_HEADERS,
                    "body": json.dumps({
                        "status": "ok",
                        "earned": total_earned,
                        "points": new_points,
                        "message": f"Собрано {total_earned} очков!" if total_earned > 0 else "Гномы ещё не накопили очков",
                    })}

        # GET ?action=status&email=... — статус карточек
        if method == "GET" and action == "status":
            email = params.get("email", "").strip().lower()
            if not email:
                return {"statusCode": 400, "headers": CORS_HEADERS,
                        "body": json.dumps({"error": "email обязателен"})}

            cur.execute("SELECT id, points FROM ylu_users WHERE email = %s", (email,))
            row = cur.fetchone()
            if not row:
                return {"statusCode": 404, "headers": CORS_HEADERS,
                        "body": json.dumps({"error": "Пользователь не найден"})}

            user_id, points = row

            cur.execute(
                "SELECT card_type, last_collected_at FROM ylu_gnome_cards WHERE user_id = %s ORDER BY id",
                (user_id,),
            )
            cards_rows = cur.fetchall()

            cards = []
            total_pending = 0
            for card_type, last_collected_at in cards_rows:
                rate = CARD_CONFIG[card_type]["rate_per_hour"]
                pending = calc_pending(last_collected_at, rate)
                total_pending += pending
                cards.append({
                    "card_type": card_type,
                    "name": CARD_CONFIG[card_type]["name"],
                    "emoji": CARD_CONFIG[card_type]["emoji"],
                    "rate_per_hour": rate,
                    "pending": pending,
                })

            return {"statusCode": 200, "headers": CORS_HEADERS,
                    "body": json.dumps({
                        "points": points,
                        "cards": cards,
                        "total_pending": total_pending,
                    })}

        return {"statusCode": 404, "headers": CORS_HEADERS, "body": json.dumps({"error": "Not found"})}

    finally:
        cur.close()
        conn.close()
