import os
from flask import Flask, jsonify, send_from_directory
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flasgger import Swagger
from dotenv import load_dotenv

# 1. Carga .env
load_dotenv()

# 2. Entorno y rutas
ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
BASE_DIR = os.path.dirname(os.path.realpath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, '../public')
DB_URL     = os.getenv("DATABASE_URL")

# 3. Crea app
app = Flask(__name__, static_folder=STATIC_DIR, static_url_path="")
Swagger(app)

# 4. JWT
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "clave_defecto")
JWTManager(app)

# 5. CORS — UNA SOLA VEZ, para /api/* y /auth/*, desde tu React en localhost:3000
CORS(app,
    origins=["http://localhost:3000"],
    supports_credentials=True,
    resources={r"/api/*": {"origins": "*"}, r"/auth/*": {"origins": "*"}},
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "Cache-Control"])


# 6. Base de datos
from api.models import db
if DB_URL:
    app.config["SQLALCHEMY_DATABASE_URI"] = DB_URL.replace("postgres://", "postgresql://")
else:
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:////tmp/test.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)
Migrate(app, db, compare_type=True)

# 7. Admin, comandos y blueprints
from api.admin     import setup_admin
from api.commands  import setup_commands
from api.routes    import api as api_bp
from api.chatbot   import chatbot_api
from api.login     import login_api

setup_admin(app)
setup_commands(app)

app.register_blueprint(api_bp,      url_prefix="/api")
app.register_blueprint(chatbot_api, url_prefix="/chatbot")
app.register_blueprint(login_api,   url_prefix="/auth")

# 8. Errores y SPA
from api.utils import APIException, generate_sitemap
@app.errorhandler(APIException)
def handle_api_error(e):
    return jsonify(e.to_dict()), e.status_code

@app.route("/")
def sitemap():
    if ENV=="development":
        return generate_sitemap(app)
    return send_from_directory(STATIC_DIR, "index.html")

@app.route("/<path:path>", methods=["GET","POST"])
def serve_spa(path):
    target = path if os.path.isfile(os.path.join(STATIC_DIR,path)) else "index.html"
    resp = send_from_directory(STATIC_DIR, target)
    resp.cache_control.max_age = 0
    return resp

@app.route("/home")
def home(): return "API funcionando correctamente"

if __name__=='__main__':
    port = int(os.getenv("PORT", 3001))
    app.run(host="0.0.0.0", port=port, debug=(ENV=="development"))
