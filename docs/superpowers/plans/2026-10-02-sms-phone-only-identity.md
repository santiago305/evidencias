# Mobile Phone-Only Identity Implementation Plan

> **Execution rule:** This document is the deliverable for the current request. Do not execute the product changes until the user approves this plan.

**Goal:** Make every mobile SMS and WhatsApp header display the phone number, remove name-derived header avatar initials, and make every existing SMS/RCS conversation identity label display the phone number.

**Architecture:** Add one channel-neutral phone formatter beside the existing name-first contact resolver. SMS will consume it through its local wrapper. WhatsApp will use it only for mobile header identity while retaining the existing name-first resolver for profiles and quoted-message authors. Calls keep the existing resolver and behavior.

**Tech Stack:** React 19, TypeScript 5.7, Node test runner, Inertia/Laravel frontend structure.

---

## Constraints

- Work inline in the current checkout; do not create a worktree.
- Preserve the existing uncommitted changes in:
  - `resources/js/evidence-generator/features/preview/designs/shared/mobile-preview/frameRenderers.tsx`
  - `resources/js/evidence-generator/features/preview/designs/mobile-3/Mobile3SmsStatusBar.test.ts`
- SMS and WhatsApp mobile headers must always show the phone, even when `nombre` is populated.
- SMS and WhatsApp mobile header fallback avatars must never render an initial from `nombre`.
- Uploaded WhatsApp avatar images must continue to render.
- Calls and WhatsApp Desktop remain unchanged.
- Preserve WhatsApp profile titles and quoted-message authors as name-first.
- Preserve generated messages, dates, metadata, quick replies, interaction behavior, dimensions, spacing, typography, colors, icons, and navigation.
- Do not add RCS/SMS introductory UI to Mobile 12 or Mobile 13.
- Keep each mobile's existing phone formatter and SMS introductory wording.
- Do not change dependencies.

## File Map

### Shared phone identity

- Modify: `resources/js/evidence-generator/lib/contactHeaderIdentity.ts`
- Modify: `resources/js/evidence-generator/lib/contactHeaderIdentity.test.ts`
- Modify: `resources/js/evidence-generator/features/preview/designs/shared/sms/contactHeaderIdentity.ts`
- Modify: `resources/js/evidence-generator/features/preview/designs/shared/sms/contactHeaderIdentity.test.ts`

### SMS headers

- Modify: `resources/js/evidence-generator/features/preview/designs/shared/sms/sms-header/SmsMobileHeader.tsx`
- Modify: `resources/js/evidence-generator/features/preview/designs/mobile-7/sms/sms-header/SmsMobileHeader.tsx`
- Modify: `resources/js/evidence-generator/features/preview/designs/mobile-8/sms/sms-header/SmsMobileHeader.tsx`
- Modify: `resources/js/evidence-generator/features/preview/designs/mobile-9/sms/sms-header/SmsMobileHeader.tsx`
- Modify: `resources/js/evidence-generator/features/preview/designs/mobile-10/sms/sms-header/SmsMobileHeader.tsx`
- Modify: `resources/js/evidence-generator/features/preview/designs/mobile-11/sms/sms-header/SmsMobileHeader.tsx`
- Modify: `resources/js/evidence-generator/features/preview/designs/mobile-12/sms/sms-header/SmsMobileHeader.tsx`
- Modify: `resources/js/evidence-generator/features/preview/designs/mobile-14/sms/sms-header/SmsMobileHeader.tsx`
- Modify: `resources/js/evidence-generator/features/preview/designs/mobile-15/sms/sms-header/SmsMobileHeader.tsx`
- Modify: `resources/js/evidence-generator/features/preview/designs/mobile-13/sms/sms-header/smsHeaderIdentity.ts`
- Modify: `resources/js/evidence-generator/features/preview/designs/mobile-13/sms/sms-header/smsHeaderIdentity.test.ts`
- Modify: `resources/js/evidence-generator/features/preview/designs/mobile-13/sms/sms-header/SmsHeaderContactPill.tsx`
- Modify: `resources/js/evidence-generator/features/preview/designs/mobile-13/sms/sms-header/SmsHeaderAvatar.tsx`
- Modify: `resources/js/evidence-generator/features/preview/designs/mobile-13/sms/sms-header/smsHeaderGlassPill.test.ts`
- Modify: `resources/js/evidence-generator/features/preview/designs/mobile-13/Mobile13Preview.test.ts`
- Modify: `resources/js/evidence-generator/features/preview/designs/shared/contactIdentityProfiles.test.ts`

