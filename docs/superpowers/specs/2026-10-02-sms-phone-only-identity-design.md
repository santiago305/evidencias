# Mobile Phone-Only Header Identity Design

## Objective

Make every mobile SMS and WhatsApp header display the contact phone number and never the contact name. Existing SMS/RCS conversation identity labels that appear before the SMS message list must also use the phone number exclusively.

Calls remain outside this change.

## Required Result

For every mobile from `mobile-1` through `mobile-15`:

- The visible SMS header identity is the phone number, formatted according to that mobile's existing formatter.
- The visible WhatsApp header identity is the formatted phone number, including the existing `+51` presentation.
- A supplied `nombre` never replaces the number in either header.
- Header avatars remain visible.
- A fallback header avatar never displays an initial derived from `nombre`; an uploaded contact image may still be displayed.
- Mobiles that already use a generic person avatar keep it.
- Mobile 13 SMS always uses its existing generic anonymous avatar instead of its name-initial branch.
- A missing or blank phone displays `-`.

For mobiles that render SMS conversation identity labels:

- The RCS variant displays `Chat RCS con <numero>`.
- The SMS/MMS variant displays its existing phrase with `<numero>`.
- Mobile-specific wording is preserved. For example, a mobile that currently uses `Escribiéndote con ...` keeps that wording.
- The encryption explanation and `Más información` text remain unchanged.
- Mobile 12 and Mobile 13 do not gain an RCS or SMS/MMS introduction because they currently do not render one.

## Current Architecture

SMS implementations fall into three groups:

1. Mobile 1 through Mobile 6 use shared SMS components.
2. Mobile 7, 8, 9, 14, and 15 have local components but re-export the shared conversation date and identity-label logic.
3. Mobile 10 and Mobile 11 contain local copies of `buildSmsConversationHeader` because their date and wording behavior differs.

Most SMS headers currently delegate to a name-first resolver. Mobile 13 has separate header identity logic and is the only SMS header found to generate an avatar initial from the name.

WhatsApp has thirteen physical header implementations. Mobile 4 reuses Mobile 1's header and Mobile 5 reuses Mobile 3's header, so those thirteen implementations cover all fifteen profiles. Every implementation calls `resolveWhatsappHeaderIdentity(data)`, which gives one shared point for changing the visible title and disabling name initials.

The WhatsApp runtime currently reuses `contactIdentityDisplay.headerTitle` as the quoted-message author. Once the header title becomes phone-only, that data flow must be separated so the change remains confined to the visible header.

## Shared Phone Contract

Add a channel-neutral phone resolver to `resources/js/evidence-generator/lib/contactHeaderIdentity.ts` while preserving the existing name-first `resolveContactHeaderIdentity` function for Calls, contact profiles, and other name-based contexts.

```ts
resolveContactPhoneDisplay(
    data: Pick<ContactIdentityInput, 'telefono'>,
    options?: ContactIdentityOptions,
): string
```

Behavior:

1. Trim `telefono`.
2. Return `-` when it is blank or missing.
3. Apply `options.formatPhone` when supplied.
4. Never inspect `nombre`.

The SMS-specific `resolveSmsPhoneDisplay` wrapper will delegate to this function so current SMS imports stay local to the SMS feature. WhatsApp will use the same channel-neutral resolver through `resolveWhatsappHeaderIdentity`.

## SMS Headers and Conversation Labels

All SMS header implementations consume `resolveSmsPhoneDisplay`. Existing per-mobile formatters remain responsible for spacing, country prefixes, and other visual formatting.

The shared `buildSmsConversationHeader` remains responsible for selecting the RCS or SMS/MMS label. Its identity input becomes phone-only so it cannot reintroduce name fallback behavior.

Each SMS implementation uses the resolved phone for:

- the visible SMS header;
- `Chat RCS con <numero>`;
- the alternative SMS/MMS introduction;
- save-contact cards that already display the phone.

Mobile 10 and Mobile 11 keep their local conversation-header builders. Those builders call the shared phone resolver while retaining their wording and date behavior.

