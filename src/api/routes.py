# api/routes.py
from api.models import db, Hoteles, Gobernanta, Recepcion, JefeMantenimiento, Branches, Maintenance, HouseKeeper, HouseKeeperTask, MaintenanceTask, Room
from flask import request, jsonify, Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.security import check_password_hash, generate_password_hash
from sqlalchemy import or_

api = Blueprint("api", __name__)

def administrador_required(fn):
    """Decorator para permitir sólo al rol administrador."""
    from flask_jwt_extended import get_jwt_identity
    @jwt_required()
    def wrapper(*args, **kwargs):
        identidad = get_jwt_identity() or {}
        if identidad.get("rol") != "administrador":
            return jsonify({"msg": "No autorizado, sólo administradores"}), 403
        return fn(*args, **kwargs)
    # Mantener el nombre original para Flask
    wrapper.__name__ = fn.__name__
    return wrapper

# --- SECCIÓN HOTELES ---

@api.route('/hoteles_by_hotel', methods=['GET'])
@jwt_required()
def obtener_hoteles_by_hotel():
    hotel_email = get_jwt_identity()
    hotel = Hoteles.query.filter_by(email=hotel_email).first()
    return jsonify(hotel.serialize()), 200

@api.route("/hoteles_by_hotel", methods=["PUT"])
@jwt_required()
def update_authenticated_hotel():
    email = get_jwt_identity()
    hotel = Hoteles.query.filter_by(email=email).first()
    if not hotel:
        return jsonify({"msg": "Hotel no encontrado"}), 404
    data = request.get_json()
    hotel.nombre = data.get("nombre", hotel.nombre)
    hotel.email = data.get("email", hotel.email)
    hotel.password = data.get("password", hotel.password)
    db.session.commit()
    return jsonify(hotel.serialize()), 200

@api.route('/hoteles_by_hotel', methods=['POST'])
@jwt_required()
def crear_hotel_desde_hotel_autenticado():
    email = get_jwt_identity()
    hotel_autenticado = Hoteles.query.filter_by(email=email).first()
    if not hotel_autenticado:
        return jsonify({"msg": "Hotel no autorizado"}), 401
    data = request.get_json()
    if "email" not in data or "password" not in data or "nombre" not in data:
        return jsonify({"msg": "Faltan campos obligatorios"}), 400
    if "@" not in data["email"]:
        return jsonify({"msg": "El email debe contener @"}), 400
    existente = Hoteles.query.filter_by(email=data["email"]).first()
    if existente:
        return jsonify({"msg": "Este email ya está registrado"}), 400
    nuevo = Hoteles(
        nombre=data["nombre"],
        email=data["email"],
        password=data["password"]
    )
    db.session.add(nuevo)
    db.session.commit()
    return jsonify(nuevo.serialize()), 201

@api.route("/hoteles_by_hotel", methods=["DELETE"])
@jwt_required()
def delete_authenticated_hotel():
    email = get_jwt_identity()
    hotel = Hoteles.query.filter_by(email=email).first()
    if not hotel:
        return jsonify({"msg": "Hotel no encontrado"}), 404
    db.session.delete(hotel)
    db.session.commit()
    return jsonify({"msg": "Hotel eliminado correctamente"}), 200



# -------------------------------------------- SECCIÓN BRANCHES ----------------------------------------------------

@api.route('/branches_by_hotel', methods=['GET'])
@jwt_required()
def obtener_branches_by_hotel():
    hotel_email = get_jwt_identity()
    hotel = Hoteles.query.filter_by(email=hotel_email).first()
    branches = Branches.query.filter_by(hotel_id=hotel.id).all()
    return jsonify([branch.serialize() for branch in branches]), 200

@api.route('/branches_by_hotel', methods=['POST'])
@jwt_required()
def create_branch_by_hotel():
    email = get_jwt_identity()
    hotel = Hoteles.query.filter_by(email=email).first()
    if not hotel:
        return jsonify({"msg": "Hotel no autorizado"}), 401
    data = request.get_json()
    def parse_float_or_none(value):
        try:
            return float(value)
        except (ValueError, TypeError):
            return None
    nueva_branch = Branches(
        nombre=data["nombre"],
        direccion=data.get("direccion"),
        latitud=parse_float_or_none(data.get("latitud")),
        longitud=parse_float_or_none(data.get("longitud")),
        hotel_id=hotel.id
    )
    db.session.add(nueva_branch)
    db.session.commit()
    return jsonify(nueva_branch.serialize()), 201

