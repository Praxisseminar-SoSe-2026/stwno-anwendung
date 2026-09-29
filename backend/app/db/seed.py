"""Seed-Skript fuer Testdaten.

Voraussetzung: `alembic upgrade head` wurde bereits ausgefuehrt (Tabellen
existieren in der DB). Ausfuehren mit:

    python -m app.db.seed
"""

from __future__ import annotations

from datetime import date, timedelta

from app.core.security import hash_password
from app.core.status import LaundryStatus, RequestStatus
from app.core.time import now_utc
from app.db.database import SessionLocal
from app.models import (
    AccessTimeSlotProposal,
    Announcement,
    CommunityRoom,
    Dormitory,
    DormitoryFacilityManager,
    FaqCategory,
    FaqEntry,
    ItemType,
    LaundryBooking,
    LaundryMachine,
    LaundryRoom,
    Permission,
    RepairRequest,
    Role,
    RolePermission,
    RoomRequest,
    User,
    UserRole,
)


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
        role_tutor = Role(name="tutor", description="Tutor:in")
        db.add_all([role_worker, role_admin, role_facility_manager, role_resident,
                    role_tutor])
        db.flush()

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
        perm_manage_infrastructure = Permission(
            name="manage_infrastructure",
            description="Waschräume, Waschmaschinen und Gemeinschaftsräume verwalten",
        )
        perm_manage_faq = Permission(
            name="manage_faq", description="FAQ-Einträge verwalten"
        )
        perm_manage_dormitories = Permission(
            name="manage_dormitories", description="Wohnheime verwalten"
        )
        db.add_all(
            [
                perm_manage_requests,
                perm_post_announcement,
                perm_manage_users,
                perm_edit_announcement,
                perm_manage_infrastructure,
                perm_manage_faq,
                perm_manage_dormitories,
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
                    role_id=role_admin.id, permission_id=perm_edit_announcement.id
                ),
                RolePermission(
                    role_id=role_facility_manager.id,
                    permission_id=perm_post_announcement.id,
                ),
                RolePermission(
                    role_id=role_facility_manager.id,
                    permission_id=perm_edit_announcement.id,
                ),
                RolePermission(
                    role_id=role_worker.id, permission_id=perm_post_announcement.id
                ),
                RolePermission(
                    role_id=role_worker.id, permission_id=perm_edit_announcement.id
                ),
                RolePermission(
                    role_id=role_tutor.id, permission_id=perm_post_announcement.id
                ),
                RolePermission(
                    role_id=role_admin.id, permission_id=perm_manage_users.id
                ),
                RolePermission(
                    role_id=role_admin.id, permission_id=perm_manage_infrastructure.id
                ),
                RolePermission(
                    role_id=role_facility_manager.id,
                    permission_id=perm_manage_infrastructure.id,
                ),
                RolePermission(
                    role_id=role_worker.id,
                    permission_id=perm_manage_infrastructure.id,
                ),
                RolePermission(role_id=role_admin.id, permission_id=perm_manage_faq.id),
                RolePermission(
                    role_id=role_facility_manager.id, permission_id=perm_manage_faq.id
                ),
                RolePermission(
                    role_id=role_admin.id, permission_id=perm_manage_dormitories.id
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
        dorm2 = Dormitory(
            name="Fort-Skelly-Straße",
            address="Fort-Skelly-Straße 19",
            city="Regensburg",
            zip_code="93053",
        )
        db.add_all([dorm, dorm2])
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
        worker = User(
            first_name="Zita",
            last_name="Hölzl",
            email="zita.hoelzl@mail.de",
            password_hash=hash_password("password"),
            person_number="A0005",
        )
        tutor = User(
            first_name="Sophia",
            last_name="Beispiel",
            email="sophia@mail.com",
            password_hash=hash_password("password"),
            person_number="A0006",
            flat_number="1G",
            contract_end=date.today() + timedelta(days=180),
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
        resident2 = User(
            first_name="Lukas",
            last_name="Beispiel",
            email="lukas@mail.com",
            password_hash=hash_password("password"),
            person_number="S1002",
            flat_number="12B",
            contract_end=date.today() + timedelta(days=180),
            dormitory_id=dorm2.id,
        )
        db.add_all([admin, admin2, admin3, hausmeister, worker, tutor, resident,
                    resident2])
        db.flush()

        db.add_all(
            [
                UserRole(user_id=admin.id, role_id=role_admin.id),
                UserRole(user_id=admin2.id, role_id=role_admin.id),
                UserRole(user_id=admin3.id, role_id=role_admin.id),
                UserRole(user_id=hausmeister.id, role_id=role_facility_manager.id),
                UserRole(user_id=worker.id, role_id=role_worker.id),
                UserRole(user_id=tutor.id, role_id=role_tutor.id),
                UserRole(user_id=resident.id, role_id=role_resident.id),
                UserRole(user_id=resident2.id, role_id=role_resident.id),
                DormitoryFacilityManager(dormitory_id=dorm.id, user_id=hausmeister.id),
            ]
        )

        # Community Rooms, Items, Laundry Room
        community_room = CommunityRoom(
            dormitory_id=dorm.id,
            name="Gemeinschaftsraum EG",
            description="Mit Kicker und Fernseher",
        )
        db.add_all([community_room])

        item_type = ItemType(dormitory_id=dorm.id, name="Staubsauger", total_count=3)
        db.add(item_type)
        db.flush()

        laundry_room = LaundryRoom(dormitory_id=dorm.id, name="Waschraum Erdgeschoss")
        db.add(laundry_room)
        db.flush()

        laundry_machine1 = LaundryMachine(
            laundry_room_id=laundry_room.id,
            label="Maschine 4",
            type="Dryer",
            status=LaundryStatus.FREE,
        )
        laundry_machine2 = LaundryMachine(
            laundry_room_id=laundry_room.id,
            label="Maschine 1",
            status=LaundryStatus.FREE,
        )
        laundry_machine3 = LaundryMachine(
            laundry_room_id=laundry_room.id,
            label="Maschine 2",
            status=LaundryStatus.OCCUPIED,
        )
        laundry_machine4 = LaundryMachine(
            laundry_room_id=laundry_room.id,
            label="Maschine 3",
            status=LaundryStatus.UNKNOWN,
        )

        db.add_all([laundry_machine1, laundry_machine2, laundry_machine3,
                    laundry_machine4])
        db.flush()

        db.add_all(
            [
                LaundryBooking(
                    laundry_machine_id=laundry_machine2.id,
                    resident_id=resident.id,
                    ends_at=now_utc() + timedelta(minutes=90),
                ),
                LaundryBooking(
                    laundry_machine_id=laundry_machine3.id,
                    resident_id=resident.id,
                    ends_at=now_utc() + timedelta(minutes=2),
                ),
            ]
        )

        # FAQs
        faq_category_general = FaqCategory(name="General")
        faq_category_washroom = FaqCategory(name="Washroom")
        faq_category_recycling = FaqCategory(name="Recycling")
        faq_category_community_room = FaqCategory(name="Community Room")
        faq_category_moving = FaqCategory(name="Moving in and out")
        faq_category_miscellaneous = FaqCategory(name="Miscellaneous")

        db.add_all(
            [
                faq_category_general,
                faq_category_washroom,
                faq_category_recycling,
                faq_category_community_room,
                faq_category_moving,
                faq_category_miscellaneous,
            ]
        )
        db.flush()

        db.add_all(
            [
                FaqEntry(
                    question="Wo finde ich die Hausordnung?!",
                    answer="Lorem ipsum dolor sit amet, consectetur adipiscing elit. "
                    "Sed do eiusmod tempor incididunt ut labore et dolore magna "
                    "aliqua.",
                    category_id=faq_category_general.id,
                    created_by_id=admin.id,
                ),
                FaqEntry(
                    question="An wen wende ich mich bei allgemeinen Fragen?",
                    answer="Lorem ipsum dolor sit amet, consectetur adipiscing elit. "
                    "Sed do eiusmod tempor incididunt ut labore et dolore magna "
                    "aliqua.",
                    category_id=faq_category_general.id,
                    created_by_id=admin.id,
                ),
                FaqEntry(
                    question="Wie bediene ich eine Waschmaschine?",
                    answer="Lorem ipsum dolor sit amet, consectetur adipiscing elit. "
                    "Sed do eiusmod tempor incididunt ut labore et dolore magna "
                    "aliqua.",
                    category_id=faq_category_washroom.id,
                    created_by_id=admin.id,
                ),
                FaqEntry(
                    question="Was mache ich, wenn eine Waschmaschine defekt ist?",
                    answer="Lorem ipsum dolor sit amet, consectetur adipiscing elit. "
                    "Sed do eiusmod tempor incididunt ut labore et dolore magna "
                    "aliqua.",
                    category_id=faq_category_washroom.id,
                    created_by_id=admin.id,
                ),
                FaqEntry(
                    question="Wie trenne ich meinen Müll richtig?",
                    answer="Lorem ipsum dolor sit amet, consectetur adipiscing elit. "
                    "Sed do eiusmod tempor incididunt ut labore et dolore magna "
                    "aliqua.",
                    category_id=faq_category_recycling.id,
                    created_by_id=admin.id,
                ),
                FaqEntry(
                    question="Was ist Bio Müll?",
                    answer="Lorem ipsum dolor sit amet, consectetur adipiscing elit. "
                    "Sed do eiusmod tempor incididunt ut labore et dolore magna "
                    "aliqua.",
                    category_id=faq_category_recycling.id,
                    created_by_id=admin.id,
                ),
                FaqEntry(
                    question="Wie buche ich den Gemeinschaftsraum?",
                    answer="Lorem ipsum dolor sit amet, consectetur adipiscing elit. "
                    "Sed do eiusmod tempor incididunt ut labore et dolore magna "
                    "aliqua.",
                    category_id=faq_category_community_room.id,
                    created_by_id=admin.id,
                ),
                FaqEntry(
                    question="Wie lange im Voraus kann ich den Gemeinschaftsraum "
                    "buchen?",
                    answer="Lorem ipsum dolor sit amet, consectetur adipiscing elit. "
                    "Sed do eiusmod tempor incididunt ut labore et dolore magna "
                    "aliqua.",
                    category_id=faq_category_community_room.id,
                    created_by_id=admin.id,
                ),
                FaqEntry(
                    question="Was muss ich beim Auszug beachten?",
                    answer="Lorem ipsum dolor sit amet, consectetur adipiscing elit. "
                    "Sed do eiusmod tempor incididunt ut labore et dolore magna "
                    "aliqua.",
                    category_id=faq_category_moving.id,
                    created_by_id=admin.id,
                ),
                FaqEntry(
                    question="Wann erhalte ich meine Kaution zurück?",
                    answer="Lorem ipsum dolor sit amet, consectetur adipiscing elit. "
                    "Sed do eiusmod tempor incididunt ut labore et dolore magna "
                    "aliqua.",
                    category_id=faq_category_moving.id,
                    created_by_id=admin.id,
                ),
                FaqEntry(
                    question="Wo finde ich verlorene Gegenstände?",
                    answer="Lorem ipsum dolor sit amet, test123! consectetur "
                    "adipiscing elit. Sed do eiusmod tempor incididunt "
                    "ut labore et dolore magna aliqua.",
                    category_id=faq_category_miscellaneous.id,
                    created_by_id=admin.id,
                ),
            ]
        )

        # Announcements
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

        # Tickets
        repair_open = RepairRequest(
            resident_id=resident.id,
            status=RequestStatus.OPEN,
            description="Die Heizung geht nicht",
            location=resident.flat_number,
            assigned_dormitory_id=dorm.id,
            entry_permission=True,
        )
        repair_confirmed = RepairRequest(
            resident_id=resident.id,
            status=RequestStatus.OPEN,
            description="Es kommt kein warmes Wasser",
            location=resident.flat_number,
            assigned_dormitory_id=dorm.id,
            time_slot_proposals=[
                AccessTimeSlotProposal(
                    start_time=now_utc() + timedelta(days=2, hours=1),
                    end_time=now_utc() + timedelta(days=2, hours=3),
                ),
                AccessTimeSlotProposal(
                    start_time=now_utc() + timedelta(days=3, hours=1),
                    end_time=now_utc() + timedelta(days=3, hours=3),
                ),
                AccessTimeSlotProposal(
                    start_time=now_utc() + timedelta(days=4, hours=1),
                    end_time=now_utc() + timedelta(days=4, hours=3),
                ),
            ],
        )
        db.add_all([repair_open, repair_confirmed])

        room_open = RoomRequest(
            resident_id=resident.id,
            status=RequestStatus.OPEN,
            community_room_id=community_room.id,
            start_datetime=now_utc(),
            end_datetime=now_utc() + timedelta(days=1),
        )
        db.add_all([room_open])
        db.flush()

        db.commit()
        print("Seed-Daten erfolgreich eingefuegt.")
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
