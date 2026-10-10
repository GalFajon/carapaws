-- Initial prototype schema. Run automatically on first creation of the Compose DB volume.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE app_users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    display_name text NOT NULL CHECK (btrim(display_name) <> ''),
    role text NOT NULL CHECK (role IN ('owner', 'sitter')),
    email text UNIQUE,
    phone text,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE dogs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id uuid NOT NULL REFERENCES app_users(id),
    name text NOT NULL CHECK (btrim(name) <> ''),
    photo_ref text NOT NULL CHECK (btrim(photo_ref) <> ''),
    breed text NOT NULL DEFAULT '',
    -- The UI currently shows a label such as "4 years"; a date of birth can replace it later.
    age_label text NOT NULL DEFAULT '',
    gender text NOT NULL DEFAULT '',
    feeding_instructions text NOT NULL DEFAULT '',
    medical_information text NOT NULL DEFAULT '',
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (id, owner_id)
);

CREATE INDEX dogs_owner_id_idx ON dogs(owner_id);

CREATE TABLE emergency_contacts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    dog_id uuid NOT NULL REFERENCES dogs(id) ON DELETE CASCADE,
    name text NOT NULL CHECK (btrim(name) <> ''),
    contact_details text NOT NULL CHECK (btrim(contact_details) <> ''),
    relationship_label text,
    is_primary boolean NOT NULL DEFAULT false
);

CREATE UNIQUE INDEX one_primary_emergency_contact_per_dog
    ON emergency_contacts(dog_id) WHERE is_primary;

CREATE TABLE dog_preferences (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    dog_id uuid NOT NULL REFERENCES dogs(id) ON DELETE CASCADE,
    kind text NOT NULL CHECK (kind IN ('love', 'dislike')),
    label text NOT NULL CHECK (btrim(label) <> ''),
    UNIQUE (dog_id, kind, label)
);

CREATE TABLE sitter_profiles (
    user_id uuid PRIMARY KEY REFERENCES app_users(id) ON DELETE CASCADE,
    location text NOT NULL DEFAULT '',
    contact_details text NOT NULL DEFAULT '',
    qualifications text NOT NULL DEFAULT '',
    reference_points text NOT NULL DEFAULT ''
);

CREATE TABLE sitter_reviews (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    sitter_id uuid NOT NULL REFERENCES sitter_profiles(user_id) ON DELETE CASCADE,
    reviewer_user_id uuid REFERENCES app_users(id) ON DELETE SET NULL,
    reviewer_name text NOT NULL CHECK (btrim(reviewer_name) <> ''),
    rating smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
    feedback text NOT NULL DEFAULT '',
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX sitter_reviews_sitter_id_idx ON sitter_reviews(sitter_id);

CREATE TABLE sitter_references (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    sitter_id uuid NOT NULL REFERENCES sitter_profiles(user_id) ON DELETE CASCADE,
    name text NOT NULL CHECK (btrim(name) <> ''),
    relationship_label text NOT NULL DEFAULT '',
    reference_text text NOT NULL DEFAULT ''
);

CREATE INDEX sitter_references_sitter_id_idx ON sitter_references(sitter_id);

CREATE TABLE care_bookings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    dog_id uuid NOT NULL,
    owner_id uuid NOT NULL,
    sitter_id uuid NOT NULL REFERENCES app_users(id),
    starts_at timestamptz NOT NULL,
    ends_at timestamptz NOT NULL,
    CHECK (ends_at > starts_at),
    FOREIGN KEY (dog_id, owner_id) REFERENCES dogs(id, owner_id),
    UNIQUE (id, dog_id, sitter_id)
);

CREATE INDEX care_bookings_dog_start_idx ON care_bookings(dog_id, starts_at DESC);
CREATE INDEX care_bookings_sitter_id_idx ON care_bookings(sitter_id);

CREATE TABLE care_updates (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id uuid NOT NULL,
    dog_id uuid NOT NULL,
    author_sitter_id uuid NOT NULL,
    occurred_at timestamptz NOT NULL DEFAULT now(),
    image_ref text NOT NULL CHECK (btrim(image_ref) <> ''),
    type text NOT NULL CHECK (type IN ('Walk', 'Meal', 'Play', 'Rest', 'General')),
    body text CHECK (body IS NULL OR char_length(body) <= 400),
    FOREIGN KEY (booking_id, dog_id, author_sitter_id)
        REFERENCES care_bookings(id, dog_id, sitter_id)
);

CREATE INDEX care_updates_dog_time_idx ON care_updates(dog_id, occurred_at DESC);
