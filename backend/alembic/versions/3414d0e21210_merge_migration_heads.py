"""merge migration heads

Revision ID: 3414d0e21210
Revises: a60ce61f8ec8, f84e19bbd7ad
Create Date: 2026-09-21 13:10:38.676676

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '3414d0e21210'
down_revision: Union[str, Sequence[str], None] = ('a60ce61f8ec8', 'f84e19bbd7ad')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
