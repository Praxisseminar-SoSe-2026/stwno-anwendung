"""add laundrytype enum

Revision ID: f84e19bbd7ad
Revises: c1d33f4b1ca1
Create Date: 2026-09-16 12:08:56.173444

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f84e19bbd7ad'
down_revision: Union[str, Sequence[str], None] = 'c1d33f4b1ca1'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    laundrytype = sa.Enum('WASHINGMASCHINE', 'DRYER', name='laundrytype')
    laundrytype.create(op.get_bind())

    # Drop the existing (VARCHAR-typed) default before changing the column type.
    op.alter_column('laundry_machines', 'type', server_default=None)

    op.alter_column('laundry_machines', 'type',
               existing_type=sa.VARCHAR(length=14),
               type_=laundrytype,
               existing_nullable=False,
               postgresql_using="type::laundrytype")

    # Re-apply the default, now using the enum type.
    op.alter_column(
        'laundry_machines', 'type',
        server_default=sa.text("'WASHINGMASCHINE'::laundrytype"),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.alter_column('laundry_machines', 'type', server_default=None)

    op.alter_column('laundry_machines', 'type',
               existing_type=sa.Enum('WASHINGMASCHINE', 'DRYER', name='laundrytype'),
               type_=sa.VARCHAR(length=14),
               existing_nullable=False)

    op.alter_column(
        'laundry_machines', 'type',
        server_default=sa.text("'Washingmachine'::character varying"),
    )

    sa.Enum(name='laundrytype').drop(op.get_bind())