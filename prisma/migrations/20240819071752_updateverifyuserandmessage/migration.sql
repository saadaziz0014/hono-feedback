-- AlterTable
CREATE SEQUENCE message_id_seq;
ALTER TABLE "Message" ALTER COLUMN "id" SET DEFAULT nextval('message_id_seq');
ALTER SEQUENCE message_id_seq OWNED BY "Message"."id";

-- AlterTable
CREATE SEQUENCE verifyuser_id_seq;
ALTER TABLE "VerifyUser" ALTER COLUMN "id" SET DEFAULT nextval('verifyuser_id_seq');
ALTER SEQUENCE verifyuser_id_seq OWNED BY "VerifyUser"."id";