### SMS conversation identity labels

- Modify: `resources/js/evidence-generator/features/preview/designs/shared/sms/smsDateTime.ts`
- Modify: `resources/js/evidence-generator/features/preview/designs/shared/sms/smsDateTime.test.ts`
- Modify: `resources/js/evidence-generator/features/preview/designs/shared/sms/SmsConversation.tsx`
- Modify: `resources/js/evidence-generator/features/preview/designs/mobile-10/sms/smsDateTime.ts`
- Modify: `resources/js/evidence-generator/features/preview/designs/mobile-11/sms/smsDateTime.ts`
- Create: `resources/js/evidence-generator/features/preview/designs/shared/sms/smsConversationIdentityProfiles.test.ts`

### WhatsApp mobile headers and conversation isolation

- Modify: `resources/js/evidence-generator/features/preview/designs/shared/whatsapp/contactIdentityDisplay.ts`
- Modify: `resources/js/evidence-generator/features/preview/designs/shared/whatsapp/contactIdentityDisplay.test.ts`
- Modify: `resources/js/evidence-generator/features/preview/designs/shared/mobile-preview/MobileWhatsappPreview.tsx`
- Modify: `resources/js/evidence-generator/features/preview/designs/mobile-4/whatsapp/PreviewMobile4Whatsapp.tsx`
- Modify: `resources/js/evidence-generator/features/preview/designs/mobile-7/whatsapp/PreviewMobile7Whatsapp.tsx`
- Modify: `resources/js/evidence-generator/features/preview/designs/mobile-8/whatsapp/PreviewMobile8Whatsapp.tsx`
- Modify: `resources/js/evidence-generator/features/preview/designs/mobile-9/whatsapp/PreviewMobile9Whatsapp.tsx`
- Modify: `resources/js/evidence-generator/features/preview/designs/mobile-10/whatsapp/PreviewMobile10Whatsapp.tsx`
- Modify: `resources/js/evidence-generator/features/preview/designs/mobile-11/whatsapp/PreviewMobile11Whatsapp.tsx`
- Modify: `resources/js/evidence-generator/features/preview/designs/mobile-12/whatsapp/PreviewMobile12Whatsapp.tsx`
- Modify: `resources/js/evidence-generator/features/preview/designs/mobile-13/whatsapp/PreviewMobile13Whatsapp.tsx`
- Modify: `resources/js/evidence-generator/features/preview/designs/mobile-14/whatsapp/PreviewMobile14Whatsapp.tsx`
- Modify: `resources/js/evidence-generator/features/preview/designs/mobile-15/whatsapp/PreviewMobile15Whatsapp.tsx`
- Modify when assertions require it: `resources/js/evidence-generator/features/preview/designs/mobile-4/Mobile4Preview.test.ts`
- Modify when assertions require it: `resources/js/evidence-generator/features/preview/designs/mobile-13/Mobile13Preview.test.ts`

---

### Task 1: Add one shared phone-only resolver

**Files:**

- Modify: `resources/js/evidence-generator/lib/contactHeaderIdentity.test.ts`
- Modify: `resources/js/evidence-generator/lib/contactHeaderIdentity.ts`
- Modify: `resources/js/evidence-generator/features/preview/designs/shared/sms/contactHeaderIdentity.test.ts`
- Modify: `resources/js/evidence-generator/features/preview/designs/shared/sms/contactHeaderIdentity.ts`

- [ ] **Step 1: Add failing tests for the channel-neutral phone contract**

Extend `lib/contactHeaderIdentity.test.ts` to prove:

```ts
const namedContact = { nombre: 'María José', telefono: ' 987654321 ' };

assert.equal(
    resolveContactPhoneDisplay(namedContact, {
        formatPhone: (phone) => `+51 ${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6)}`,
    }),
    '+51 987 654 321',
);
assert.equal(resolveContactPhoneDisplay({ telefono: '   ' }), '-');
assert.equal(resolveContactPhoneDisplay({ telefono: null }), '-');
```

Keep the existing tests proving `resolveContactHeaderIdentity` prefers `nombre`.

- [ ] **Step 2: Change the SMS resolver test to require delegation**

In `shared/sms/contactHeaderIdentity.test.ts`, test that `resolveSmsPhoneDisplay` returns the formatted phone even when the source object also contains a name, and returns `-` for a blank phone. Add a source assertion or direct spy-free contract assertion showing the wrapper uses `resolveContactPhoneDisplay`.