## WhatsApp Header and Profile Separation

`resolveWhatsappHeaderIdentity` becomes the phone-only header contract:

- `title` is the formatted phone or `-`;
- `displaysPhone` is true when a phone exists;
- `hasName` is false so existing header avatar branches cannot render a name initial.

`buildContactIdentityDisplay` must resolve two identities independently:

1. Header identity uses `resolveWhatsappHeaderIdentity` and is phone-only.
2. Profile identity keeps using `resolveContactHeaderIdentity` and remains name-first.

This preserves the contact profile title, profile subtitle, add-contact behavior, and any non-header identity context.

Every preview that passes a display title to a WhatsApp conversation must pass `profileTitle` instead of `headerTitle`. This prevents the header-only requirement from changing quoted-message authors. Header components continue receiving `headerTitle`.

WhatsApp Desktop is outside the mobile-only requirement and remains unchanged.

## Mobile 13 SMS Avatar and Header

Mobile 13 keeps its local header geometry:

- `SmsHeaderContactPill` resolves the actual formatted phone through the shared SMS phone resolver.
- The hardcoded placeholder phone is removed.
- `SmsHeaderAvatar` always renders the existing `Mobile13SmsDefaultAvatar` artwork.
- The name-based gradient and initial branch are removed.
- Avatar size, position, background treatment, SVG geometry, and header layout remain unchanged.

No new avatar component is introduced.

## Data Flow

```text
telefono
   |
   v
resolveContactPhoneDisplay
   |
   +--> resolveSmsPhoneDisplay --> SMS header + SMS/RCS introduction
   |
   +--> resolveWhatsappHeaderIdentity --> WhatsApp mobile header

nombre + telefono
   |
   +--> resolveContactHeaderIdentity --> WhatsApp profile and conversation author
   |
   +--> existing Calls identity behavior
```

## Scope Boundaries

The implementation must not change:

- Calls identity behavior;
- WhatsApp profile identity or quoted-message authors;
- WhatsApp Desktop;
- generated message bodies or authors;
- SMS/RCS random selection;
- encryption state or copy;
- dates, timestamps, metadata, quick replies, drafts, or message status;
- component dimensions, spacing, typography, colors, icons, borders, or positioning;
- navigation and header actions.

## Verification

Tests prove the behavior at four levels:

1. **Shared phone resolver**
   - A populated name cannot replace the formatted phone.
   - A blank phone returns `-`.
   - The existing general resolver remains name-first.

2. **SMS conversation labels**
   - RCS always uses the phone.
   - SMS/MMS always uses the phone even when `nombre` is populated.
   - Random branch selection and existing wording remain unchanged.

3. **WhatsApp separation**
   - Header title is phone-only and `hasName` is false.
   - Profile title remains name-first.
   - WhatsApp conversations receive `profileTitle`, preserving quote authors.
   - All fifteen profiles route through the shared WhatsApp header resolver.

4. **Mobile coverage**
   - Every SMS header consumes the phone-only resolver.
   - Mobile 13 SMS renders the generic avatar and contains no name-initial path.
   - Mobile 12 and Mobile 13 still omit the RCS introduction.
   - Mobile 10 and Mobile 11 preserve their local time and wording behavior.

Run the focused identity and profile tests, followed by TypeScript and lint for changed files. Existing tests that explicitly expect names in the affected headers are updated only for the new phone-only requirement.

## Acceptance Criteria

- With both `nombre` and `telefono` populated, every SMS and WhatsApp mobile header shows the phone.
- No SMS or WhatsApp mobile header fallback avatar shows a name-derived initial.
- Existing uploaded WhatsApp avatar images still render.
- Every rendered RCS or SMS/MMS introduction uses the phone.
- Phone formatting remains specific to each channel and mobile.
- Blank phone values fail safely to `-`.
- WhatsApp profiles and quoted-message authors retain their current name-first behavior.
- Calls and WhatsApp Desktop remain unchanged.
- No layout or interaction behavior changes.
