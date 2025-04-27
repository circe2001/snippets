/*
CREATE SEQUENCE "public"."account_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

SELECT setval('"public"."account_id_seq"', 4, true);

ALTER SEQUENCE "public"."account_id_seq" OWNER TO "root";
CREATE TABLE "public"."account" (
  "id" int4 NOT NULL DEFAULT nextval('account_id_seq'::regclass),
  "name" varchar(255) COLLATE "pg_catalog"."default",
  "pwd" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "pwd_algorithm" varchar(255) COLLATE "pg_catalog"."default",
  "lock_type" varchar(255) COLLATE "pg_catalog"."default",
  "pwd_error_times" int4 NOT NULL DEFAULT 0,
  "pwd_error_latest_time" timestamptz(6),
  "alias_name" varchar(255) COLLATE "pg_catalog"."default",
  "mobile" varchar(255) COLLATE "pg_catalog"."default",
  "email" varchar(255) COLLATE "pg_catalog"."default",
  "created_at" timestamptz(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamptz(6),
  "deleted_at" timestamptz(6),
  "need_change_pwd" bool NOT NULL DEFAULT false,
  "last_login" timestamptz(6),
  "first_login" timestamptz(6),
  "remark" text COLLATE "pg_catalog"."default",
  "is_enable" bool NOT NULL DEFAULT true,
  "locked_time" timestamptz(6),
  CONSTRAINT "account_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "account_mobile_key" UNIQUE ("mobile"),
  CONSTRAINT "account_name_key" UNIQUE ("name"),
  CONSTRAINT "account_email_key" UNIQUE ("email")
)
;

ALTER SEQUENCE "public"."account_id_seq"
OWNED BY "public"."account"."id";
*/
