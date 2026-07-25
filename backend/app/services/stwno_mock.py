class STWNONotFoundError(Exception):
    """Raised when the person number is unknown to the STWNO."""


_MOCK_DATABASE = {
    "S2001": {
        "first_name": "Linus",
        "last_name": "Torvald",
        "email": "linus.torvald@stud.uni-regensburg.de",
        "flat_number": "07B",
        "dormitory_id": None,
    },
    "S2002": {
        "first_name": "Grace",
        "last_name": "Hopper",
        "email": "grace.hopper@stud.uni-regensburg.de",
        "flat_number": None,
        "dormitory_id": None,
    },
    "B1001": {
        "first_name": "Alan",
        "last_name": "Turing",
        "email": "alan.turing@stud.uni-regensburg.de",
        "flat_number": None,
        "dormitory_id": None,
    },
}

def verify_person_number(person_number: str) -> dict:
    master_data = _MOCK_DATABASE.get(person_number)
    if master_data is None:
        raise STWNONotFoundError(f"No record found for person number {person_number}")

    return master_data