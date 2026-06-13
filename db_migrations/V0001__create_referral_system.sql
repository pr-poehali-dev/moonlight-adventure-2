
CREATE TABLE IF NOT EXISTS ylu_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    ref_code VARCHAR(20) UNIQUE NOT NULL,
    referred_by VARCHAR(20) DEFAULT NULL,
    points INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ylu_referrals (
    id SERIAL PRIMARY KEY,
    referrer_code VARCHAR(20) NOT NULL,
    invited_user_id INTEGER REFERENCES ylu_users(id),
    points_awarded INTEGER DEFAULT 10,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ylu_users_ref_code ON ylu_users(ref_code);
CREATE INDEX IF NOT EXISTS idx_ylu_referrals_referrer ON ylu_referrals(referrer_code);
