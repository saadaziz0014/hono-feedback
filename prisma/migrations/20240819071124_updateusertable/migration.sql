-- AlterTable
CREATE SEQUENCE user_id_seq;
ALTER TABLE "User" ALTER COLUMN "id" SET DEFAULT nextval('user_id_seq'),
ALTER COLUMN "isAdmin" SET DEFAULT false;
ALTER SEQUENCE user_id_seq OWNED BY "User"."id";
