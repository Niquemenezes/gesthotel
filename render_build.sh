#!/usr/bin/env bash
# exit on error
set -o errexit

export FLASK_APP=src/app.py
export FLASK_ENV=development
export PYTHONPATH="$PYTHONPATH:./src"

npm install
npm run build

pip install -r requirements.txt
flask db upgrade
