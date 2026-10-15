# CaraPaws development stack

Run the React/Vite prototype, a minimal Express API, and PostgreSQL with:

```powershell
docker compose up --build
```

- Web UI: http://localhost:5173
- Express example: http://localhost:3000/api/hello (also proxied at http://localhost:5173/api/hello)
- PostgreSQL: localhost:5432, database `carapaws`, user `carapaws`, password `carapaws_dev`

These credentials are local development defaults. Do not use this Compose file as a production deployment.

Stop with `docker compose down`. Database data lives in the `postgres_data` volume and survives restarts. `db/schema.sql` runs automatically only when that volume is first created. It initializes an empty database and must not be rerun against an existing schema. Existing databases need an explicit migration; updating the file does not change a running database.

## Current boundary

The UI still reads `src/data/mockData.ts` through its in-memory care service. The Express endpoint is a hello-world example; it does not expose the schema or persist updates yet. Photo uploads in the prototype are browser data URLs. The schema instead links account, dog and update photos to `media_objects`; its bucket and object key locate files in future object storage. The database starts empty, without demo people or private contact information.

## Schema mapping

`db/schema.sql` is the canonical PostgreSQL 17 schema aligned with the agreed ERD. It includes shared owner/sitter accounts, sitter profiles and services, dogs, one emergency contact per dog, love/dislike preferences, sitter references, care arrangements, media metadata and photo-required updates. Reviews and scheduled bookings are excluded.

Arrangements retain the statuses `pending`, `active`, `declined` and `ended`. Care updates reference only their arrangement; the dog and sitter are retrieved through that relationship. Shared account photos use `app_users.photo_id`, and sitter experience is stored in `experience_summary`. Generated role checks enforce owner/sitter relationships. Authentication, object uploads and API authorization are future work.

Keep each arrangement's dog and sitter unchanged after creation so historical update authorship remains valid. The API must enforce this alongside access checks.

Regenerate the ERD with:

```powershell
python db/generate_erd.py
```

The generator reads `db/schema.sql`, checks foreign-key names/types, and uses Graphviz to render PNG and SVG diagrams. The generated files are written to `db/erd/` and excluded from Git. Python and Graphviz's `dot` executable are required.
