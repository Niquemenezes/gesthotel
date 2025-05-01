from flask_sqlalchemy import SQLAlchemy
import datetime


db = SQLAlchemy()


class Hoteles(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(120), unique=True, nullable=False)
    email = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(256), nullable=False)

    def __repr__(self):
        return f'<Hoteles {self.nombre}>'

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "email": self.email
        }


class Gobernanta(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(256), nullable=False)
    hotel_id = db.Column(db.Integer, db.ForeignKey('hoteles.id'), nullable=False)

    hotel = db.relationship("Hoteles")

    def __repr__(self):
        return f'<Gobernanta {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "hotel_id": self.hotel_id
        }


class Recepcion(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(256), nullable=False)
    hotel_id = db.Column(db.Integer, db.ForeignKey('hoteles.id'), nullable=False)

    hotel = db.relationship("Hoteles")

    def __repr__(self):
        return f'<Recepcion {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "hotel_id": self.hotel_id
        }


class JefeMantenimiento(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(256), nullable=False)
    hotel_id = db.Column(db.Integer, db.ForeignKey('hoteles.id'), nullable=False)

    hotel = db.relationship("Hoteles")

    def __repr__(self):
        return f'<JefeMantenimiento {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "hotel_id": self.hotel_id
        }


class Branches(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(120), nullable=False)
    direccion = db.Column(db.String(120), nullable=False)
    longitud = db.Column(db.Float, nullable=True)
    latitud = db.Column(db.Float, nullable=True)
    hotel_id = db.Column(db.Integer, db.ForeignKey('hoteles.id'), nullable=False)

    hotel = db.relationship("Hoteles")

    def __repr__(self):
        return f'<Branches {self.nombre}>'

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "direccion": self.direccion,
            "longitud": self.longitud,
            "latitud": self.latitud,
            "hotel_id": self.hotel_id
        }


class Room(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(120), nullable=False)
    branch_id = db.Column(db.Integer, db.ForeignKey('branches.id'), nullable=False)

    branch = db.relationship("Branches")
    maintenance_tasks = db.relationship("MaintenanceTask", back_populates="room", cascade="all, delete-orphan")
    housekeeper_tasks = db.relationship("HouseKeeperTask", back_populates="room", cascade="all, delete-orphan")

    def __repr__(self):
        return f'<Room {self.nombre}>'

    def serialize(self):
        return {
            'id': self.id,
            'nombre': self.nombre,
            'branch_id': self.branch_id,
            'branch_nombre': self.branch.nombre if self.branch else None
        }


class Maintenance(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(256), nullable=False)
    photo_url = db.Column(db.String(300), nullable=True)
    hotel_id = db.Column(db.Integer, db.ForeignKey('hoteles.id'), nullable=False)
    branch_id = db.Column(db.Integer, db.ForeignKey('branches.id'), nullable=False)

    hotel = db.relationship('Hoteles')
    branch = db.relationship('Branches')

    def __repr__(self):
        return f'<Maintenance {self.nombre}>'

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "email": self.email,
            "photo_url": self.photo_url,
            "hotel_id": self.hotel_id,
            "hotel_nombre": self.hotel.nombre if self.hotel else None,
            "branch_id": self.branch_id,
            "branch_nombre": self.branch.nombre if self.branch else None
        }


class HouseKeeper(db.Model):
    __tablename__ = 'housekeeper'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(120), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(256), nullable=False)
    photo_url = db.Column(db.String(300), nullable=True)
    branch_id = db.Column(db.Integer, db.ForeignKey('branches.id'), nullable=True)

    branch = db.relationship('Branches')

    def __repr__(self):
        return f'<HouseKeeper {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "email": self.email,
            "photo_url": self.photo_url,
            "branch_id": self.branch_id,
            "branch_nombre": self.branch.nombre if self.branch else None
        }


class HouseKeeperTask(db.Model):
    __tablename__ = 'housekeepertask'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(120), nullable=False)
    photo_url = db.Column(db.String(500), nullable=True)
    condition = db.Column(db.String(80), nullable=False, default='PENDIENTE')
    assignment_date = db.Column(db.String(80), nullable=False)
    submission_date = db.Column(db.String(80), nullable=False)
    room_id = db.Column(db.Integer, db.ForeignKey('room.id'), nullable=True)
    housekeeper_id = db.Column(db.Integer, db.ForeignKey('housekeeper.id'), nullable=True)
    nota_housekeeper = db.Column(db.String(500))
    start_time = db.Column(db.DateTime, nullable=True)
    end_time = db.Column(db.DateTime, nullable=True)

    room = db.relationship('Room', back_populates='housekeeper_tasks')
    housekeeper = db.relationship('HouseKeeper', backref='housekeepertask')

    def __repr__(self):
        return f'<HouseKeeperTask {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "photo_url": self.photo_url,
            "condition": self.condition,
            "assignment_date": self.assignment_date,
            "submission_date": self.submission_date,
            "room_id": self.room_id,
            "room_nombre": self.room.nombre if self.room else None,
            "branch_id": self.room.branch_id if self.room else None,
            "branch_nombre": self.room.branch.nombre if self.room and self.room.branch else None,
            "housekeeper_id": self.housekeeper_id,
            "housekeeper_nombre": self.housekeeper.nombre if self.housekeeper else None,
            "nota_housekeeper": self.nota_housekeeper,
            "start_time": self.start_time.isoformat() if self.start_time else None,
            "end_time": self.end_time.isoformat() if self.end_time else None
        }


class MaintenanceTask(db.Model):
    __tablename__ = 'maintenancetask'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(120), nullable=False)
    photo_url = db.Column(db.String(500), nullable=True)
    condition = db.Column(db.String(120), nullable=True)
    room_id = db.Column(db.Integer, db.ForeignKey('room.id'), nullable=True)
    maintenance_id = db.Column(db.Integer, db.ForeignKey('maintenance.id'), nullable=True)
    housekeeper_id = db.Column(db.Integer, db.ForeignKey('housekeeper.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    finalizado_por = db.Column(db.String(120), nullable=True)
    start_time = db.Column(db.DateTime, nullable=True)
    end_time = db.Column(db.DateTime, nullable=True)

    room = db.relationship('Room', back_populates='maintenance_tasks')
    maintenance = db.relationship('Maintenance')
    housekeeper = db.relationship('HouseKeeper')

    def __repr__(self):
        return f'<MaintenanceTask {self.nombre}>'

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "photo_url": self.photo_url,
            "condition": self.condition,
            "room_id": self.room_id,
            "room_nombre": self.room.nombre if self.room else None,
            "maintenance_id": self.maintenance_id,
            "maintenance_nombre": self.maintenance.nombre if self.maintenance else None,
            "housekeeper_id": self.housekeeper_id,
            "housekeeper_nombre": self.housekeeper.nombre if self.housekeeper else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "finalizado_por": self.finalizado_por,
            "start_time": self.start_time.isoformat() if self.start_time else None,
            "end_time": self.end_time.isoformat() if self.end_time else None
        }
