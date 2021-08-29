DROP TABLE IF EXISTS has_product_home CASCADE;

-- HAS PRODUCT IN HOME
CREATE TABLE has_product_home (
  id SERIAL PRIMARY KEY NOT NULL,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);