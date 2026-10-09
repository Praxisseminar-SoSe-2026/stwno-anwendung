from app.models.access_time_slot import AccessTimeSlot
from app.models.access_time_slot_history import AccessTimeSlotHistory
from app.models.access_time_slot_proposal import AccessTimeSlotProposal
from app.models.announcement import Announcement
from app.models.community_room import CommunityRoom
from app.models.consent import Consent
from app.models.dormitory import Dormitory
from app.models.dormitory_facility_manager import DormitoryFacilityManager
from app.models.faq_category import FaqCategory
from app.models.faq_entry import FaqEntry
from app.models.item_reservation import ItemReservation
from app.models.item_type import ItemType
from app.models.laundry_booking import LaundryBooking
from app.models.laundry_machine import LaundryMachine
from app.models.laundry_room import LaundryRoom
from app.models.notification import Notification
from app.models.permission import Permission
from app.models.privacy_consent import PrivacyConsent
from app.models.repair_request import RepairRequest
from app.models.repair_request_status_history import RepairRequestStatusHistory
from app.models.request import Request
from app.models.request_comment import RequestComment
from app.models.resident_master_data import ResidentMasterData
from app.models.role import Role
from app.models.role_permission import RolePermission
from app.models.room_request import RoomRequest
from app.models.room_request_status_history import RoomRequestStatusHistory
from app.models.user import User
from app.models.user_role import UserRole

__all__ = [
    "Role",
    "Permission",
    "RolePermission",
    "User",
    "UserRole",
    "Dormitory",
    "DormitoryFacilityManager",
    "Request",
    "RepairRequest",
    "ResidentMasterData",
    "RoomRequest",
    "AccessTimeSlot",
    "AccessTimeSlotHistory",
    "AccessTimeSlotProposal",
    "RepairRequestStatusHistory",
    "RoomRequestStatusHistory",
    "RequestComment",
    "CommunityRoom",
    "ItemType",
    "ItemReservation",
    "WashRoom",
    "WashingMachine",
    "FaqEntry",
    "FaqCategory",
    "Announcement",
    "Notification",
    "Consent",
    "LaundryBooking",
    "LaundryMachine",
    "LaundryRoom",
    "PrivacyConsent",
]
