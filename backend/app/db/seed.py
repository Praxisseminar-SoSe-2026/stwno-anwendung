"""Seed-Skript fuer Testdaten.

Voraussetzung: `alembic upgrade head` wurde bereits ausgefuehrt (Tabellen
existieren in der DB). Ausfuehren mit:

    python -m app.db.seed
"""

from __future__ import annotations

from datetime import UTC, date, datetime, timedelta

from app.db.database import SessionLocal
from app.models import (
    Announcement,
    CommunityRoom,
    Dormitory,
    DormitoryFacilityManager,
    FaqEntry,
    ItemType,
    Permission,
    Role,
    RolePermission,
    User,
    UserRole,
    WashingMachine,
    WashRoom,
)

from app.core.security import hash_password



def seed() -> None:
    db = SessionLocal()
    try:
        # Roles & Permissions
        role_worker = Role(name="mitarbeiter", description="Studentenwerk-Mitarbeiter")
        role_admin = Role(name="admin", description="Entwickler")
        role_facility_manager = Role(
            name="hausmeister", description="Hausmeister / Facility Manager"
        )
        role_resident = Role(name="bewohner", description="Wohnheim-Bewohner")
        db.add_all([role_worker, role_admin, role_facility_manager, role_resident])
        db.flush()

        # ToDo: add missing permissions
        perm_manage_requests = Permission(
            name="manage_requests", description="Anfragen bearbeiten"
        )
        perm_post_announcement = Permission(
            name="post_announcement", description="Ankuendigungen posten"
        )
        perm_edit_announcement = Permission(
            name="edit_announcement", description="Ankuendigungen bearbeiten"
        )
        perm_manage_users = Permission(
            name="manage_users", description="Nutzer verwalten"
        )
        db.add_all(
            [
                perm_manage_requests,
                perm_post_announcement,
                perm_manage_users,
                perm_edit_announcement,
            ]
        )
        db.flush()

        db.add_all(
            [
                RolePermission(
                    role_id=role_facility_manager.id,
                    permission_id=perm_manage_requests.id,
                ),
                RolePermission(
                    role_id=role_admin.id, permission_id=perm_post_announcement.id
                ),
                RolePermission(
                    role_id=role_admin.id, permission_id=perm_manage_users.id
                ),
            ]
        )

        # Dormitory
        dorm = Dormitory(
            name="Franz-Mayer-Straße",
            address="Franz-Mayer-Straße 13",
            city="Regensburg",
            zip_code="93053",
        )
        db.add_all([dorm])
        db.flush()

        # User
        admin = User(
            first_name="Raffael",
            last_name="Eger",
            email="raffael.eger@web.de",
            password_hash=hash_password("password"),
            person_number="A0001",
        )
        admin2 = User(
            first_name="Maximilian",
            last_name="Auberger",
            email="maximilian.auberger@stud.uni-regensburg.de",
            password_hash=hash_password("password"),
            person_number="A0002",
        )
        admin3 = User(
            first_name="Jonas",
            last_name="Haller",
            email="jonas.haller@stud.uni-regensburg.de",
            password_hash=hash_password("password"),
            person_number="A0003",
        )
        hausmeister = User(
            first_name="Michael",
            last_name="Arnold",
            email="hausmeister@mail.de",
            password_hash=hash_password("password"),
            person_number="A0004",
            dormitory_id=dorm.id,
        )
        resident = User(
            first_name="Lena",
            last_name="Beispiel",
            email="lena@mail.com",
            password_hash=hash_password("password"),
            person_number="S1001",
            flat_number="12A",
            contract_end=date.today() + timedelta(days=180),
            dormitory_id=dorm.id,
        )
        db.add_all([admin, admin2, admin3, hausmeister, resident])
        db.flush()

        db.add_all(
            [
                UserRole(user_id=admin.id, role_id=role_admin.id),
                UserRole(user_id=hausmeister.id, role_id=role_facility_manager.id),
                UserRole(user_id=resident.id, role_id=role_resident.id),
                DormitoryFacilityManager(dormitory_id=dorm.id, user_id=hausmeister.id),
            ]
        )

        # Community Rooms, Items, Washing Room
        community_room = CommunityRoom(
            dormitory_id=dorm.id,
            name="Gemeinschaftsraum EG",
            description="Mit Kicker und Fernseher",
        )
        db.add_all([community_room])

        item_type = ItemType(dormitory_id=dorm.id, name="Staubsauger", total_count=3)
        db.add(item_type)
        db.flush()

        wash_room = WashRoom(dormitory_id=dorm.id, name="Waschraum Erdgeschoss")
        db.add(wash_room)
        db.flush()

        db.add_all(
            [
                WashingMachine(
                    wash_room_id=wash_room.id, label="Maschine 1", status="Frei"
                ),
                WashingMachine(
                    wash_room_id=wash_room.id,
                    label="Maschine 2",
                    status="Belegt",
                    last_signal_at=datetime.now(UTC),
                ),
                WashingMachine(
                    wash_room_id=wash_room.id,
                    label="Maschine 3",
                    status="Belegt",
                    last_signal_at=datetime.now(UTC),
                ),
            ]
        )

        # FAQ & Announcements
        db.add(
            FaqEntry(
                question="Wie trenne ich meinen Müll?",
                answer="Bitte Plastik und Metall in die gelben Säcke, "
                       "Papier in die grüne Tonne und Restmüll in die schwarze Tonne",
                created_by_id=admin.id,
            )
        )
        db.add(
            Announcement(
                title="Kontrolle Feuermelder",
                text="Am Montag werden von 9-12 Uhr "
                     "die Feuermelder in den Wohnungen überprüft.",
                important=True,
                author_id=admin.id,
                dormitory_id=dorm.id,
            )
        )

        db.commit()
        print("Seed-Daten erfolgreich eingefuegt.")
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
