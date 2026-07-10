"""add methodology_versions table

Revision ID: 7743d953f3de
Revises: 99d676259f8c
Create Date: 2026-07-08 21:32:19.592994

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '7743d953f3de'
down_revision: Union[str, Sequence[str], None] = '99d676259f8c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        'methodology_versions',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('version', sa.String(length=20), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('release_date', sa.Date(), nullable=False),
        sa.Column('is_current', sa.Boolean(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table('methodology_versions')
    
    