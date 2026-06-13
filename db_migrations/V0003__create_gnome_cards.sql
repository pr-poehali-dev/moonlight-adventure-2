CREATE TABLE IF NOT EXISTS ylu_gnome_cards (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES ylu_users(id),
    card_type SMALLINT NOT NULL,
    purchased_at TIMESTAMP DEFAULT NOW(),
    last_collected_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gnome_cards_user ON ylu_gnome_cards(user_id);
