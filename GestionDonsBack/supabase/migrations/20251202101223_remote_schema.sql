


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";





SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."beneficiaire" (
    "id" integer NOT NULL,
    "nom" "text" NOT NULL,
    "numero" "text"
);


ALTER TABLE "public"."beneficiaire" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."beneficiaire_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."beneficiaire_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."beneficiaire_id_seq" OWNED BY "public"."beneficiaire"."id";

-- Dans Supabase → SQL Editor
CREATE TABLE IF NOT EXISTS public.dons_monetaires (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  amount numeric(10,2) NOT NULL CHECK (amount > 0),
  currency text DEFAULT 'EUR',
  message text,
  anonymous boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);
-------------------
ALTER TABLE public.dons_monetaires ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_dons" ON public.dons_monetaires FOR ALL 
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS "public"."don" (
    "id" integer NOT NULL,
    "user_id" "uuid",
    "titre" "text" NOT NULL,
    "date_disponibilite" "date",
    "created_at" timestamp without time zone DEFAULT "now"(),
    "etat" "text" DEFAULT 'en cours de traitement'::"text",
    "localisation" "text",
    CONSTRAINT "don_etat_check" CHECK (("etat" = ANY (ARRAY['en cours de traitement'::"text", 'accepte'::"text", 'refuse'::"text"])))
);