- [ ] **Step 3: Run the tests and verify RED**

```powershell
node --experimental-strip-types --test resources/js/evidence-generator/lib/contactHeaderIdentity.test.ts resources/js/evidence-generator/features/preview/designs/shared/sms/contactHeaderIdentity.test.ts
```

Expected: FAIL because `resolveContactPhoneDisplay` and the updated SMS contract do not exist.

- [ ] **Step 4: Implement the shared resolver without changing the existing resolver**

Add to `lib/contactHeaderIdentity.ts`:

```ts
export function resolveContactPhoneDisplay(
    data: Pick<ContactIdentityInput, 'telefono'>,
    options: ContactIdentityOptions = {},
): string {
    const phone = data.telefono?.trim() ?? '';

    if (!phone) {
        return '-';
    }

    return options.formatPhone ? options.formatPhone(phone) : phone;
}
```

Do not alter the behavior or result shape of `resolveContactHeaderIdentity`.

- [ ] **Step 5: Make the SMS wrapper delegate to the shared resolver**

```ts
export function resolveSmsPhoneDisplay(
    data: Pick<SmsData, 'telefono'>,
    formatPhone?: (phone: string) => string,
): string {
    return resolveContactPhoneDisplay(data, { formatPhone });
}
```

Follow the project's optional-property convention if TypeScript's exact optional property settings require conditionally creating the options object.

- [ ] **Step 6: Run the tests and verify GREEN**

Run the Step 3 command. Expected: both files PASS, including the name-first regression test for the original resolver.

- [ ] **Step 7: Commit only the shared contract**

```powershell
git add -- resources/js/evidence-generator/lib/contactHeaderIdentity.ts resources/js/evidence-generator/lib/contactHeaderIdentity.test.ts resources/js/evidence-generator/features/preview/designs/shared/sms/contactHeaderIdentity.ts resources/js/evidence-generator/features/preview/designs/shared/sms/contactHeaderIdentity.test.ts
git commit -m "refactor: centralize phone-only identity"
```

---

### Task 2: Apply phone-only identity to every SMS header

**Files:**

- Modify the SMS header, Mobile 13, and profile-test files listed in the File Map.

- [ ] **Step 1: Update the cross-mobile source test**

In `shared/contactIdentityProfiles.test.ts`:

- keep the WhatsApp resolver coverage;
- require `resolveSmsPhoneDisplay(data` in the shared header and Mobile 7, 8, 9, 10, 11, 12, 14, and 15 headers;
- require `resolveSmsPhoneDisplay(data, formatMobile13SmsPhone)` in Mobile 13;
- remove the SMS assertion that depends on `resolveContactHeaderIdentity`.

- [ ] **Step 2: Rewrite Mobile 13 SMS identity tests**

In `smsHeaderIdentity.test.ts`, retain formatter coverage and remove name/initial expectations.

In `smsHeaderGlassPill.test.ts` and `Mobile13Preview.test.ts`, require:

```ts
assert.match(contactSource, /resolveSmsPhoneDisplay\(data, formatMobile13SmsPhone\)/);
assert.doesNotMatch(avatarSource, /data\.nombre|resolveSmsHeaderInitial|initial/);
assert.match(avatarSource, /<Mobile13SmsDefaultAvatar\s*\/>/);
```

Keep all geometry, glass, color, SVG, and size assertions.

- [ ] **Step 3: Run the header tests and verify RED**

```powershell
node --experimental-strip-types --test resources/js/evidence-generator/features/preview/designs/shared/contactIdentityProfiles.test.ts resources/js/evidence-generator/features/preview/designs/mobile-13/sms/sms-header/smsHeaderIdentity.test.ts resources/js/evidence-generator/features/preview/designs/mobile-13/sms/sms-header/smsHeaderGlassPill.test.ts resources/js/evidence-generator/features/preview/designs/mobile-13/Mobile13Preview.test.ts
```

Expected: FAIL because SMS headers still use name-first identity and Mobile 13 still has its name-initial branch.

- [ ] **Step 4: Migrate the shared and local standard headers**

In each standard SMS header, replace the current identity resolver with:

```ts
const displayTelefono = resolveSmsPhoneDisplay(data, existingMobileFormatter);
```

Use the existing formatter in each file. Mobile 12 may call `resolveSmsPhoneDisplay(data)` if it currently displays the raw phone. Do not change JSX, avatar artwork, styles, sizes, or actions.

