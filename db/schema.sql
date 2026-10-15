-- PostgreSQL 17. Initialize an empty database; existing databases require migrations.
BEGIN;

CREATE TABLE app_users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    role text NOT NULL CHECK (role IN ('owner', 'sitter')),
    display_name text NOT NULL CHECK (btrim(display_name) <> ''),
    email text NOT NULL CHECK (btrim(email) <> '' AND email = btrim(email)),
    location text NOT NULL DEFAULT '',
    photo_id uuid,
    UNIQUE (id, role)
);
CREATE UNIQUE INDEX app_users_email_unique ON app_users (lower(email));

CREATE TABLE media_objects (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    uploaded_by uuid NOT NULL REFERENCES app_users(id),
    bucket text NOT NULL CHECK (btrim(bucket) <> ''),
    object_key text NOT NULL CHECK (btrim(object_key) <> ''),
    content_type text NOT NULL CHECK (content_type LIKE 'image/%'),
    byte_size bigint NOT NULL CHECK (byte_size > 0 AND byte_size <= 5242880),
    UNIQUE (bucket, object_key)
);
CREATE INDEX media_objects_uploader_idx ON media_objects(uploaded_by);

-- Added after media_objects because users and uploads reference each other.
ALTER TABLE app_users ADD FOREIGN KEY (photo_id) REFERENCES media_objects(id);
CREATE INDEX app_users_photo_idx ON app_users(photo_id);

CREATE TABLE sitter_profiles (
    user_id uuid PRIMARY KEY,
    user_role text GENERATED ALWAYS AS ('sitter'::text) STORED,
    username text NOT NULL UNIQUE CHECK (username ~ '^[a-z][a-z0-9_]{2,23}$'),
    qualifications text NOT NULL DEFAULT '',
    experience_summary text NOT NULL DEFAULT '',
    available boolean NOT NULL DEFAULT true,
    FOREIGN KEY (user_id, user_role) REFERENCES app_users(id, role)
);

CREATE TABLE dogs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id uuid NOT NULL,
    owner_role text GENERATED ALWAYS AS ('owner'::text) STORED,
    name text NOT NULL CHECK (btrim(name) <> ''),
    photo_id uuid REFERENCES media_objects(id),
    breed text NOT NULL DEFAULT '',
    age_label text NOT NULL DEFAULT '',
    gender text NOT NULL CHECK (gender IN ('Female', 'Male')),
    feeding_instructions text NOT NULL DEFAULT '',
    medical_information text NOT NULL DEFAULT '',
    FOREIGN KEY (owner_id, owner_role) REFERENCES app_users(id, role)
);
CREATE INDEX dogs_owner_idx ON dogs(owner_id);

CREATE TABLE emergency_contacts (
    dog_id uuid PRIMARY KEY REFERENCES dogs(id),
    name text NOT NULL CHECK (btrim(name) <> ''),
    contact_details text NOT NULL CHECK (btrim(contact_details) <> '')
);

CREATE TABLE dog_preferences (
    dog_id uuid NOT NULL REFERENCES dogs(id),
    kind text NOT NULL CHECK (kind IN ('love', 'dislike')),
    label text NOT NULL CHECK (btrim(label) <> ''),
    PRIMARY KEY (dog_id, kind, label)
);

CREATE TABLE sitter_services (
    sitter_id uuid NOT NULL REFERENCES sitter_profiles(user_id),
    service_name text NOT NULL CHECK (btrim(service_name) <> ''),
    PRIMARY KEY (sitter_id, service_name)
);

CREATE TABLE sitter_references (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    sitter_id uuid NOT NULL REFERENCES sitter_profiles(user_id),
    name text NOT NULL CHECK (btrim(name) <> ''),
    relationship_label text NOT NULL DEFAULT '',
    reference_text text NOT NULL DEFAULT ''
);
CREATE INDEX sitter_references_sitter_idx ON sitter_references(sitter_id);

CREATE TABLE care_arrangements (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    dog_id uuid NOT NULL REFERENCES dogs(id),
    sitter_id uuid NOT NULL REFERENCES sitter_profiles(user_id),
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'declined', 'ended'))
);
CREATE UNIQUE INDEX one_open_arrangement_per_dog ON care_arrangements(dog_id)
    WHERE status IN ('pending', 'active');
CREATE INDEX care_arrangements_sitter_idx ON care_arrangements(sitter_id, status);
CREATE INDEX care_arrangements_dog_idx ON care_arrangements(dog_id);

CREATE TABLE care_updates (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    arrangement_id uuid NOT NULL REFERENCES care_arrangements(id),
    photo_id uuid NOT NULL REFERENCES media_objects(id),
    type text NOT NULL CHECK (type IN ('Walk', 'Meal', 'Play', 'Rest', 'General')),
    body text CHECK (body IS NULL OR char_length(body) <= 400),
    occurred_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX care_updates_timeline_idx ON care_updates(arrangement_id, occurred_at DESC, id DESC);
CREATE INDEX care_updates_photo_idx ON care_updates(photo_id);

COMMIT;