ALTER TABLE "public"."don" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."don_accepte" (
    "id" integer NOT NULL,
    "don_id" integer,
    "date_acceptation" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."don_accepte" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."don_accepte_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."don_accepte_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."don_accepte_id_seq" OWNED BY "public"."don_accepte"."id";



CREATE SEQUENCE IF NOT EXISTS "public"."don_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."don_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."don_id_seq" OWNED BY "public"."don"."id";



CREATE TABLE IF NOT EXISTS "public"."don_refuse" (
    "id" integer NOT NULL,
    "don_id" integer,
    "date_refus" timestamp without time zone DEFAULT "now"(),
    "motif" "text"
);


ALTER TABLE "public"."don_refuse" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."don_refuse_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."don_refuse_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."don_refuse_id_seq" OWNED BY "public"."don_refuse"."id";



CREATE TABLE IF NOT EXISTS "public"."objet" (
    "id" integer NOT NULL,
    "don_id" integer,
    "nom" "text",
    "type" "text",
    "etat" "text" DEFAULT 'en cours de traitement'::"text",
    "localisation" "text",
    "type_destination" "text",
    "destination" "text",
    "beneficiaire_id" integer,
    CONSTRAINT "objet_etat_check" CHECK (("etat" = ANY (ARRAY['en cours de traitement'::"text", 'accepte'::"text", 'refuse'::"text", 'transport'::"text"])))
);


ALTER TABLE "public"."objet" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."objet_a_transporter" (
    "id" integer NOT NULL,
    "objet_accepte_id" integer,
    "transporteur_id" "uuid",
    "date_affectation" timestamp without time zone DEFAULT "now"(),
    "statut" "text" DEFAULT 'en attente'::"text",
    CONSTRAINT "objet_a_transporter_statut_check" CHECK (("statut" = ANY (ARRAY['en attente'::"text", 'en transport'::"text", 'livré'::"text"])))
);


ALTER TABLE "public"."objet_a_transporter" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."objet_a_transporter_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."objet_a_transporter_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."objet_a_transporter_id_seq" OWNED BY "public"."objet_a_transporter"."id";



CREATE TABLE IF NOT EXISTS "public"."objet_accepte" (
    "id" integer NOT NULL,
    "don_accepte_id" integer,
    "objet_id" integer
);


ALTER TABLE "public"."objet_accepte" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."objet_accepte_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."objet_accepte_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."objet_accepte_id_seq" OWNED BY "public"."objet_accepte"."id";



CREATE SEQUENCE IF NOT EXISTS "public"."objet_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."objet_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."objet_id_seq" OWNED BY "public"."objet"."id";



CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "nom" "text" NOT NULL,
    "email" "text" NOT NULL,
    "password" "text",
    "numero" "text",
    "roles" "text"[] DEFAULT ARRAY['user'::"text"],
    "created_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


ALTER TABLE ONLY "public"."beneficiaire" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."beneficiaire_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."don" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."don_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."don_accepte" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."don_accepte_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."don_refuse" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."don_refuse_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."objet" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."objet_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."objet_a_transporter" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."objet_a_transporter_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."objet_accepte" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."objet_accepte_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."beneficiaire"
    ADD CONSTRAINT "beneficiaire_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."don_accepte"
    ADD CONSTRAINT "don_accepte_don_id_key" UNIQUE ("don_id");



ALTER TABLE ONLY "public"."don_accepte"
    ADD CONSTRAINT "don_accepte_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."don"
    ADD CONSTRAINT "don_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."don_refuse"
    ADD CONSTRAINT "don_refuse_don_id_key" UNIQUE ("don_id");



ALTER TABLE ONLY "public"."don_refuse"
    ADD CONSTRAINT "don_refuse_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."objet_a_transporter"
    ADD CONSTRAINT "objet_a_transporter_objet_accepte_id_key" UNIQUE ("objet_accepte_id");



ALTER TABLE ONLY "public"."objet_a_transporter"
    ADD CONSTRAINT "objet_a_transporter_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."objet_accepte"
    ADD CONSTRAINT "objet_accepte_objet_id_key" UNIQUE ("objet_id");



ALTER TABLE ONLY "public"."objet_accepte"
    ADD CONSTRAINT "objet_accepte_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."objet"
    ADD CONSTRAINT "objet_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."don_accepte"
    ADD CONSTRAINT "don_accepte_don_id_fkey" FOREIGN KEY ("don_id") REFERENCES "public"."don"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."don_refuse"
    ADD CONSTRAINT "don_refuse_don_id_fkey" FOREIGN KEY ("don_id") REFERENCES "public"."don"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."don"
    ADD CONSTRAINT "don_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."objet_a_transporter"
    ADD CONSTRAINT "objet_a_transporter_objet_accepte_id_fkey" FOREIGN KEY ("objet_accepte_id") REFERENCES "public"."objet_accepte"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."objet_a_transporter"
    ADD CONSTRAINT "objet_a_transporter_transporteur_id_fkey" FOREIGN KEY ("transporteur_id") REFERENCES "public"."profiles"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."objet_accepte"
    ADD CONSTRAINT "objet_accepte_don_accepte_id_fkey" FOREIGN KEY ("don_accepte_id") REFERENCES "public"."don_accepte"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."objet_accepte"
    ADD CONSTRAINT "objet_accepte_objet_id_fkey" FOREIGN KEY ("objet_id") REFERENCES "public"."objet"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."objet"
    ADD CONSTRAINT "objet_beneficiaire_id_fkey" FOREIGN KEY ("beneficiaire_id") REFERENCES "public"."beneficiaire"("id");



ALTER TABLE ONLY "public"."objet"
    ADD CONSTRAINT "objet_don_id_fkey" FOREIGN KEY ("don_id") REFERENCES "public"."don"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";








































































































































































GRANT ALL ON TABLE "public"."beneficiaire" TO "anon";
GRANT ALL ON TABLE "public"."beneficiaire" TO "authenticated";
GRANT ALL ON TABLE "public"."beneficiaire" TO "service_role";



GRANT ALL ON SEQUENCE "public"."beneficiaire_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."beneficiaire_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."beneficiaire_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."don" TO "anon";
GRANT ALL ON TABLE "public"."don" TO "authenticated";
GRANT ALL ON TABLE "public"."don" TO "service_role";



GRANT ALL ON TABLE "public"."don_accepte" TO "anon";
GRANT ALL ON TABLE "public"."don_accepte" TO "authenticated";
GRANT ALL ON TABLE "public"."don_accepte" TO "service_role";



GRANT ALL ON SEQUENCE "public"."don_accepte_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."don_accepte_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."don_accepte_id_seq" TO "service_role";



GRANT ALL ON SEQUENCE "public"."don_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."don_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."don_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."don_refuse" TO "anon";
GRANT ALL ON TABLE "public"."don_refuse" TO "authenticated";
GRANT ALL ON TABLE "public"."don_refuse" TO "service_role";



GRANT ALL ON SEQUENCE "public"."don_refuse_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."don_refuse_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."don_refuse_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."objet" TO "anon";
GRANT ALL ON TABLE "public"."objet" TO "authenticated";
GRANT ALL ON TABLE "public"."objet" TO "service_role";



GRANT ALL ON TABLE "public"."objet_a_transporter" TO "anon";
GRANT ALL ON TABLE "public"."objet_a_transporter" TO "authenticated";
GRANT ALL ON TABLE "public"."objet_a_transporter" TO "service_role";



GRANT ALL ON SEQUENCE "public"."objet_a_transporter_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."objet_a_transporter_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."objet_a_transporter_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."objet_accepte" TO "anon";
GRANT ALL ON TABLE "public"."objet_accepte" TO "authenticated";
GRANT ALL ON TABLE "public"."objet_accepte" TO "service_role";



GRANT ALL ON SEQUENCE "public"."objet_accepte_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."objet_accepte_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."objet_accepte_id_seq" TO "service_role";



GRANT ALL ON SEQUENCE "public"."objet_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."objet_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."objet_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































drop extension if exists "pg_net";


