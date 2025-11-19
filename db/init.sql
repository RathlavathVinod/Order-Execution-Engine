CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(255) PRIMARY KEY,
  token_in VARCHAR(255) NOT NULL,
  token_out VARCHAR(255) NOT NULL,
  amount NUMERIC NOT NULL,
  order_type VARCHAR(50) NOT NULL DEFAULT 'market',
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  executed_price NUMERIC,
  tx_hash VARCHAR(255),
  error TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_token_in ON orders(token_in);
CREATE INDEX IF NOT EXISTS idx_orders_token_out ON orders(token_out);

INSERT INTO orders (id, token_in, token_out, amount, order_type, status, created_at)
VALUES
  ('ORDER_SAMPLE_001', 'So11111111111111111111111111111111111111112', 'EPjFWaLb3odcccccccccccccccccccccccccccccccccc', 1000000000, 'market', 'confirmed', NOW() - INTERVAL '1 hour'),
  ('ORDER_SAMPLE_002', 'EPjFWaLb3odcccccccccccccccccccccccccccccccccc', 'So11111111111111111111111111111111111111112', 500000000, 'market', 'pending', NOW())
ON CONFLICT (id) DO NOTHING;
