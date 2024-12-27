#!/usr/bin/env bash
set -e

echo "=== Setting up the FET Project ==="

# 1) Check for Node
if ! command -v node &> /dev/null; then
  echo "[1/5] Node.js not found, installing..."
  sudo apt-get update
  sudo apt-get install -y nodejs npm
else
  echo "[1/5] Node.js is already installed."
fi

# 2) Check for PostgreSQL
if ! command -v psql &> /dev/null; then
  echo "[2/5] PostgreSQL not found, installing..."
  sudo apt-get update
  sudo apt-get install -y postgresql postgresql-contrib
  sudo service postgresql start
else
  echo "[2/5] PostgreSQL is already installed."
fi

# 3) Install local dependencies
echo "[3/5] Installing npm packages..."
npm install

# 4) Create DB & user if not exists
echo "[4/5] Ensuring DB and user exist..."
sudo -u postgres psql -c "CREATE DATABASE fet_db;" 2>/dev/null || true
sudo -u postgres psql -c "CREATE USER postgres WITH PASSWORD 'bjornlovesyou';" 2>/dev/null || true
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE fet_db TO postgres;" 2>/dev/null || true

# 5) Run migrations and build
echo "[5/5] Running migrations and building app..."
npx sequelize-cli db:migrate
npm run build

echo "=== Setup complete! You can run 'npm run server' now. ==="
