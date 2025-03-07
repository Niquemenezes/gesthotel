"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Category
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

# Blueprint para los endpoints de la API
api = Blueprint('api', __name__)

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