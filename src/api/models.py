from flask_sqlalchemy import SQLAlchemy

# Inicializamos la instancia de SQLAlchemy
db = SQLAlchemy()

# Definición del modelo User
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)  # Mejor no hacer unique en contraseñas
    is_active = db.Column(db.Boolean(), default=True, nullable=False)  # Default a True para usuario activo

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        """Método de serialización, omite la contraseña por razones de seguridad"""
        return {
            "id": self.id,
            "email": self.email,
            # No se debe serializar la contraseña por razones de seguridad
        }

# Definición del modelo Category
class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(120), nullable=False)

    def __repr__(self):
        return f'<Category {self.nombre}>'

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
        }