"""initial

Revision ID: d9af27259c92
Revises: 
Create Date: 2026-07-20 16:15:33.336302

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd9af27259c92'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        "roles",
        sa.Column("id", sa.Integer(), sa.Identity(), primary_key=True),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("description", sa.String(), nullable=True),
    )
    op.create_index(op.f("ix_roles_id"), "roles", ["id"])
    op.create_index(op.f("ix_roles_name"), "roles", ["name"])

    op.create_table(
        "permissions",
        sa.Column("id", sa.Integer(), sa.Identity(), primary_key=True),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("description", sa.String(), nullable=True),
    )
    op.create_index(op.f("ix_permissions_id"), "permissions", ["id"])
    op.create_index(op.f("ix_permissions_name"), "permissions", ["name"])

    op.create_table(
        "dormitories",
        sa.Column("id", sa.Integer(), sa.Identity(), primary_key=True),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("address", sa.String(), nullable=True),
        sa.Column("city", sa.String(), nullable=True),
        sa.Column("zip_code", sa.String(), nullable=True),
    )
    op.create_index(op.f("ix_dormitories_id"), "dormitories", ["id"])

    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), sa.Identity(), primary_key=True),
        sa.Column("first_name", sa.String(), nullable=False),
        sa.Column("last_name", sa.String(), nullable=False),
        sa.Column("email", sa.String(), nullable=False),
        sa.Column("password_hash", sa.String(), nullable=False),
        sa.Column("person_number", sa.String(), nullable=False),
        sa.Column("flat_number", sa.String(), nullable=True),
        sa.Column("contract_end", sa.Date(), nullable=True),
        sa.Column("language", sa.String(), nullable=True, server_default="de"),
        sa.Column("is_locked", sa.Boolean(), nullable=True, server_default=sa.false()),
        sa.Column("locked_at", sa.DateTime(), nullable=True),
        sa.Column("dormitory_id", sa.Integer(), sa.ForeignKey("dormitories.id"), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True, server_default=sa.func.now()),
    )
    op.create_index(op.f("ix_users_id"), "users", ["id"])
    op.create_index(op.f("ix_users_email"), "users", ["email"], unique=True)
    op.create_index(op.f("ix_users_person_number"), "users", ["person_number"], unique=True)

    op.create_table(
        "role_permissions",
        sa.Column("id", sa.Integer(), sa.Identity(), primary_key=True),
        sa.Column("role_id", sa.Integer(), sa.ForeignKey("roles.id"), nullable=False),
        sa.Column("permission_id", sa.Integer(), sa.ForeignKey("permissions.id"), nullable=False),
    )
    op.create_index(op.f("ix_role_permissions_id"), "role_permissions", ["id"])
    op.create_index(
        "ix_role_permissions_role_id_permission_id",
        "role_permissions",
        ["role_id", "permission_id"],
        unique=True,
    )

    op.create_table(
        "user_roles",
        sa.Column("id", sa.Integer(), sa.Identity(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("role_id", sa.Integer(), sa.ForeignKey("roles.id"), nullable=False),
    )
    op.create_index(op.f("ix_user_roles_id"), "user_roles", ["id"])
    op.create_index(
        "ix_user_roles_user_id_role_id", "user_roles", ["user_id", "role_id"], unique=True
    )

    op.create_table(
        "dormitory_facility_managers",
        sa.Column("id", sa.Integer(), sa.Identity(), primary_key=True),
        sa.Column("dormitory_id", sa.Integer(), sa.ForeignKey("dormitories.id"), nullable=False),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
    )
    op.create_index(
        op.f("ix_dormitory_facility_managers_id"), "dormitory_facility_managers", ["id"]
    )
    op.create_index(
        "ix_dormitory_facility_managers_dormitory_id_user_id",
        "dormitory_facility_managers",
        ["dormitory_id", "user_id"],
        unique=True,
    )

    op.create_table(
        "community_rooms",
        sa.Column("id", sa.Integer(), sa.Identity(), primary_key=True),
        sa.Column("dormitory_id", sa.Integer(), sa.ForeignKey("dormitories.id"), nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("description", sa.String(), nullable=True),
    )
    op.create_index(op.f("ix_community_rooms_id"), "community_rooms", ["id"])

    op.create_table(
        "item_types",
        sa.Column("id", sa.Integer(), sa.Identity(), primary_key=True),
        sa.Column("dormitory_id", sa.Integer(), sa.ForeignKey("dormitories.id"), nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("total_count", sa.Integer(), nullable=False, server_default="0"),
    )
    op.create_index(op.f("ix_item_types_id"), "item_types", ["id"])

    op.create_table(
        "item_reservations",
        sa.Column("id", sa.Integer(), sa.Identity(), primary_key=True),
        sa.Column("item_type_id", sa.Integer(), sa.ForeignKey("item_types.id"), nullable=False),
        sa.Column("resident_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("status", sa.String(), nullable=False, server_default="Reserviert"),
        sa.Column("reserved_at", sa.DateTime(), nullable=True, server_default=sa.func.now()),
        sa.Column("picked_up_at", sa.DateTime(), nullable=True),
        sa.Column("returned_at", sa.DateTime(), nullable=True),
    )
    op.create_index(op.f("ix_item_reservations_id"), "item_reservations", ["id"])

    op.create_table(
        "wash_rooms",
        sa.Column("id", sa.Integer(), sa.Identity(), primary_key=True),
        sa.Column("dormitory_id", sa.Integer(), sa.ForeignKey("dormitories.id"), nullable=False),
        sa.Column("name", sa.String(), nullable=False),
    )
    op.create_index(op.f("ix_wash_rooms_id"), "wash_rooms", ["id"])

    op.create_table(
        "washing_machines",
        sa.Column("id", sa.Integer(), sa.Identity(), primary_key=True),
        sa.Column("wash_room_id", sa.Integer(), sa.ForeignKey("wash_rooms.id"), nullable=False),
        sa.Column("label", sa.String(), nullable=False),
        sa.Column("status", sa.String(), nullable=False, server_default="Unbekannt"),
        sa.Column("last_signal_at", sa.DateTime(), nullable=True),
    )
    op.create_index(op.f("ix_washing_machines_id"), "washing_machines", ["id"])

    op.create_table(
        "faq_entries",
        sa.Column("id", sa.Integer(), sa.Identity(), primary_key=True),
        sa.Column("question", sa.String(), nullable=False),
        sa.Column("answer", sa.Text(), nullable=False),
        sa.Column("created_by_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=True),
        sa.Column("updated_at", sa.DateTime(), nullable=True),
    )
    op.create_index(op.f("ix_faq_entries_id"), "faq_entries", ["id"])

    op.create_table(
        "announcements",
        sa.Column("id", sa.Integer(), sa.Identity(), primary_key=True),
        sa.Column("title", sa.String(), nullable=False),
        sa.Column("text", sa.Text(), nullable=False),
        sa.Column("image_url", sa.String(), nullable=True),
        sa.Column("important", sa.Boolean(), nullable=True, server_default=sa.false()),
        sa.Column("author_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("dormitory_id", sa.Integer(), sa.ForeignKey("dormitories.id"), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True, server_default=sa.func.now()),
    )
    op.create_index(op.f("ix_announcements_id"), "announcements", ["id"])

    op.create_table(
        "notifications",
        sa.Column("id", sa.Integer(), sa.Identity(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("type", sa.String(), nullable=False),
        sa.Column("message", sa.String(), nullable=False),
        sa.Column("related_entity_type", sa.String(), nullable=True),
        sa.Column("related_entity_id", sa.Integer(), nullable=True),
        sa.Column("is_read", sa.Boolean(), nullable=True, server_default=sa.false()),
        sa.Column("created_at", sa.DateTime(), nullable=True, server_default=sa.func.now()),
    )
    op.create_index(op.f("ix_notifications_id"), "notifications", ["id"])

    op.create_table(
        "requests",
        sa.Column("id", sa.Integer(), sa.Identity(), primary_key=True),
        sa.Column("type", sa.String(), nullable=False),
        sa.Column("resident_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("status", sa.String(), nullable=False, server_default="Offen"),
        sa.Column("created_at", sa.DateTime(), nullable=True, server_default=sa.func.now()),
    )
    op.create_index(op.f("ix_requests_id"), "requests", ["id"])

    op.create_table(
        "repair_requests",
        sa.Column("id", sa.Integer(), sa.ForeignKey("requests.id"), primary_key=True),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("location", sa.String(), nullable=False),
        sa.Column("image_url", sa.String(), nullable=True),
        sa.Column("entry_permission", sa.Boolean(), nullable=True, server_default=sa.false()),
        sa.Column(
            "assigned_dormitory_id", sa.Integer(), sa.ForeignKey("dormitories.id"), nullable=True
        ),
    )

    op.create_table(
        "room_requests",
        sa.Column("id", sa.Integer(), sa.ForeignKey("requests.id"), primary_key=True),
        sa.Column(
            "community_room_id", sa.Integer(), sa.ForeignKey("community_rooms.id"), nullable=False
        ),
        sa.Column("start_datetime", sa.DateTime(), nullable=False),
        sa.Column("end_datetime", sa.DateTime(), nullable=False),
        sa.Column("decided_by_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=True),
        sa.Column("decided_at", sa.DateTime(), nullable=True),
    )

    op.create_table(
        "access_time_slots",
        sa.Column("id", sa.Integer(), sa.Identity(), primary_key=True),
        sa.Column(
            "repair_request_id",
            sa.Integer(),
            sa.ForeignKey("repair_requests.id"),
            nullable=False,
        ),
        sa.Column("start_time", sa.DateTime(), nullable=False),
        sa.Column("end_time", sa.DateTime(), nullable=False),
    )
    op.create_index(op.f("ix_access_time_slots_id"), "access_time_slots", ["id"])
    op.create_index(
        "ix_access_time_slots_repair_request_id",
        "access_time_slots",
        ["repair_request_id"],
        unique=True,
    )

    op.create_table(
        "repair_request_status_histories",
        sa.Column("id", sa.Integer(), sa.Identity(), primary_key=True),
        sa.Column(
            "repair_request_id",
            sa.Integer(),
            sa.ForeignKey("repair_requests.id"),
            nullable=False,
        ),
        sa.Column("status", sa.String(), nullable=False),
        sa.Column("changed_by_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("changed_at", sa.DateTime(), nullable=True, server_default=sa.func.now()),
    )
    op.create_index(
        op.f("ix_repair_request_status_histories_id"),
        "repair_request_status_histories",
        ["id"],
    )

    op.create_table(
        "request_comments",
        sa.Column("id", sa.Integer(), sa.Identity(), primary_key=True),
        sa.Column("request_id", sa.Integer(), sa.ForeignKey("requests.id"), nullable=False),
        sa.Column("author_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("text", sa.Text(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=True, server_default=sa.func.now()),
    )
    op.create_index(op.f("ix_request_comments_id"), "request_comments", ["id"])

    op.create_table(
        "consents",
        sa.Column("id", sa.Integer(), sa.ForeignKey("repair_requests.id"), primary_key=True),
        sa.Column("resident_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("consent_given", sa.Boolean(), nullable=False),
        sa.Column("consent_text_version", sa.String(), nullable=False),
        sa.Column("timestamp", sa.DateTime(), nullable=True, server_default=sa.func.now()),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table("consents")
    op.drop_table("request_comments")
    op.drop_table("repair_request_status_histories")
    op.drop_table("access_time_slots")
    op.drop_table("room_requests")
    op.drop_table("repair_requests")
    op.drop_table("requests")
    op.drop_table("notifications")
    op.drop_table("announcements")
    op.drop_table("faq_entries")
    op.drop_table("washing_machines")
    op.drop_table("wash_rooms")
    op.drop_table("item_reservations")
    op.drop_table("item_types")
    op.drop_table("community_rooms")
    op.drop_table("dormitory_facility_managers")
    op.drop_table("user_roles")
    op.drop_table("role_permissions")
    op.drop_table("users")
    op.drop_table("dormitories")
    op.drop_table("permissions")
    op.drop_table("roles")
