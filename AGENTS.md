# CaraPaws — Agent Guide

## Project purpose

CaraPaws is a mobile dog-care application that helps dog owners stay emotionally connected to, and informed about, their dog while the dog is in a sitter's care. The product should feel trustworthy, warm, and easy to use. Its intended promise is: **a dog needs a friend, not merely a sitter**.

The intended initial market is Ireland. The team has identified a large Irish dog-owning audience, but do not present CaraPaws as “Ireland's first” platform without independent market validation.

The project has two primary roles:

- **Dog owner:** signs in to a dedicated owner portal, views their dog's profile, and follows care updates.
- **Dog sitter:** signs in to a dedicated sitter portal and sends photo and text updates about the dog's care.

## Confirmed product requirements

### Owner experience

The core owner flow is:

1. Login
2. Dog profile
3. Dog updates/timeline

Each dog profile should support:

- Name, photo, gender, age, and breed
- Feeding time
- Medical information
- Emergency contact
- Things the dog loves and dislikes

The updates view should show care events such as breakfast and walks, with timestamps. It should feel like a timely, real-time feed and help the owner feel reassured and connected. Until a backend exists, simulate immediate updates in local prototype state rather than claiming real-time delivery.

### Sitter experience

Sitters need an efficient way to post care updates. Every update must include a **photo** and may include explanatory text. Prototype the sitter flow around creating and sending these updates.

### Sitter Profile
- Basic Info: Name, Location, Contact
- Experience: Showcased via a short "About me" bio and years of experience
- Reference Points: @Gal ???
- 
### Candidate stretch features

Only implement these after the core flows are convincingly demonstrated:

- Start/end walk tracking
- Video support
- Multiple bookings
- Mood updates
- Push notifications
- Dedicated sitter profile

## Planned technology and prototype boundaries

- Build the UI with **React**, **Capacitor**, and **Material UI (MUI)**.
- Target Android and iOS through Capacitor; keep screens responsive and touch-first.
- Begin with realistic **dummy data**. Do not require a backend, authentication provider, file storage, or device permissions to demonstrate the core prototype.
- Preserve clear separation between UI components, mock data, and future data-access code so a database/API can replace mocks with minimal screen rewrites.

## Data-model direction for the upcoming schema work

The prototype implies, at minimum, these concepts:

- User (with an owner or sitter role)
- Dog
- Emergency contact
- Care booking/assignment (may start as a simple mock relationship)
- Care update (timestamp, required image, optional text, type such as meal or walk)
- Optional: walk session, mood, notification, and sitter profile

Model the relationships deliberately before building persistence. A dog can accumulate many updates; updates should identify the dog, author/sitter, time, and image reference.

## UX and implementation principles

- Prioritize reassurance, clarity, accessibility, and a friendly visual tone over feature count.
- Make photos prominent in owner updates, because photos are mandatory for sitter updates.
- Use MUI components and theme tokens rather than one-off visual styles.
- Use reusable, typed components and keep the owner and sitter experiences distinct.
- Use the product language consistently: **CaraPaws** (not “CaraPows”) and the concept of care, trust, connection, and peace of mind.
- Include empty, loading, and error states even when using dummy data.
- Use obvious mock images/data and never place secrets, real private contact details, or personal credentials in the repository.

## Repository conventions

- `documentation/` contains source project materials. Treat the submitted Word files as reference; do not edit them unless explicitly asked.
- Keep technical guidance and continuously updated developer documentation in Markdown when possible, because it is reviewable in Git.
- Do not commit build outputs, installed dependencies, environment files with secrets, or generated native-platform artifacts unless the project explicitly needs them.
- Before a backend exists, document any mock-data assumptions made by a screen or component.

## Team context

The team values transparency, mutual respect, and collaboration. Existing coordination tools include WhatsApp, Outlook, OneDrive, and Git. Keep changes focused, explain meaningful decisions, and flag assumptions that could affect the agreed scope.
