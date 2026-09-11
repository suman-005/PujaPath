# Stage 20: Verified 2026 Theme, Crowd & Photograph Submission Protocol

## 1. Overview & Trust Architecture
PujaPath implements strict factual verification protocols for all 2026 Durga Puja information. Public canonical data (`pujas`, `images`) cannot be modified directly by unverified user submissions or crowdsourced speculation.

All factual submissions pass through the **Verification Submission Protocol**:
1. **Provenance Enforcement**: Submissions require explicit attribution (`source`, `source_url`, `license_or_permission`).
2. **Gated Lifecycle**: Submissions are created in `PENDING` state and stored in `puja_verification_submissions`.
3. **Admin Queue**: Admin authorization (`role == "admin"`) is required to inspect, verify, approve, or reject submissions.
4. **Atomic Canonical Updates**: Approvals update the canonical `Puja` record or create `Image` entries within a single transactional boundary.
5. **Pending Fallback UI**: When 2026 themes are not yet corroborated, client views explicitly display `2026 Theme: Announcement Pending` rather than placeholder or speculative data.

## 2. Database Schema
Migration: `6d16ff3014d3_add_puja_verification_submissions_table`
Table: `puja_verification_submissions`

- `id`: Integer primary key
- `puja_id`: Foreign key to `pujas.id` (CASCADE)
- `submission_type`: `THEME`, `PUJA_INFO`, `CROWD_INFO`, `PHOTOGRAPH`
- `status`: `PENDING`, `VERIFIED`, `REJECTED`, `NEEDS_MORE_EVIDENCE`
- `theme`, `theme_year`: Verified theme metadata
- `description`: Textual update details
- `source`, `source_url`: Mandatory audit provenance
- `image_url`, `caption`, `license_or_permission`: Photograph licensing data
- `crowd_guidance`: Crowd assessment guidance
- `submitted_by_id`: Submitter user ID
- `verification_notes`: Admin review commentary
- `reviewed_by_id`, `reviewed_at`: Audit timestamp and reviewer ID
- `created_at`, `updated_at`: Timestamp tracking

## 3. API Endpoints
- `POST /api/v1/submissions`: Authenticated creation of pending submissions.
- `GET /api/v1/submissions`: Admin queue listing with filter by status (`PENDING`, `VERIFIED`, etc.) and type.
- `GET /api/v1/submissions/{id}`: Admin detail inspection.
- `POST /api/v1/submissions/{id}/approve`: Admin review & atomic canonical propagation.
- `POST /api/v1/submissions/{id}/reject`: Admin rejection with mandatory verification notes.

## 4. Multilingual & Frontend Parity
- All three supported languages (`en`, `bn`, `hi`) contain matching keys for:
  - `puja.themePending2026`
  - `puja.verifiedThemeBadge`
  - `puja.unverifiedWarning`
  - `puja.submitUpdateBtn`
  - `submissions.*` (queue statuses and review actions)
