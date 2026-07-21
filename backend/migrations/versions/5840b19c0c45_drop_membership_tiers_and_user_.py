"""drop membership_tiers and user_memberships tables

Revision ID: 5840b19c0c45
Revises: a3f7c9e21b4d
Create Date: 2026-07-21 02:01:16.951774

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '5840b19c0c45'
down_revision: Union[str, Sequence[str], None] = 'a3f7c9e21b4d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.drop_index(op.f('ix_user_memberships_tier_id'), table_name='user_memberships')
    op.drop_index(op.f('ix_user_memberships_user_id'), table_name='user_memberships')
    op.drop_table('user_memberships')
    op.drop_table('membership_tiers')


def downgrade() -> None:
    """Downgrade schema."""
    op.create_table('membership_tiers',
    sa.Column('id', sa.UUID(), server_default=sa.text('gen_random_uuid()'), autoincrement=False, nullable=False),
    sa.Column('name', sa.VARCHAR(length=50), autoincrement=False, nullable=False),
    sa.Column('price', sa.NUMERIC(precision=10, scale=2), autoincrement=False, nullable=False),
    sa.Column('duration_months', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('benefits', postgresql.JSONB(astext_type=sa.Text()), autoincrement=False, nullable=False),
    sa.Column('created_at', postgresql.TIMESTAMP(timezone=True), server_default=sa.text('now()'), autoincrement=False, nullable=False),
    sa.PrimaryKeyConstraint('id', name=op.f('membership_tiers_pkey'))
    )
    op.create_table('user_memberships',
    sa.Column('id', sa.UUID(), server_default=sa.text('gen_random_uuid()'), autoincrement=False, nullable=False),
    sa.Column('user_id', sa.UUID(), autoincrement=False, nullable=False),
    sa.Column('tier_id', sa.UUID(), autoincrement=False, nullable=False),
    sa.Column('start_date', postgresql.TIMESTAMP(timezone=True), server_default=sa.text('now()'), autoincrement=False, nullable=False),
    sa.Column('end_date', postgresql.TIMESTAMP(timezone=True), autoincrement=False, nullable=False),
    sa.Column('status', sa.VARCHAR(length=20), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['tier_id'], ['membership_tiers.id'], name=op.f('user_memberships_tier_id_fkey'), ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('user_memberships_user_id_fkey'), ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id', name=op.f('user_memberships_pkey'))
    )
    op.create_index(op.f('ix_user_memberships_user_id'), 'user_memberships', ['user_id'], unique=False)
    op.create_index(op.f('ix_user_memberships_tier_id'), 'user_memberships', ['tier_id'], unique=False)