from enum import StrEnum


# standardized stati; enums made with documentation
# and tutorial [https://docs.python.org/3/library/enum.html,
# https://www.youtube.com/watch?v=TAMbq0iRUsA]
class RequestStatus(StrEnum):
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    CLOSED = "closed"
    DENIED = "denied"


class LaundryStatus(StrEnum):
    FREE = "free"
    OCCUPIED = "occupied"
    UNKNOWN = "unknown"

