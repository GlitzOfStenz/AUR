"""add official dataset score columns to ranking_scores
Revision ID: a3f7c9e21b4d
Revises: c1b5ca85991a
Create Date: 2026-07-19 urvi 
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'a3f7c9e21b4d'
down_revision: Union[str, Sequence[str], None] = 'c1b5ca85991a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('ranking_scores', sa.Column('research_output_score', sa.Float(), nullable=True))
    op.add_column('ranking_scores', sa.Column('research_impact_score', sa.Float(), nullable=True))
    op.add_column('ranking_scores', sa.Column('graduate_employability_score', sa.Float(), nullable=True))
    op.add_column('ranking_scores', sa.Column('industry_income_score', sa.Float(), nullable=True))
    # THE Rank is frequently a band (e.g. "351-400", "1501+") rather than a clean
    # integer, so it's stored as text rather than Integer like `rank` (QS rank).
    op.add_column('ranking_scores', sa.Column('the_rank', sa.String(length=50), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('ranking_scores', 'the_rank')
    op.drop_column('ranking_scores', 'industry_income_score')
    op.drop_column('ranking_scores', 'graduate_employability_score')
    op.drop_column('ranking_scores', 'research_impact_score')
    op.drop_column('ranking_scores', 'research_output_score')