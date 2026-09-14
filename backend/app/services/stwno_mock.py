import json
from pathlib import Path

MOCK_DATA_PATH = (
    Path(__file__).resolve().parent.parent / "data" / "stwno_mock_data.json"
)  # noqa: E501


class STWNONotFoundError(Exception):
    """Raised when the person number is unknown to the STWNO."""


class STWNOUnavailableError(Exception):
    """Raised when the mock interface is unreachable/down."""


def _load_mock_database() -> dict:
    with MOCK_DATA_PATH.open(encoding="utf-8") as f:
        return json.load(f)


# Toggle to simulate an outage in tests/manual testing.
SIMULATE_OUTAGE = False


def verify_person_number(person_number: str) -> dict:
    if SIMULATE_OUTAGE:
        raise STWNOUnavailableError("STWNO interface is unreachable")

    mock_database = _load_mock_database()
    master_data = mock_database.get(person_number)
    if master_data is None:
        raise STWNONotFoundError(f"No record found for person number {person_number}")

    return master_data
