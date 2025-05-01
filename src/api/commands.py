import click
from api.models import db, Gobernanta  # importa aquí los modelos que necesites

def setup_commands(app):

    @app.cli.command("insert-test-gobernantas")
    @click.argument("count")
    def insert_test_gobernantas(count):
        print("Creando gobernantas de prueba...")
        for x in range(1, int(count) + 1):
            g = Gobernanta(
                email=f"gobernanta{x}@hotel.com",
                password="123456"  # Ojo: sin hash, solo para pruebas
            )
            db.session.add(g)
        db.session.commit()
        print(f"{count} gobernantas creadas.")

    @app.cli.command("insert-test-data")
    def insert_test_data():
        print("Insertando datos de prueba...")
        # aquí puedes agregar más lógica si lo necesitas
