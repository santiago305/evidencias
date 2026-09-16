# Mobile 11 Replica Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an independent `mobile-11` preview that visually matches `mobile-1` across WhatsApp, SMS, calls, and light/dark themes, with backend registration.

**Architecture:** Duplicate the complete mobile-1 design folder and rename its local symbols/imports to Mobile11. Register the new channel previews through the existing mobile preview profile registry, extend the TypeScript and Laravel catalogs, and add a forward registration migration following mobile-10.

**Tech Stack:** Laravel 12, PHP 8.2, Inertia React, TypeScript, Tailwind CSS v4, Pest, Vitest.

---

### Task 1: Create independent mobile-11 design files

**Files:**
- Create: `resources/js/evidence-generator/features/preview/designs/mobile-11/**`
- Test: `resources/js/evidence-generator/features/preview/designs/mobile-11/Mobile11Preview.test.ts`

- [ ] Copy every mobile-1 design file into mobile-11, renaming Mobile1 symbols/files to Mobile11 and replacing local `mobile-1` references with `mobile-11`.
- [ ] Ensure no file inside mobile-11 imports from the mobile-1 directory.
- [ ] Add structural tests covering required channels, local frame/header/footer assets, and import isolation.

### Task 2: Register mobile-11 in frontend

**Files:**
- Modify: `resources/js/evidence-generator/types.ts`
- Modify: `resources/js/evidence-generator/features/preview/designs/mobilePreviewProfiles.tsx`
- Modify: `resources/js/evidence-generator/features/preview/designs/shared/mobile-preview/frameRenderers.tsx`
- Modify: `resources/js/evidence-generator/features/preview/designs/shared/whatsapp/whatsappProfiles.ts`
- Modify: `resources/js/evidence-generator/features/preview/designs/shared/whatsapp/whatsappTypes.ts`
- Modify: `resources/js/evidence-generator/features/preview/designs/shared/sms/smsAppearance.ts`
- Modify: `resources/js/evidence-generator/features/preview/designs/shared/sms/smsTypes.ts`

- [ ] Add mobile-11 to the key unions/profile maps required by TypeScript.
- [ ] Register local Mobile11 WhatsApp, SMS, call, frame, and notification renderers in the registry.
- [ ] Preserve mobile-1 visual values and behavior while using mobile-11-specific symbols and files.

### Task 3: Register mobile-11 in Laravel

**Files:**
- Modify: `app/Support/MobileDesignCatalog.php`
- Create: `database/migrations/2026_09_16_000000_add_mobile_11_to_mobile_designs_table.php`

- [ ] Add the `mobile-11` catalog definition.
- [ ] Add an idempotent migration registration and guarded rollback matching mobile-10.

### Task 4: Test and format

**Files:**
- Modify: tests that assert the complete mobile catalog, only when their expectations require the new key.

- [ ] Run the focused Mobile11 Vitest tests and affected frontend tests.
- [ ] Run focused Laravel catalog/registration/settings tests.
- [ ] Run Pint on dirty PHP files.
- [ ] Run TypeScript compilation and inspect the final diff for mobile-1 imports and whitespace errors.
