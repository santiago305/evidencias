# Task 1 Implementation Report

## Scope

Implemented replay lookup in the evidence backend with changes limited to:

- `app/Services/Evidence/EvidenceGeneratorService.php`
- `app/Http/Controllers/EvidenceController.php`
- `routes/web.php`
- `tests/Feature/EvidenceGenerationTest.php`

Unrelated frontend and typography test changes already present in the worktree were not modified or reverted.

## Requirements Implemented

### 1. Replay resolver in `EvidenceGeneratorService`

Added:

```php
private function resolveReplayEvidence(User $user, string $seedCode): ?GeneratedEvidence
```

Behavior:

- Looks up `generated_evidences` by authenticated `user_id` and `seed_code`
- Returns the stored row for replay use
- Replay generation now uses the stored `input_data` as the render payload base instead of the live request payload
- Existing decoded `conversation_id`, `cycle`, and `preview_seed` logic remains intact

If the seed decodes correctly but no stored evidence row exists for that user/seed combination, the service now raises a validation error for `seedCode`.

### 2. Stop minting a new seed on replay

Updated `generate()` so:

- Replay mode is detected with `seedCode !== ''`
- Replay returns the incoming seed unchanged
- `storeEvidenceWithUniqueSeed()` runs only for fresh generations
- Replay no longer creates a second `generated_evidences` row for the same seed

Result:

- Replay preserves the original sal
- Replay renders from persisted input data
- Fresh generation behavior remains unchanged

### 3. Read path in `EvidenceController`

Added:

```php
public function showBySeed(Request $request, string $seedCode): JsonResponse
```

Behavior:

- Uses the authenticated user from the same auth flow as generate
- Queries only that user’s `generated_evidences`
- Returns:
  - `seedCode`
  - `conversationId`
  - `generatedAt`
  - `inputData`
- Returns `404` when the seed exists for another user or does not exist

### 4. New read route

Added auth-protected named route in `routes/web.php`:

```php
Route::get('/api/evidences/{seedCode}', [EvidenceController::class, 'showBySeed'])
    ->name('evidences.show-by-seed');
```

## Test Changes

Updated replay coverage in `tests/Feature/EvidenceGenerationTest.php`:

- Changed replay expectation from “returns a new unique seed” to “reuses the original seed”
- Added assertion that replay returns the same rendered messages even if a different live payload is posted
- Added assertion that replay does not insert another `generated_evidences` row

Added lookup endpoint coverage:

- Owner can fetch stored evidence payload by seed
- Different authenticated user receives `404` for another user’s seed

## Verification

Executed:

```bash
vendor/bin/pint --dirty --format agent
php artisan test --compact tests/Feature/EvidenceGenerationTest.php tests/Feature/EvidenceGenerationSnapshotTest.php
```

Result:

- Pint passed
- Evidence feature suite passed: `51` tests, `275` assertions

## Self-Review Notes

- Replay path now ignores live form payload and uses persisted `input_data`, matching the task brief.
- Replay no longer writes duplicate rows or mints a replacement seed.
- The new lookup endpoint is user-scoped and does not expose another user’s stored evidence.
- Change stayed within the requested backend scope plus necessary tests.

## Concerns

No blocking concerns.
