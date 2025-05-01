from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from werkzeug.security import generate_password_hash, check_password_hash
from api.models import Hoteles, Gobernanta, Recepcion, JefeMantenimiento, db
from functools import wraps

login_api = Blueprint('login_api', __name__)

# Diccionario de modelos según el rol
modelos_por_rol = {
    "gobernanta": Gobernanta,
    "recepcion": Recepcion,
    "jefe de mantenimiento": JefeMantenimiento
}

# Diccionario para normalizar valores desde el frontend
roles_normalizados = {
    "administrador": "administrador",
    "recepcion": "recepcion",
    "gobernanta": "gobernanta",
    "jefe de mantenimiento": "jefe de mantenimiento",
    "camarera de piso": "camarera de piso",
    "mantenimiento": "mantenimiento"
}

# Decorador para proteger rutas por rol
def rol_requerido(roles):
    def decorador(func):
        @wraps(func)
        @jwt_required()
        def wrapper(*args, **kwargs):
            identidad = get_jwt_identity()
            if not identidad or identidad.get("rol") not in roles:
                return jsonify({"msg": "No autorizado"}), 403
            return func(*args, **kwargs)
        return wrapper
    return decorador

# -------- LOGIN UNIFICADO PARA TODOS LOS ROLES --------
@login_api.route("/login", methods=["POST"])
def login_unico():
    data = request.get_json() or {}
    email = data.get("email")
    password = data.get("password")
    rol_recibido = data.get("rol")
    
    if not email or not password or not rol_recibido:
        return jsonify({"msg": "Faltan campos"}), 400

    rol_limpio = rol_recibido.strip().lower()
    rol = roles_normalizados.get(rol_limpio)
    if not rol:
        return jsonify({"msg": f"Rol no válido: {rol_recibido}"}), 400

    # Selección de modelo según rol
    if rol == "administrador":
        user = Hoteles.query.filter_by(email=email).first()
    else:
        modelo = modelos_por_rol.get(rol)
        user = modelo.query.filter_by(email=email).first() if modelo else None

    if not user or not check_password_hash(user.password, password):
        return jsonify({"msg": "Credenciales inválidas"}), 401

    token = create_access_token(identity={"email": user.email, "rol": rol})
    return jsonify({"msg": "Login exitoso", "token": token, "rol": rol}), 200

# -------- REGISTRO ADMINISTRADOR (único signup público) --------
@login_api.route("/signupadmin", methods=["POST"])
def signup_admin():
    data = request.get_json() or {}
    email = data.get("email")
    password = data.get("password")
    nombre = data.get("nombre")
    if not email or not password or not nombre:
        return jsonify({"msg": "Faltan datos obligatorios"}), 400
    if "@" not in email or Hoteles.query.filter_by(email=email).first():
        return jsonify({"msg": "Email no válido o ya existe"}), 400

    nuevo = Hoteles(
        nombre=nombre,
        email=email,
        password=generate_password_hash(password)
    )
    db.session.add(nuevo)
    db.session.commit()
    token = create_access_token(identity={"email": email, "rol": "administrador"})
    return jsonify({
    "msg": "Administrador registrado correctamente",
    "token": token,
    "rol": "administrador"
}), 201


# -------- CREAR NUEVOS USUARIOS (solo para administrador) --------
@login_api.route("/admin/signup", methods=["POST"])
@rol_requerido(["administrador"])
def crear_usuario():
    data = request.get_json() or {}
    email = data.get("email")
    password = data.get("password")
    rol = data.get("rol")

    if not email or not password or not rol:
        return jsonify({"msg": "Faltan campos obligatorios"}), 400

    modelo = modelos_por_rol.get(rol)
    if not modelo:
        return jsonify({"msg": f"Rol no válido: {rol}"}), 400

    if modelo.query.filter_by(email=email).first():
        return jsonify({"msg": "Este correo ya está en uso"}), 400

    nuevo = modelo(email=email, password=generate_password_hash(password))
    db.session.add(nuevo)
    db.session.commit()

    return jsonify({"msg": f"Usuario {rol} creado correctamente"}), 201

# -------- RUTAS PRIVADAS POR ROL --------
@login_api.route("/private/gobernanta", methods=["GET"])
@rol_requerido(["gobernanta"])
def vista_gobernanta():
    return jsonify({"ok": "Bienvenida gobernanta"}), 200

@login_api.route("/private/camarera", methods=["GET"])
@rol_requerido(["camarera de piso"])
def vista_camarera():
    return jsonify({"ok": "Bienvenida camarera de piso"}), 200

@login_api.route("/private/recepcion", methods=["GET"])
@rol_requerido(["recepcion"])
def vista_recepcion():
    return jsonify({"ok": "Bienvenida recepcionista"}), 200

@login_api.route("/private/mantenimiento", methods=["GET"])
@rol_requerido(["mantenimiento"])
def vista_mantenimiento():
    return jsonify({"ok": "Bienvenido técnico de mantenimiento"}), 200

@login_api.route("/private/jefe-mantenimiento", methods=["GET"])
@rol_requerido(["jefe de mantenimiento"])
def vista_jefe_mantenimiento():
    return jsonify({"ok": "Bienvenido jefe de mantenimiento"}), 200

@login_api.route("/private/administrador", methods=["GET"])
@rol_requerido(["administrador"])
def vista_administrador():
    return jsonify({"ok": "Bienvenido administrador"}), 200
