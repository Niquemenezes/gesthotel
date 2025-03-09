import os
from flask_admin import Admin
from .models import db, User, Hoteles, Theme
from flask_admin.contrib.sqla import ModelView
from .models import db, User, Category

def setup_admin(app):
    # Configuración de la clave secreta y la interfaz de administración
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample_key')  # Usamos un valor predeterminado 'sample_key' si no está definida
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'  # Define el tema de la interfaz de administración
    
    # Creación de la instancia de Admin
    admin = Admin(app, name='4Geeks Admin', template_mode='bootstrap3')

    # Agregar los modelos al panel de administración
    # Agregamos el modelo de Usuario al admin
    admin.add_view(ModelView(User, db.session, name='Usuarios'))
    
    # Agregamos el modelo de Categorías al admin
    admin.add_view(ModelView(Category, db.session, name='Categorías'))
    # Add your models here, for example this is how we add a the User model to the admin
    admin.add_view(ModelView(User, db.session))
    admin.add_view(ModelView(Hoteles, db.session))
    admin.add_view(ModelView(Theme, db.session))

    # Aquí puedes agregar más modelos a la interfaz de administración si lo necesitas
    # admin.add_view(ModelView(YourModelName, db.session, name='YourModelName'))