The shared header covers Mobile 1 through Mobile 6 according to the profile mapping.

- [ ] **Step 5: Migrate Mobile 13**

- Keep only `formatMobile13SmsPhone` in `smsHeaderIdentity.ts`.
- In `SmsHeaderContactPill.tsx`, resolve the real phone with `resolveSmsPhoneDisplay(data, formatMobile13SmsPhone)`.
- In `SmsHeaderAvatar.tsx`, remove all reads of `data.nombre`, the initial span, and the name-based gradient.
- Always render the existing `Mobile13SmsDefaultAvatar`.
- Preserve the component props, dimensions, anonymous background, color, and SVG.

- [ ] **Step 6: Run the tests and verify GREEN**

Run the Step 3 command. Expected: all selected tests PASS and all fifteen SMS profiles are covered.

- [ ] **Step 7: Commit the SMS header migration**

Stage only the files named in this task, then commit:

```powershell
git commit -m "feat: show phone in SMS headers"
```

---

### Task 3: Enforce phone-only SMS/RCS introductions

**Files:**

- Modify: `resources/js/evidence-generator/features/preview/designs/shared/sms/smsDateTime.test.ts`
- Create: `resources/js/evidence-generator/features/preview/designs/shared/sms/smsConversationIdentityProfiles.test.ts`
- Modify: `resources/js/evidence-generator/features/preview/designs/shared/sms/smsDateTime.ts`
- Modify: `resources/js/evidence-generator/features/preview/designs/shared/sms/SmsConversation.tsx`
- Modify: `resources/js/evidence-generator/features/preview/designs/mobile-10/sms/smsDateTime.ts`
- Modify: `resources/js/evidence-generator/features/preview/designs/mobile-11/sms/smsDateTime.ts`

- [ ] **Step 1: Add behavior tests for every builder family**

Test the shared, Mobile 10, and Mobile 11 builders with:

```ts
const contact = { nombre: 'Nombre que no debe mostrarse', telefono: '999999999' };
```

Required assertions:

- random value `0.2` produces `Chat RCS con 999999999`;
- the shared and Mobile 10 SMS branches produce `Mensajes de texto con 999999999 (SMS/MMS)`;
- Mobile 11 preserves `Escribiéndote con 999999999 (SMS/MMS)`;
- all three source files depend on `resolveSmsPhoneDisplay`;
- the existing encryption description stays byte-for-byte unchanged.

- [ ] **Step 2: Run the conversation tests and verify RED**

```powershell
node --experimental-strip-types --test resources/js/evidence-generator/features/preview/designs/shared/sms/smsDateTime.test.ts resources/js/evidence-generator/features/preview/designs/shared/sms/smsConversationIdentityProfiles.test.ts
```

Expected: FAIL on the shared-resolver dependency and any stale name-first expectation.

- [ ] **Step 3: Update the three builders**

In the shared, Mobile 10, and Mobile 11 `smsDateTime.ts` files:

- narrow the builder input to the phone field;
- resolve it once with `resolveSmsPhoneDisplay(data)`;
- use that value in both the RCS and SMS/MMS titles;
- retain the existing random threshold, union result shape, description, date helpers, and local wording.

- [ ] **Step 4: Preserve the formatted shared-family display**

In `shared/sms/SmsConversation.tsx`, pass the already formatted phone into the builder:

```ts
const [conversationHeader] = useState(() => buildSmsConversationHeader({ telefono: displayTelefono }));
```

Do not alter message construction, dates, state, or JSX.

- [ ] **Step 5: Run the tests and verify GREEN**

Run the Step 2 command. Expected: PASS.

- [ ] **Step 6: Commit the SMS introduction migration**

```powershell
git add -- resources/js/evidence-generator/features/preview/designs/shared/sms/smsDateTime.ts resources/js/evidence-generator/features/preview/designs/shared/sms/smsDateTime.test.ts resources/js/evidence-generator/features/preview/designs/shared/sms/smsConversationIdentityProfiles.test.ts resources/js/evidence-generator/features/preview/designs/shared/sms/SmsConversation.tsx resources/js/evidence-generator/features/preview/designs/mobile-10/sms/smsDateTime.ts resources/js/evidence-generator/features/preview/designs/mobile-11/sms/smsDateTime.ts
git commit -m "feat: show phone in SMS introductions"
```

---

### Task 4: Apply phone-only identity to every WhatsApp mobile header

**Files:**

