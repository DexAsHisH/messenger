"""New Migration

Revision ID: 8f45c1a03a9c
Revises: 
Create Date: 2022-05-29 18:08:43.035811

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '8f45c1a03a9c'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('users', 'password',
               existing_type=sa.TEXT(),
               nullable=False)
    op.alter_column('users', 'username',
               existing_type=sa.String(),
               nullable=False)
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_users_id'), table_name='users')
    op.alter_column('users', 'username',
               existing_type=sa.String(),
               nullable=True)
    op.alter_column('users', 'password',
               existing_type=sa.TEXT(),
               nullable=True)
    # ### end Alembic commands ###
