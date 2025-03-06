import os
from flask import Flask, request, jsonify, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from flask_cors import CORS
from api.utils import APIException, generate_sitemap
from api.models import db, User
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands


# Configuración del entorno
ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), '../public/')

app = Flask(__name__)
app.url_map.strict_slashes = False

# Configuración de la base de datos
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace("postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

CORS(app)

setup_admin(app)
setup_commands(app)

# Registrar el Blueprint de la API
app.register_blueprint(api, url_prefix='/api')

@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# Ruta principal para obtener el sitemap
@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# Ruta para servir archivos estáticos
@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0
    return response


@app.route('/api/user', methods=['POST'])
def add_new_user():
    body = request.get_json(silent=True)
    if body is None: 
        return jsonify({"msg": "Body missing"}), 400
    if "theme" not in body:
        return jsonify({"msg": "theme missing"})
    
    new_user = User()
    new_user.theme = body['theme']
    
    # Usar el contexto de la sesión para manejar la transacción de manera segura
    try:
        with db.session.begin():
            db.session.add(new_user)
        # Si todo sale bien, la transacción se comprometerá automáticamente al salir del bloque
    except Exception as e:
        db.session.rollback()  # En caso de error, hacer rollback de la transacción
        return jsonify({"msg": f"Error creating user: {str(e)}"}), 500

    return jsonify({'msg': f'User with theme {body["theme"]} has been created', 'user': new_user.serialize()}), 201

if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
