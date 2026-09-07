"""merge migration heads

Revision ID: 67706f18d6a7
Revises: 1fd4c68d79a3, 279a70319f54
Create Date: 2026-09-04 10:45:41.835131

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '67706f18d6a7'
down_revision: Union[str, Sequence[str], None] = ('1fd4c68d79a3', '279a70319f54')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