- Modify the WhatsApp identity, preview, and affected test files listed in the File Map.
- Do not modify any `calls/` or `whatsapp-desktop/` file.

- [ ] **Step 1: Rewrite the shared WhatsApp identity tests**

In `shared/whatsapp/contactIdentityDisplay.test.ts`, require this behavior when both name and phone exist:

```ts
assert.deepEqual(resolveWhatsappHeaderIdentity(data), {
    title: '+51 987 654 321',
    hasName: false,
    displaysPhone: true,
});

assert.equal(display.headerTitle, '+51 987 654 321');
assert.equal(display.headerDisplaysPhone, true);
assert.equal(display.profileTitle, 'María José Rodríguez');
assert.equal(display.profileSubtitle, '+51 987 654 321');
assert.equal(display.showAddContactAction, false);
```

Also retain blank-phone fallback and deterministic behavior tests.

- [ ] **Step 2: Add source coverage for header/conversation separation**

Extend `shared/contactIdentityProfiles.test.ts` or add a focused WhatsApp test that proves:

- all fifteen mobile profiles map to a physical header that calls `resolveWhatsappHeaderIdentity(data)`;
- every mobile header title therefore uses the shared phone-only result;
- all custom and composed previews pass `headerTitle` to the Header;
- all WhatsApp Conversation instances pass `profileTitle`, never `headerTitle`.

This test must account for Mobile 4 reusing Mobile 1's header and Mobile 5 reusing Mobile 3's header.

- [ ] **Step 3: Update stale runtime expectations**

In `mobile-4/Mobile4Preview.test.ts`, expect:

- `headerTitle === '+51 999 111 222'`;
- `profileTitle === 'María José Rodríguez'`;
- the WhatsApp conversation source uses `profileTitle`.

Update Mobile 13 source assertions only where they explicitly require `headerTitle` as the conversation display title. Keep its profile-card assertions intact.

- [ ] **Step 4: Run WhatsApp identity tests and verify RED**

```powershell
node --experimental-strip-types --test resources/js/evidence-generator/features/preview/designs/shared/whatsapp/contactIdentityDisplay.test.ts resources/js/evidence-generator/features/preview/designs/shared/contactIdentityProfiles.test.ts resources/js/evidence-generator/features/preview/designs/mobile-4/Mobile4Preview.test.ts resources/js/evidence-generator/features/preview/designs/mobile-13/Mobile13Preview.test.ts
```

Expected: FAIL because the header identity still prefers the name and conversations still receive `headerTitle`.

- [ ] **Step 5: Separate header identity from profile identity**

In `shared/whatsapp/contactIdentityDisplay.ts`:

1. Make `resolveWhatsappHeaderIdentity` use `resolveContactPhoneDisplay` with the current `+51 ${formatTelefonoPE(phone)}` formatter.
2. Return `hasName: false` so existing mobile header avatar branches select their generic fallback instead of a name initial.
3. Set `displaysPhone` from the presence of a trimmed phone.
4. In `buildContactIdentityDisplay`, calculate a separate name-first `profileIdentity` through the unchanged `resolveContactHeaderIdentity`.
5. Build `headerTitle` and `headerDisplaysPhone` from header identity.
6. Build `profileTitle`, `profileSubtitle`, and `showAddContactAction` from profile identity exactly as before.

This single resolver change covers the thirteen physical WhatsApp mobile headers and all fifteen profiles. Do not edit their layout or SVG code.

- [ ] **Step 6: Isolate WhatsApp conversation authors from the header**

In `MobileWhatsappPreview.tsx` and each custom `PreviewMobileXWhatsapp.tsx` listed in the File Map:

- keep `displayTitle={runtime.contactIdentityDisplay.headerTitle}` on the Header;
- change only the Conversation prop to `displayTitle={runtime.contactIdentityDisplay.profileTitle}`.

Do not change `WhatsappConversation`, message data, quote logic, profile cards, or runtime randomness.

- [ ] **Step 7: Run WhatsApp tests and verify GREEN**

Run the Step 4 command. Expected: PASS, with phone-only headers and preserved name-first profiles/conversation authors.

- [ ] **Step 8: Commit the WhatsApp header migration**

Stage only the shared WhatsApp identity file/tests, the listed preview files, and directly affected source-assertion tests:

```powershell
git commit -m "feat: show phone in WhatsApp headers"
```

---

### Task 5: Verify scope and regression safety

**Files:**

