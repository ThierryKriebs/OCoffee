
BEGIN; -- Start transaction

-- Database ocoffee
DROP TABLE IF EXISTS "coffee";
DROP TABLE IF EXISTS "characteristic";
DROP TABLE IF EXISTS "country";
DROP TABLE IF EXISTS "contact";

-- Table characteristic
CREATE TABLE "characteristic"
(
    "id" INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    "name" VARCHAR(50) UNIQUE NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);

-- Table country
CREATE TABLE "country"
(
    "id" INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    "name" VARCHAR(50) UNIQUE NOT NULL,
    "latitude" NUMERIC,
    "longitude" NUMERIC,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);

-- Table cofee
CREATE TABLE "coffee"
(
    "id" INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    "name" VARCHAR(60) UNIQUE NOT NULL,
    "reference" CHAR(9) UNIQUE NOT NULL,
    "country_id" integer NOT NULL,
    "price" integer,
    "characteristic_id" integer,
    "disponibility" boolean NOT NULL DEFAULT false,
    "description" character varying,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);

ALTER TABLE "coffee"
    ADD FOREIGN KEY ("country_id")
    REFERENCES "country" ("id") MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE "coffee"
    ADD FOREIGN KEY ("characteristic_id")
    REFERENCES "characteristic" ("id") MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


-- Table contact
CREATE TABLE "contact"
(
    "id" INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    "name" VARCHAR(60) NOT NULL,
    "email" VARCHAR(100) UNIQUE NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);

COMMIT; --End transaction