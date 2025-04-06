#!/usr/bin/env bash
# exit on error
set -o errexit

# Variables necesarias para Flask
export FLASK_APP=src/app.py
export FLASK_ENV=development
export PYTHONPATH="$PYTHONPATH:./src"

# Instalar frontend
npm install
npm run build

# Instalar dependencias con pipenv
pipenv install --deploy

# Ejecutar migraciones
pipenv run flask db upgrade

# Ejecutar la app
pipenv run start