- Verify all product and test files changed in Tasks 1 through 4.
- Do not modify Calls or WhatsApp Desktop.

- [ ] **Step 1: Run the focused identity suite**

```powershell
node --experimental-strip-types --test resources/js/evidence-generator/lib/contactHeaderIdentity.test.ts resources/js/evidence-generator/features/preview/designs/shared/sms/contactHeaderIdentity.test.ts resources/js/evidence-generator/features/preview/designs/shared/sms/smsDateTime.test.ts resources/js/evidence-generator/features/preview/designs/shared/sms/smsConversationIdentityProfiles.test.ts resources/js/evidence-generator/features/preview/designs/shared/whatsapp/contactIdentityDisplay.test.ts resources/js/evidence-generator/features/preview/designs/shared/contactIdentityProfiles.test.ts resources/js/evidence-generator/features/preview/designs/mobile-13/sms/sms-header/smsHeaderIdentity.test.ts resources/js/evidence-generator/features/preview/designs/mobile-13/sms/sms-header/smsHeaderGlassPill.test.ts resources/js/evidence-generator/features/preview/designs/mobile-13/sms/smsConversation.test.ts resources/js/evidence-generator/features/preview/designs/mobile-4/Mobile4Preview.test.ts resources/js/evidence-generator/features/preview/designs/mobile-13/Mobile13Preview.test.ts
```

Expected: all selected tests PASS.

- [ ] **Step 2: Run structure tests affected by source assertions**

```powershell
node --experimental-strip-types --test resources/js/evidence-generator/features/preview/designs/PreviewDesignStructure.test.ts resources/js/evidence-generator/features/preview/designs/mobile-7/Mobile7Preview.test.ts resources/js/evidence-generator/features/preview/designs/mobile-8/Mobile8Preview.test.ts
```

Expected: PASS. Update only stale assertions that name the old resolver or old conversation prop.

- [ ] **Step 3: Run TypeScript**

```powershell
npx.cmd tsc --noEmit
```

Expected: exit code 0. If Windows reports `EPERM` while reading `node_modules`, record the environment limitation and retain the focused test output as evidence.

- [ ] **Step 4: Lint the changed TypeScript and TSX files**

Generate the explicit file list from `git diff --name-only`, exclude the two pre-existing Mobile 3/statusbar paths, and run:

```powershell
npx.cmd eslint <changed .ts and .tsx files from this plan>
```

Expected: exit code 0. Apply only formatter or lint fixes.

- [ ] **Step 5: Audit the diff**

```powershell
git diff --check
git diff --name-only 9d301c4..HEAD
git diff 9d301c4..HEAD -- resources/js/evidence-generator/lib resources/js/evidence-generator/features/preview/designs
```

Confirm:

- no file under `calls/` or `whatsapp-desktop/` changed;
- the original `resolveContactHeaderIdentity` remains name-first;
- all mobile SMS and WhatsApp headers show the phone when a name exists;
- no mobile header fallback avatar renders a name initial;
- uploaded WhatsApp avatar images remain supported;
- WhatsApp profiles and conversation quote authors still use the name-first profile title;
- all existing SMS/RCS introductions use the phone;
- Mobile 12 and Mobile 13 still contain no new `Chat RCS con` introduction;
- no class name, dimensions, colors, icons, or component order changed except removal of Mobile 13 SMS's initial branch;
- the pre-existing Mobile 3 statusbar changes remain preserved and unstaged unless explicitly included by the user.

- [ ] **Step 6: Commit verification-only assertion updates, if needed**

If Step 2 reveals additional stale source assertions, stage only those test files and commit:

```powershell
git commit -m "test: align phone identity assertions"
```

Skip this commit when no additional test files change.

---

## Completion Criteria

- All 15 SMS headers display a phone number when `nombre` is also present.
- All 15 WhatsApp mobile headers display a phone number when `nombre` is also present.
- No SMS or WhatsApp mobile header fallback avatar renders a name-derived initial.
- Existing uploaded WhatsApp contact images still render.
- All existing RCS/SMS/MMS introductory identity labels display the phone.
- Mobile 10 and Mobile 11 preserve their local SMS wording and date behavior.
- Mobile 12 and Mobile 13 do not gain new introductory blocks.
- WhatsApp profiles and quoted-message authors preserve their name-first behavior.
- Calls and WhatsApp Desktop remain untouched.
- Focused tests pass, and TypeScript/lint pass or have a documented environment-only `EPERM` limitation.
- The final diff contains no unrelated product changes.
