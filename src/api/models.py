from flask_sqlalchemy import SQLAlchemy

# Inicializamos la instancia de SQLAlchemy
db = SQLAlchemy()

# Definición del modelo User
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)  # Mejor no hacer unique en contraseñas
    is_active = db.Column(db.Boolean(), default=True, nullable=False)  # Default a True para usuario activo
    theme = db.Column(db.String(120), unique=True, nullable=False)

    def __repr__(self):
        return f'<User {self.id}>'

    def serialize(self):
        """Método de serialización, omite la contraseña por razones de seguridad"""
        return {
            "id": self.id,
            "email": self.email,
            # No se debe serializar la contraseña por razones de seguridad
        }

     

class Hoteles(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(120), unique=True, nullable=False)
    email = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)
    
    def __repr__(self):
        return f'<Hoteles {self.nombre}>'

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "email": self.email,
            "password": self.password
        }
    
class Theme(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(120), unique=True, nullable=False)

    def __repr__(self):
        return f'<Theme {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
        }

class HotelTheme(db.Model):
    __tablename__ = 'hoteltheme'
    id = db.Column(db.Integer, primary_key=True)
    id_hoteles = db.Column(db.Integer, db.ForeignKey('hoteles.id'), nullable=True)
    id_theme = db.Column(db.Integer, db.ForeignKey('theme.id'), nullable=True)

    hoteles = db.relationship('Hoteles', backref='hoteltheme')
    theme = db.relationship('Theme', backref='hoteltheme')

    def __repr__(self):
        return f'<HotelTheme {self.id}>'
    
    def serialize(self):
        return {
            "id": self.id,
            "id_hoteles": self.id_hoteles,
            "id_theme": self.id_theme
        }
# Definición del modelo Category
class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(120), nullable=False)

    def __repr__(self):
        return f'<Category {self.nombre}>'
            # do not serialize the password, its a security breach
    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
        }
    
class Branches(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(120), nullable=False)
    direccion = db.Column(db.String(120), nullable=False)
    longitud = db.Column(db.Float, nullable=False)
    latitud = db.Column(db.Float, nullable=False)
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