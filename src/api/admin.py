import os
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from wtforms import ValidationError
from .models import db, Hoteles, Branches, Maintenance, HouseKeeper, HouseKeeperTask, Room, MaintenanceTask, Gobernanta, Recepcion, JefeMantenimiento

# Función de validación de email único
def email_unico(model, modelo_clase):
    existente = modelo_clase.query.filter_by(email=model.email).first()
    if existente and (not model.id or model.id != existente.id):
        raise ValidationError("El email ya está registrado.")

# Vistas personalizadas
class HotelAdmin(ModelView):
    def on_model_change(self, form, model, is_created):
        email_unico(model, Hoteles)
        return super().on_model_change(form, model, is_created)

class MaintenanceAdmin(ModelView):
    def on_model_change(self, form, model, is_created):
        email_unico(model, Maintenance)
        return super().on_model_change(form, model, is_created)

class HouseKeeperAdmin(ModelView):
    def on_model_change(self, form, model, is_created):
        email_unico(model, HouseKeeper)
        return super().on_model_change(form, model, is_created)

class GobernantaAdmin(ModelView):
    def on_model_change(self, form, model, is_created):
        email_unico(model, Gobernanta)
        return super().on_model_change(form, model, is_created)

class RecepcionAdmin(ModelView):
    def on_model_change(self, form, model, is_created):
        email_unico(model, Recepcion)
        return super().on_model_change(form, model, is_created)

class JefeMantenimientoAdmin(ModelView):
    def on_model_change(self, form, model, is_created):
        email_unico(model, JefeMantenimiento)
        return super().on_model_change(form, model, is_created)

def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample_key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='GestHotel Admin', template_mode='bootstrap3')

    admin.add_view(HotelAdmin(Hoteles, db.session, name="Hoteles"))
    admin.add_view(ModelView(Branches, db.session, name="Sucursales"))
    admin.add_view(MaintenanceAdmin(Maintenance, db.session, name="Técnicos"))
    admin.add_view(HouseKeeperAdmin(HouseKeeper, db.session, name="Camareras de Piso"))
    admin.add_view(ModelView(HouseKeeperTask, db.session, name="Tareas Limpieza"))
    admin.add_view(ModelView(MaintenanceTask, db.session, name="Tareas Mantenimiento"))
    admin.add_view(ModelView(Room, db.session, name="Habitaciones"))
    admin.add_view(GobernantaAdmin(Gobernanta, db.session, name="Gobernantas"))
    admin.add_view(RecepcionAdmin(Recepcion, db.session, name="Recepcionistas"))
    admin.add_view(JefeMantenimientoAdmin(JefeMantenimiento, db.session, name="Jefes de Mantenimiento"))