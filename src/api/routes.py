
"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from api.models import db, User, Hoteles, Theme, Category


# Blueprint para los endpoints de la API
api = Blueprint('api', __name__)
app = Flask(__name__)
# Permitir solicitudes CORS a esta API
CORS(api)

# Endpoint de prueba para la API
@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }
    return jsonify(response_body), 200

# Obtener todas las categorías
@api.route('/categories', methods=['GET'])
def obtener_categories():
    categories = Category.query.all()  # Obtener todas las categorías
    categories_serialize = [category.serialize() for category in categories]  # Serializar cada categoría
    return jsonify(categories_serialize), 200  # Retornar los datos serializados como JSON

# Crear una nueva categoría
@api.route('/categories', methods=['POST'])
def crear_category():
    data = request.get_json()

    # Validación: Verificar que se reciba el nombre
    if not data.get("nombre"):
        return jsonify({"error": "El nombre de la categoría es obligatorio"}), 400

    # Verificar si la categoría ya existe
    existing_category = Category.query.filter_by(nombre=data["nombre"]).first()
    if existing_category:
        return jsonify({"error": "Categoría con este nombre ya existe"}), 400

    # Crear nueva categoría
    nuevo_category = Category(
        nombre=data["nombre"],
    )
    db.session.add(nuevo_category)
    db.session.commit()

    return jsonify(nuevo_category.serialize()), 201  # Usar código 201 para creación exitosa

# Eliminar una categoría por ID
@api.route("/categories/<int:id>", methods=["DELETE"])
def delete_category(id):
    category = Category.query.get(id)

    if not category:
        return jsonify({"error": "Categoría no encontrada"}), 404  # Código 404 para no encontrado

    db.session.delete(category)
    db.session.commit()

    return jsonify({"message": "Categoría eliminada"}), 200

# Actualizar una categoría por ID
@api.route("/categories/<int:id>", methods=["PUT"])
def actualizar_category(id):
    category = Category.query.get(id)

    if not category:
        return jsonify({"error": "Categoría no encontrada"}), 404  # Código 404 para no encontrado

    data = request.get_json()

    # Validación para el nombre
    if not data.get("nombre"):
        return jsonify({"error": "El nombre de la categoría es obligatorio"}), 400

    category.nombre = data.get("nombre", category.nombre)  # Actualizar el nombre
    db.session.commit()

    return jsonify(category.serialize()), 200  # Código 200 para solicitud exitosa


@api.route('/user', methods=['GET'])
def get_users():
    users = User.query.all()
    if not users:
        return jsonify(message="No users found"), 404
    all_users = list(map(lambda x: x.serialize(), users))
    return jsonify(message="Users", users=all_users), 200


@api.route('/theme', methods=['GET'])
def get_themes():
    themes = Theme.query.all()
    if not themes:
        return jsonify(message="No themes found"), 404
    all_themes = list(map(lambda x: x.serialize(), themes))
    return jsonify(message="Themes", themes=all_themes), 200

@api.route('/theme/<int:id>', methods=['GET'])
def get_theme_by_id(id):
    theme = Theme.query.get(id)
    if not theme:
        return jsonify(message="Theme not found"), 404
    return jsonify(message="Theme", theme=theme.serialize()), 200

@api.route('/theme', methods=['POST'])
def add_new_theme():
    body = request.get_json(silent=True)
    if body is None:
        return jsonify({"msg": "Body missing"}), 400
    if "nombre" not in body:
        return jsonify({"msg": "nombre missing"}), 400
    
    new_theme = Theme()
    new_theme.nombre = body['nombre']
    
    try:
        with db.session.begin():
            db.session.add(new_theme)
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": f"Error creating theme: {str(e)}"}), 500
    
    return jsonify({'msg': f'Theme {body["nombre"]} has been created', 'theme': new_theme.serialize()}), 201

@api.route('/theme/<int:id>', methods=['PUT'])
def update_theme(id):
    theme = Theme.query.get(id)
    if not theme:
        return jsonify(message="Theme not found"), 404
    
    data = request.get_json()
    if 'nombre' in data:
        theme.nombre = data['nombre']
    
    db.session.commit()
    
    return jsonify(message="Theme updated successfully", theme=theme.serialize()), 200

@api.route('/theme/<int:id>', methods=['DELETE'])
def delete_theme(id):
    theme = Theme.query.get(id)
    if not theme:
        return jsonify(message="Theme not found"), 404
    
    db.session.delete(theme)
    db.session.commit()
    
    return jsonify(message="Theme deleted successfully"), 200


@api.route('/hoteles', methods=['GET'])
def obtener_hoteles():
    hoteles = Hoteles.query.all()  # Obtener todos los hotel
    hoteles_serialize = [hotel.serialize() for hotel in hoteles]  # Serializar cada hotel
    return jsonify(hoteles_serialize), 200  # Retornar los datos serializados como JSON

@api.route("/hoteles/<int:id>", methods=["GET"])
def obtener_hotel_por_id(id):
    hotel = Hoteles.query.get(id)
    
    if not hotel:
        return jsonify({"error": "Hotel no encontrado"}), 404
    
    return jsonify(hotel.serialize()), 200

@api.route('/hoteles', methods=['POST'])
def crear_hoteles():
        data = request.get_json()
        #crear hoteles
        if "password" not in data or not data["password"]:
            return jsonify({"error": "Password is requires"}), 400
        if "email" not in data or not data["email"]:
            return jsonify({"error": "Email is required"}), 400
    
        # Validar que el email contenga "@"
        if "@" not in data["email"]:
            return jsonify({"error": "Email must contain '@'"}), 400
        
        existing_hotel = Hoteles.query.filter_by(nombre=data["nombre"]).first()
        if existing_hotel:
            return jsonify({"error": "Hotel con este nombre ya existe"}), 400
        
        # Verificar si el email ya está registrado
        existing_email = Hoteles.query.filter_by(email=data["email"]).first()
        if existing_email:
            return jsonify({"error": "Email is already in use"}), 400
            
        nuevo_hotel =Hoteles(
            nombre=data["nombre"],
            email=data["email"],
             password=data["password"]
        )
        db.session.add(nuevo_hotel)
        db.session.commit()
    
        return jsonify(nuevo_hotel.serialize()), 200

@api.route("/hoteles/<int:id>", methods=["DELETE"])
def delete_hoteles(id):
    hotel = Hoteles.query.get(id)
    
    if not hotel:
        return jsonify({"error": "Hotel no encontrado"}), 400

    db.session.delete(hotel)
    db.session.commit()

    return jsonify({"message" : "Hotel eliminado"}), 200

@api.route("/hoteles/<int:id>", methods=["PUT"])
def actualizar_hoteles(id):
    hotel = Hoteles.query.get(id)
    
    if not hotel:
        return jsonify({"error": "Hotel no encontrado"}), 400

    data = request.get_json()

    hotel.nombre = data.get("nombre", hotel.nombre)
    hotel.email = data.get("email", hotel.email)

    db.session.commit()

    return jsonify(hotel.serialize()), 200

