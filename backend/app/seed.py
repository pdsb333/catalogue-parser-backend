# seed.py
import random
from sqlmodel import Session, select
from app.models import Parser, Categorie, User
from app.core import engine, hasher_mot_de_passe


def seed_data():
    with Session(engine) as session:
        try:
            # Ajouter les utilisateurs
            users_to_seed = [
                { "email": "admin@example.com"},
                {"email": "user@example.com"}
            ]
            for user_data in users_to_seed:
                user = session.exec(select(User).where(User.email == user_data["email"])).first()
                if not user:
                    user = User(
                        password=hasher_mot_de_passe("fakehashedpassword"),
                        email=user_data["email"]
                    )
                    session.add(user)
                    session.commit()

            # Récupérer admin1
            admin = session.exec(select(User).where(User.email == "admin@example.com")).first()
            if not admin:
                raise Exception("Utilisateur admin1 non trouvé après création.")

            # Ajouter les catégories
            categories = {}
            for name in ["natif", "ajouté"]:
                categorie = session.exec(select(Categorie).where(Categorie.name == name)).first()
                if not categorie:
                    categorie = Categorie(name=name, admin_id=admin.id)
                    session.add(categorie)
                    session.commit()
                    session.refresh(categorie)
                categories[name] = categorie

            # Détails techniques des parsers à insérer
            raw_parsers = [
                {
                    "name": "apache",
                    "extra": {
                        "Format": "regex",
                        "Regex": r'^(?P<host>[^ ]*) [^ ]* (?P<user>[^ ]*) \[(?P<time>[^\]]*)\] "(?P<method>\S+)(?: +(?P<path>[^"]*?)(?: +\S)?)?" (?P<code>[^ ]*) (?P<size>[^ ]*)',
                        "Time_Key": "time",
                        "Time_Format": "%d/%b/%Y:%H:%M:%S %z"
                    }
                },
                {
                    "name": "apache2",
                    "extra": {
                        "Format": "regex",
                        "Regex": r'^(?P<host>[^ ]*) [^ ]* (?P<user>[^ ]*) \[(?P<time>[^\]]*)\] "(?P<method>\S+)(?: +(?P<path>[^ ]*) +\S)?" (?P<code>[^ ]*) (?P<size>[^ ]*)',
                        "Time_Key": "time",
                        "Time_Format": "%d/%b/%Y:%H:%M:%S %z"
                    }
                },
                {
                    "name": "apache_error",
                    "extra": {
                        "Format": "regex",
                        "Regex": r'^\[\S* (?P<time>[^\]]*)\] \[(?P<level>[^\]]*)\](?: \[pid (?P<pid>[^\]]*)\])?( \[client (?P<client>[^\]]*)\])? (?P<message>.*)$'
                    }
                },
                {
                    "name": "k8s-nginx-ingress",
                    "extra": {
                        "Format": "regex",
                        "Regex": "voir source",
                        "Time_Key": "time",
                        "Time_Format": "%d/%b/%Y:%H:%M:%S %z"
                    }
                },
                {
                    "name": "json",
                    "extra": {
                        "Format": "json",
                        "Time_Key": "time",
                        "Time_Format": "%d/%b/%Y:%H:%M:%S %z"
                    }
                },
                {
                    "name": "logfmt",
                    "extra": {
                        "Format": "logfmt"
                    }
                },
                {
                    "name": "docker",
                    "extra": {
                        "Format": "json",
                        "Time_Key": "time",
                        "Time_Format": "%Y-%m-%dT%H:%M:%S.%L",
                        "Time_Keep": "On"
                    }
                },
                {
                    "name": "docker-daemon",
                    "extra": {
                        "Format": "regex",
                        "Regex": r'time="(?P<time>[^"]*)" level=(?P<level>\w+) msg="(?P<msg>[^"]+)"',
                        "Time_Key": "time",
                        "Time_Format": "%Y-%m-%dT%H:%M:%S.%L",
                        "Time_Keep": "On"
                    }
                },
                {
                    "name": "syslog-rfc5424",
                    "extra": {
                        "Format": "regex",
                        "Regex": "voir source",
                        "Time_Key": "time",
                        "Time_Format": "%Y-%m-%dT%H:%M:%S.%L%z"
                    }
                },
                {
                    "name": "mongodb",
                    "extra": {
                        "Format": "regex",
                        "Regex": "voir source",
                        "Time_Key": "time",
                        "Time_Format": "%Y-%m-%dT%H:%M:%S.%L"
                    }
                }
            ]

            # Ajouter les parsers avec extra_properties
            for parser_entry in raw_parsers:
                name = parser_entry["name"]
                extra = parser_entry["extra"]
                existing = session.exec(select(Parser).where(Parser.name == name)).first()
                if not existing:
                    random_categorie = random.choice(list(categories.values()))
                    parser = Parser(
                        name=name,
                        categorie_id=random_categorie.id,
                        admin_id=admin.id,
                        extra_properties=extra
                    )
                    session.add(parser)
                    session.commit()

            print("✅ Données de test enrichies insérées avec succès.")

        except Exception as e:
            print(f"❌ Erreur lors de l’initialisation des données : {e}")


if __name__ == "__main__":
    seed_data()