@api.route('/branches_by_hotel/<int:id>', methods=['PUT'])
@jwt_required()
def update_branch_by_hotel(id):
    email = get_jwt_identity()
    hotel = Hoteles.query.filter_by(email=email).first()
    branch = Branches.query.get(id)
    if not branch or branch.hotel_id != hotel.id:
        return jsonify({"msg": "No autorizado para editar esta sucursal"}), 401
    data = request.get_json()
    branch.nombre = data.get("nombre", branch.nombre)
    branch.direccion = data.get("direccion", branch.direccion)
    branch.latitud = data.get("latitud", branch.latitud)
    branch.longitud = data.get("longitud", branch.longitud)
    db.session.commit()
    return jsonify(branch.serialize()), 200

@api.route('/branches_by_hotel/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_branch_by_hotel(id):
    email = get_jwt_identity()
    hotel = Hoteles.query.filter_by(email=email).first()
    branch = Branches.query.get(id)
    if not branch or branch.hotel_id != hotel.id:
        return jsonify({"msg": "No tienes permiso para eliminar esta sucursal"}), 401
    db.session.delete(branch)
    db.session.commit()
    return jsonify({"msg": "Sucursal eliminada correctamente"}), 200

# --------------------------------- SECCIÓN MAINTENANCE (TÉCNICOS) -----------------------

@api.route("/maintenance_by_hotel", methods=["GET"])
@jwt_required()
def get_maintenances_by_hotel():
    user_email = get_jwt_identity()
    hotel = Hoteles.query.filter_by(email=user_email).first()
    if not hotel:
        return jsonify({"msg": "Hotel no encontrado"}), 404
    maintenances = Maintenance.query.filter_by(hotel_id=hotel.id).all()
    return jsonify([m.serialize() for m in maintenances]), 200

@api.route("/maintenance_by_hotel", methods=["POST"])
@jwt_required()
def create_maintenance():
    data = request.get_json()
    user_email = get_jwt_identity()
    hotel = Hoteles.query.filter_by(email=user_email).first()
    if not hotel:
        return jsonify({"msg": "Hotel no encontrado"}), 404
    branch_id = data.get("branch_id")
    branch = Branches.query.get(branch_id)
    if not branch or branch.hotel_id != hotel.id:
        return jsonify({"msg": "Sucursal no válida o no pertenece al hotel"}), 401
    new_maintenance = Maintenance(
        nombre=data["nombre"],
        email=data["email"],
        password=data["password"],
        photo_url=data.get("photo_url"),
        hotel_id=hotel.id,
        branch_id=branch.id
    )
    db.session.add(new_maintenance)
    db.session.commit()
    return jsonify(new_maintenance.serialize()), 201

@api.route("/maintenance_by_hotel/<int:id>", methods=["PUT"])
@jwt_required()
def update_maintenance(id):
    user_email = get_jwt_identity()
    hotel = Hoteles.query.filter_by(email=user_email).first()
    data = request.get_json()
    maintenance = Maintenance.query.get(id)
    if not maintenance or maintenance.hotel_id != hotel.id:
        return jsonify({"msg": "Técnico no encontrado o no autorizado"}), 404
    branch_id = data.get("branch_id", maintenance.branch_id)
    branch = Branches.query.get(branch_id)
    if not branch or branch.hotel_id != hotel.id:
        return jsonify({"msg": "Sucursal no válida o no pertenece al hotel"}), 401
    maintenance.nombre = data.get("nombre", maintenance.nombre)
    maintenance.email = data.get("email", maintenance.email)
    maintenance.password = data.get("password", maintenance.password)
    maintenance.photo_url = data.get("photo_url", maintenance.photo_url)
    maintenance.branch_id = branch.id
    db.session.commit()
    return jsonify(maintenance.serialize()), 200

@api.route("/maintenance_by_hotel/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_maintenance(id):
    user_email = get_jwt_identity()
    hotel = Hoteles.query.filter_by(email=user_email).first()
    maintenance = Maintenance.query.get(id)
    if not maintenance or maintenance.hotel_id != hotel.id:
        return jsonify({"msg": "Técnico no encontrado o no autorizado"}), 404
    db.session.delete(maintenance)
    db.session.commit()
    return jsonify({"msg": "Técnico eliminado"}), 200

# ------------------------------- SECCIÓN HOUSEKEEPERS (CAMARERAS DE PISO) ---------------------

@api.route('/housekeepers_by_hotel', methods=['GET'])
@jwt_required()
def get_housekeepers_by_hotel():
    email = get_jwt_identity()
    hotel = Hoteles.query.filter_by(email=email).first()
    if not hotel:
        return jsonify({"msg": "Hotel no autorizado"}), 401
    branches = Branches.query.filter_by(hotel_id=hotel.id).all()
    branch_ids = [b.id for b in branches]
    housekeepers = HouseKeeper.query.filter(HouseKeeper.branch_id.in_(branch_ids)).all()
    return jsonify([h.serialize() for h in housekeepers]), 200

@api.route('/housekeeper_by_hotel', methods=['POST'])
@jwt_required()
def create_housekeeper():
    email = get_jwt_identity()
    hotel = Hoteles.query.filter_by(email=email).first()
    if not hotel:
        return jsonify({"msg": "Hotel no autorizado"}), 401
    data = request.get_json()
    branch = Branches.query.get(data["branch_id"])
    if not branch or branch.hotel_id != hotel.id:
        return jsonify({"msg": "No puedes asignar a esta sucursal"}), 401
    nueva = HouseKeeper(
        nombre=data["nombre"],
        email=data["email"],
        password=data["password"],
        branch_id=branch.id,
        photo_url=data.get("photo_url")
    )
    db.session.add(nueva)
    db.session.commit()
    return jsonify(nueva.serialize()), 201

@api.route('/housekeeper_by_hotel/<int:id>', methods=['PUT'])
@jwt_required()
def update_housekeeper(id):
    email = get_jwt_identity()
    hotel = Hoteles.query.filter_by(email=email).first()
    if not hotel:
        return jsonify({"msg": "Hotel no autorizado"}), 401
    hk = HouseKeeper.query.get(id)
    if not hk:
        return jsonify({"msg": "Housekeeper no encontrada"}), 404
    data = request.get_json()
    new_branch_id = data.get("branch_id")
    branch = Branches.query.get(new_branch_id)
    if not branch or branch.hotel_id != hotel.id:
        return jsonify({"msg": "No tienes permiso para asignar esta sucursal"}), 401
    hk.nombre = data.get("nombre", hk.nombre)
    hk.email = data.get("email", hk.email)
    hk.password = data.get("password", hk.password)
    hk.photo_url = data.get("photo_url", hk.photo_url)
    hk.branch_id = new_branch_id
    db.session.commit()
    return jsonify(hk.serialize()), 200

@api.route('/housekeeper_by_hotel/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_housekeeper(id):
    email = get_jwt_identity()
    hotel = Hoteles.query.filter_by(email=email).first()
    if not hotel:
        return jsonify({"msg": "Hotel no autorizado"}), 401
    hk = HouseKeeper.query.get(id)
    if not hk:
        return jsonify({"msg": "Housekeeper no encontrada"}), 404
    branch = Branches.query.get(hk.branch_id)
    if not branch or branch.hotel_id != hotel.id:
        return jsonify({"msg": "No tienes permiso para eliminar esta housekeeper"}), 401
    db.session.delete(hk)
    db.session.commit()
    return jsonify({"msg": "Housekeeper eliminada"}), 200

# --- SECCIÓN HABITACIONES (ROOMS) ---

@api.route('/rooms_by_hotel', methods=['GET'])
@jwt_required()
def get_rooms_by_hotel():
    hotel_email = get_jwt_identity()
    hotel = Hoteles.query.filter_by(email=hotel_email).first()
    if not hotel:
        return jsonify({"msg": "Hotel no autorizado"}), 401
    branches = Branches.query.filter_by(hotel_id=hotel.id).all()
    branch_ids = [b.id for b in branches]
    rooms = Room.query.filter(Room.branch_id.in_(branch_ids)).all()
    response = []
    for room in rooms:
        room_data = room.serialize()
        branch = Branches.query.get(room.branch_id)
        room_data["sucursal"] = {
            "id": branch.id,
            "nombre": branch.nombre
        } if branch else None
        response.append(room_data)
    return jsonify(response), 200

@api.route('/rooms_by_hotel', methods=['POST'])
@jwt_required()
def create_room_by_hotel():
    hotel_email = get_jwt_identity()
    hotel = Hoteles.query.filter_by(email=hotel_email).first()
    if not hotel:
        return jsonify({'error': 'Hotel no autorizado'}), 401
    data = request.get_json()
    branch_id = data.get('branch_id')
    nombre = data.get('nombre')
    branch = Branches.query.filter_by(id=branch_id, hotel_id=hotel.id).first()
    if not branch:
        return jsonify({'error': 'La sucursal no pertenece al hotel autenticado'}), 400
    existing = Room.query.filter_by(nombre=nombre, branch_id=branch.id).first()
    if existing:
        return jsonify({'error': 'Ya existe una habitación con ese nombre en esta sucursal'}), 400
    nueva_room = Room(nombre=nombre, branch_id=branch.id)
    db.session.add(nueva_room)
    db.session.commit()
    return jsonify(nueva_room.serialize()), 201

@api.route('/bulk_create_rooms', methods=['POST'])
@jwt_required()
def create_multiples_rooms():
    email = get_jwt_identity()
    hotel = Hoteles.query.filter_by(email=email).first()
    if not hotel:
        return jsonify({"msg": "Hotel no autorizado"}), 401
    data = request.get_json()
    branch_id = data.get("branch_id")
    floors = data.get("floors")
    rooms_per_floor = data.get("rooms_per_floor")
    if not branch_id or not floors or not isinstance(rooms_per_floor, list):
        return jsonify({"msg": "Datos incompletos o incorrectos"}), 400
    branch = Branches.query.get(branch_id)
    if not branch or branch.hotel_id != hotel.id:
        return jsonify({"msg": "Sucursal no válida o no pertenece al hotel"}), 401
    new_rooms = []
    for floor in range(1, floors + 1):
        count = rooms_per_floor[floor - 1] if floor - 1 < len(rooms_per_floor) else rooms_per_floor[-1]
        for i in range(1, count + 1):
            room_number = int(f"{floor}{i:02d}")
            new_room = Room(nombre=str(room_number), branch_id=branch_id)
            db.session.add(new_room)
            new_rooms.append(new_room)
    db.session.commit()
    return jsonify({"msg": f"{len(new_rooms)} habitaciones creadas con éxito", "rooms": [r.serialize() for r in new_rooms]}), 201

@api.route('/rooms_by_hotel/<int:room_id>', methods=['PUT'])
@jwt_required()
def update_room_by_hotel(room_id):
    hotel_email = get_jwt_identity()
    hotel = Hoteles.query.filter_by(email=hotel_email).first()
    if not hotel:
        return jsonify({'error': 'Hotel no autorizado'}), 401
    room = Room.query.get_or_404(room_id)
    current_branch = Branches.query.filter_by(id=room.branch_id, hotel_id=hotel.id).first()
    if not current_branch:
        return jsonify({'error': 'La habitación no pertenece al hotel autenticado'}), 400
    data = request.get_json()
    new_nombre = data.get('nombre', room.nombre)
    new_branch_id = data.get('branch_id', room.branch_id)
    new_branch = Branches.query.filter_by(id=new_branch_id, hotel_id=hotel.id).first()
    if not new_branch:
        return jsonify({'error': 'La nueva sucursal no pertenece al hotel autenticado'}), 400
    duplicate = Room.query.filter(Room.id != room.id, Room.nombre == new_nombre, Room.branch_id == new_branch_id).first()
    if duplicate:
        return jsonify({'error': 'Ya existe otra habitación con ese nombre en esta sucursal'}), 400
    room.nombre = new_nombre
    room.branch_id = new_branch_id
    db.session.commit()
    return jsonify(room.serialize()), 200

@api.route('/rooms_by_hotel/<int:room_id>', methods=['DELETE'])
@jwt_required()
def delete_room_by_hotel(room_id):
    hotel_email = get_jwt_identity()
    hotel = Hoteles.query.filter_by(email=hotel_email).first()
    if not hotel:
        return jsonify({'error': 'Hotel no autorizado'}), 401
    room = Room.query.get_or_404(room_id)
    branch = Branches.query.filter_by(id=room.branch_id, hotel_id=hotel.id).first()
    if not branch:
        return jsonify({'error': 'La habitación no pertenece al hotel autenticado'}), 400
    db.session.delete(room)
    db.session.commit()
    return jsonify({'message': 'Habitación eliminada correctamente'}), 200



# ------------------------- SECCIÓN TAREAS HOUSEKEEPERS (TASKS) -----------------------------

@api.route('/housekeeper_tasks_by_hotel', methods=['GET'])
@jwt_required()
def get_housekeeper_tasks_by_hotel():
    email = get_jwt_identity()
    hotel = Hoteles.query.filter_by(email=email).first()
    if not hotel:
        return jsonify({"msg": "Hotel no autorizado"}), 401
    branches = Branches.query.filter_by(hotel_id=hotel.id).all()
    branch_ids = [b.id for b in branches]
    housekeepers = HouseKeeper.query.filter(HouseKeeper.branch_id.in_(branch_ids)).all()
    housekeeper_ids = [h.id for h in housekeepers]
    rooms = Room.query.filter(Room.branch_id.in_(branch_ids)).all()
    room_ids = [r.id for r in rooms]
    tasks = HouseKeeperTask.query.filter(
        HouseKeeperTask.housekeeper_id.in_(housekeeper_ids),
        db.or_(HouseKeeperTask.room_id == None, HouseKeeperTask.room_id.in_(room_ids))
    ).all()
    return jsonify([t.serialize() for t in tasks]), 200

@api.route('/housekeeper_tasks_by_hotel', methods=['POST'])
@jwt_required()
def create_housekeeper_task_by_hotel():
    email = get_jwt_identity()
    hotel = Hoteles.query.filter_by(email=email).first()
    if not hotel:
        return jsonify({"msg": "Hotel no autorizado"}), 401
    data = request.get_json()
    required_fields = ["nombre", "condition", "assignment_date", "submission_date", "housekeeper_id"]
    if not all(field in data for field in required_fields):
        return jsonify({"msg": "Faltan campos obligatorios"}), 400
    housekeeper = HouseKeeper.query.get(data["housekeeper_id"])
    if not housekeeper or not housekeeper.branch or housekeeper.branch.hotel_id != hotel.id:
        return jsonify({"msg": "La camarera no pertenece al hotel"}), 401
    room_id = data.get("room_id")
    if room_id:
        room = Room.query.get(room_id)
        if not room or room.branch.hotel_id != hotel.id:
            return jsonify({"msg": "Habitación no pertenece al hotel"}), 401
    new_task = HouseKeeperTask(
        nombre=data["nombre"],
        photo_url=data.get("photo_url"),
        condition=data["condition"],
        assignment_date=data["assignment_date"],
        submission_date=data["submission_date"],
        room_id=room_id,
        housekeeper_id=data["housekeeper_id"],
        nota_housekeeper=data.get("nota_housekeeper", "")
    )
    db.session.add(new_task)
    db.session.commit()
    return jsonify(new_task.serialize()), 201

@api.route('/housekeeper_tasks_by_hotel/<int:id>', methods=['PUT'])
@jwt_required()
def update_housekeeper_task_by_hotel(id):
    email = get_jwt_identity()
    hotel = Hoteles.query.filter_by(email=email).first()
    if not hotel:
        return jsonify({"msg": "Hotel no autorizado"}), 401
    task = HouseKeeperTask.query.get(id)
    if not task:
        return jsonify({"msg": "Tarea no encontrada"}), 404
    housekeepers = HouseKeeper.query.join(Branches).filter(Branches.hotel_id == hotel.id).all()
    housekeeper_ids = [h.id for h in housekeepers]
    if task.housekeeper_id not in housekeeper_ids:
        return jsonify({"msg": "Tarea no pertenece al hotel"}), 401
    data = request.get_json()
    if data.get('room_id'):
        room = Room.query.get(data['room_id'])
        if not room or room.branch.hotel_id != hotel.id:
            return jsonify({"msg": "La habitación no pertenece al hotel"}), 401
        task.room_id = data['room_id']
    else:
        task.room_id = None
    task.nombre = data.get('nombre', task.nombre)
    task.photo_url = data.get('photo_url', task.photo_url)
    task.condition = data.get('condition', task.condition)
    task.assignment_date = data.get('assignment_date', task.assignment_date)
    task.submission_date = data.get('submission_date', task.submission_date)
    db.session.commit()
    return jsonify(task.serialize()), 200

@api.route('/housekeeper_tasks_by_hotel/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_housekeeper_task_by_hotel(id):
    email = get_jwt_identity()
    hotel = Hoteles.query.filter_by(email=email).first()
    if not hotel:
        return jsonify({"msg": "Hotel no autorizado"}), 401
    task = HouseKeeperTask.query.get(id)
    if not task:
        return jsonify({"msg": "Tarea no encontrada"}), 404
    housekeepers = HouseKeeper.query.join(Branches).filter(Branches.hotel_id == hotel.id).all()
    housekeeper_ids = [h.id for h in housekeepers]
    if task.housekeeper_id not in housekeeper_ids:
        return jsonify({"msg": "No tienes permiso para eliminar esta tarea"}), 401
    db.session.delete(task)
    db.session.commit()
    return jsonify({"msg": "Tarea eliminada correctamente"}), 200

@api.route('/bulk_create_housekeeper_tasks', methods=['POST'])
@jwt_required()
def bulk_create_housekeeper_tasks():
    email = get_jwt_identity()
    hotel = Hoteles.query.filter_by(email=email).first()
    if not hotel:
        return jsonify({"msg": "Hotel no autorizado"}), 401
    data = request.get_json()
    tasks = data.get("tasks")
    if not isinstance(tasks, list) or not tasks:
        return jsonify({"msg": "Lista de tareas no válida"}), 400
    created_tasks = []
    for task_data in tasks:
        nombre = task_data.get("nombre")
        photo_url = task_data.get("photo_url", "")
        condition = task_data.get("condition", "PENDIENTE")
        assignment_date = task_data.get("assignment_date")
        submission_date = task_data.get("submission_date")
        room_id = task_data.get("room_id")
        housekeeper_id = task_data.get("housekeeper_id")
        nota_housekeeper = task_data.get("nota_housekeeper", "")
        if not all([nombre, assignment_date, submission_date, room_id, housekeeper_id]):
            continue
        housekeeper = HouseKeeper.query.get(housekeeper_id)
        if not housekeeper or not housekeeper.branch or housekeeper.branch.hotel_id != hotel.id:
            continue
        room = Room.query.get(room_id)
        if not room or room.branch.hotel_id != hotel.id:
            continue
        nueva_tarea = HouseKeeperTask(
            nombre=nombre,
            photo_url=photo_url,
            condition=condition,
            assignment_date=assignment_date,
            submission_date=submission_date,
            room_id=room_id,
            housekeeper_id=housekeeper_id,
            nota_housekeeper=nota_housekeeper
        )
        db.session.add(nueva_tarea)
        created_tasks.append(nueva_tarea)
    db.session.commit()
    return jsonify({
        "msg": f"{len(created_tasks)} tareas creadas con éxito.",
        "tareas": [t.serialize() for t in created_tasks]
    }), 201

@api.route('/bulk_housekeeper_tasks', methods=['POST'])
@jwt_required()
def create_bulk_housekeeper_tasks():
    email = get_jwt_identity()
    hotel = Hoteles.query.filter_by(email=email).first()
    if not hotel:
        return jsonify({"msg": "No autorizado"}), 401
    data = request.get_json()
    nombre = data.get("nombre")
    photo_url = data.get("photo_url")
    condition = data.get("condition", "PENDIENTE")
    assignment_date = data.get("assignment_date")
    submission_date = data.get("submission_date")
    housekeeper_id = data.get("housekeeper_id")
    room_ids = data.get("room_ids", [])
    nota_housekeeper = data.get("nota_housekeeper", "")
    housekeeper = HouseKeeper.query.get(housekeeper_id)
    if not housekeeper or housekeeper.branch.hotel_id != hotel.id:
        return jsonify({"msg": "Camarera no válida o no pertenece al hotel"}), 401
    created_tasks = []
    for room_id in room_ids:
        room = Room.query.get(room_id)
        if room and room.branch.hotel_id == hotel.id:
            new_task = HouseKeeperTask(
                nombre=nombre,
                photo_url=photo_url,
                condition=condition,
                assignment_date=assignment_date,
                submission_date=submission_date,
                housekeeper_id=housekeeper_id,
                room_id=room_id,
                nota_housekeeper=nota_housekeeper
            )
            db.session.add(new_task)
            created_tasks.append(new_task)
    db.session.commit()
    return jsonify({"msg": f"{len(created_tasks)} tareas creadas", "tasks": [t.serialize() for t in created_tasks]}), 201



# --- SECCIÓN TAREAS DE MANTENIMIENTO ---

@api.route('/maintenancetask_by_hotel', methods=['GET'])
@jwt_required()
def get_maintenance_tasks_by_hotel():
    email = get_jwt_identity()
    hotel = Hoteles.query.filter_by(email=email).first()
    if not hotel:
        return jsonify({"msg": "Hotel no autorizado"}), 401
    branch_ids = [b.id for b in Branches.query.filter_by(hotel_id=hotel.id).all()]
    room_ids = [r.id for r in Room.query.filter(Room.branch_id.in_(branch_ids)).all()]
    tech_ids = [t.id for t in Maintenance.query.filter_by(hotel_id=hotel.id).all()]
    tasks = MaintenanceTask.query.filter(
        (MaintenanceTask.maintenance_id.in_(tech_ids)) |
        ((MaintenanceTask.room_id != None) & (MaintenanceTask.room_id.in_(room_ids)))
    ).all()
    return jsonify([t.serialize() for t in tasks]), 200

@api.route('/maintenancetask_by_hotel', methods=['POST'])
@jwt_required()
def create_maintenance_task_by_hotel():
    email = get_jwt_identity()
    hotel = Hoteles.query.filter_by(email=email).first()
    if not hotel:
        return jsonify({"msg": "Hotel no autorizado"}), 401
    data = request.get_json()
    if 'nombre' not in data or 'condition' not in data or 'maintenance_id' not in data:
        return jsonify({"msg": "Faltan campos obligatorios"}), 400
    room_id = data.get('room_id')
    if room_id:
        room = Room.query.get(room_id)
        if not room or room.branch.hotel_id != hotel.id:
            return jsonify({"msg": "Habitación no pertenece al hotel"}), 401
    technician = Maintenance.query.get(data['maintenance_id'])
    if not technician or technician.hotel_id != hotel.id:
        return jsonify({"msg": "Técnico no pertenece al hotel"}), 401
    new_task = MaintenanceTask(
        nombre=data['nombre'],
        photo_url=data.get('photo_url'),
        condition=data['condition'],
        room_id=room_id,
        maintenance_id=data['maintenance_id']
    )
    db.session.add(new_task)
    db.session.commit()
    return jsonify(new_task.serialize()), 201

@api.route('/maintenancetask_by_hotel/<int:id>', methods=['PUT'])
@jwt_required()
def update_maintenance_task_by_hotel(id):
    email = get_jwt_identity()
    hotel = Hoteles.query.filter_by(email=email).first()
    if not hotel:
        return jsonify({"msg": "Hotel no autorizado"}), 401
    task = MaintenanceTask.query.get(id)
    if not task:
        return jsonify({"msg": "Tarea no encontrada"}), 404
    technician = Maintenance.query.get(task.maintenance_id)
    if not technician or technician.hotel_id != hotel.id:
        return jsonify({"msg": "Tarea no pertenece al hotel"}), 401
    data = request.get_json()
    task.nombre = data.get('nombre', task.nombre)
    task.condition = data.get('condition', task.condition)
    task.photo_url = data.get('photo_url', task.photo_url)
    task.room_id = data.get('room_id', task.room_id)
    db.session.commit()
    return jsonify(task.serialize()), 200

@api.route('/maintenancetask_by_hotel/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_maintenance_task_by_hotel(id):
    email = get_jwt_identity()
    hotel = Hoteles.query.filter_by(email=email).first()
    if not hotel:
        return jsonify({"msg": "Hotel no autorizado"}), 401
    task = MaintenanceTask.query.get(id)
    if not task:
        return jsonify({"msg": "Tarea no encontrada"}), 404
    technician = Maintenance.query.get(task.maintenance_id)
    if not technician or technician.hotel_id != hotel.id:
        return jsonify({"msg": "No tienes permiso para eliminar esta tarea"}), 401
    db.session.delete(task)
    db.session.commit()
    return jsonify({"msg": "Tarea eliminada correctamente"}), 200


# ruta para que cuando selecione la tarea de housekeeper traiga solamente las habitaciones dela branche que ella pertenece

# --- RUTAS DE APOYO: habitaciones por housekeeper o branch ---

@api.route('/rooms_by_housekeeper/<int:housekeeper_id>', methods=['GET'])
@jwt_required()
def get_rooms_by_housekeeper(housekeeper_id):
    email = get_jwt_identity()
    hotel = Hoteles.query.filter_by(email=email).first()
    if not hotel:
        return jsonify({"msg": "Hotel no autorizado"}), 401
    housekeeper = HouseKeeper.query.get(housekeeper_id)
    if not housekeeper or not housekeeper.branch or housekeeper.branch.hotel_id != hotel.id:
        return jsonify({"msg": "No autorizado para ver las habitaciones de esta housekeeper"}), 401
    rooms = Room.query.filter_by(branch_id=housekeeper.branch_id).all()
    return jsonify([room.serialize() for room in rooms]), 200

@api.route('/rooms_by_branch/<int:branch_id>', methods=['GET'])
@jwt_required()
def get_rooms_by_branch(branch_id):
    email = get_jwt_identity()
    hotel = Hoteles.query.filter_by(email=email).first()
    branch = Branches.query.get(branch_id)
    if not branch or branch.hotel_id != hotel.id:
        return jsonify({"msg": "Sucursal no autorizada"}), 401
    rooms = Room.query.filter_by(branch_id=branch_id).all()
    return jsonify([r.serialize() for r in rooms]), 200


# --- NUEVO: SECCIÓN STATUS HABITACIONES PARA RECEPCIÓN ---

@api.route('/rooms_status_by_hotel', methods=['GET'])
@jwt_required()
def rooms_status_by_hotel():
    email = get_jwt_identity()
    hotel = Hoteles.query.filter_by(email=email).first()
    if not hotel:
        return jsonify({"msg": "Hotel no autorizado"}), 401

    branches = Branches.query.filter_by(hotel_id=hotel.id).all()
    branch_ids = [b.id for b in branches]

    rooms = Room.query.filter(Room.branch_id.in_(branch_ids)).all()

    # Aquí luego podríamos cruzar si están ocupadas (cuando tengamos modelo de reservas)
    # De momento, enviamos sólo si están limpias o sucias
    response = []
    for room in rooms:
        room_data = room.serialize()
        estado = "limpia" if room_data.get("condition") == "LIMPIA" else "sucia"
        response.append({
            "id": room.id,
            "nombre": room.nombre,
            "branch_id": room.branch_id,
            "branch_nombre": room.branch_nombre,
            "estado": estado,
            "ocupada": False  # De momento, todas libres hasta que creemos el módulo de reservas
        })

    return jsonify(response), 200

