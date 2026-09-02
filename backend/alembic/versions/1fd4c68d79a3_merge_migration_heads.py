"""merge migration heads

Revision ID: 1fd4c68d79a3
Revises: 61452e928457, aa824902d1b1
Create Date: 2026-09-02 12:54:51.348003

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '1fd4c68d79a3'
down_revision: Union[str, Sequence[str], None] = ('61452e928457', 'aa824902d1b1')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
