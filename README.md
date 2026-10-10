# CaraPaws development stack

Run the React/Vite prototype, a minimal Express API, and PostgreSQL with:

```powershell
docker compose up --build
```

- Web UI: http://localhost:5173
- Express example: http://localhost:3000/api/hello (also proxied at http://localhost:5173/api/hello)
- PostgreSQL: localhost:5432, database `carapaws`, user `carapaws`, password `carapaws_dev`

These credentials are local development defaults. Do not use this Compose file as a production deployment.

Stop with `docker compose down`. Database data lives in the `postgres_data` volume and survives restarts. `db/schema.sql` runs automatically only when that volume is first created. For an existing volume, apply later schema changes as migrations or run the SQL explicitly with `docker compose exec -T db psql -U carapaws -d carapaws < db/schema.sql` (the initial file is not intended to be rerun). To start over with an empty database, `docker compose down --volumes` removes all Compose volumes, including dependency volumes.

## Current boundary

The UI still reads `src/data/mockData.ts` through its in-memory care service. The Express endpoint is a hello-world example; it does not expose the schema or persist updates yet. Photo uploads in the prototype are browser data URLs; `care_updates.image_ref` is intended to hold a future stored image reference or URL, not binary image data. The database starts empty, without demo people or private contact information.

## Schema mapping

`db/schema.sql` covers the current screens: owner/sitter users, dogs and their owner, primary emergency contact and love/dislike preferences, sitter profile with reviews and references, care bookings, and photo-required care updates. Updates include the dog, booking, sitter author, event time, type, image reference, and optional text. The booking key ensures an update belongs to the same dog and sitter as its booking. `age_label`, feeding and medical text follow the current UI format. Reviewer names and references may be fictional display-only names until identity and moderation rules are decided. Authentication, uploads, and authorization are future API work.
