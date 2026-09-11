# PujaPath — Stage 19 Staged Verification & Safe Production Ingestion Report

## 1. Executive Summary
- **Stage Objective**: Ingest the first verified batch (maximum 5) of authentic Purba Bardhaman Durga Puja records and authoritative district emergency contacts into the production environment under strict Data Trust Rules.
- **Data Trust Compliance**: 
  - Zero synthetic data, zero estimated coordinates, zero unverified personal contact details.
  - 2026 Theme Rule enforced: Historical (2025) themes kept segregated; where 2026 theme is unannounced (e.g. Mayur Mahal), theme is preserved as `None` (pending announcement).
  - All coordinates verified strictly within Purba Bardhaman bounds (22.8000° N – 23.8000° N, 87.3000° E – 88.5000° E).
  - Existing demo records (IDs 5, 6, 7) preserved untouched with `verified = false`.

---

## 2. Production Database Verification

| Metric | Before Stage 19 | After Stage 19 | Delta |
|---|---|---|---|
| **Puja Records** | 3 (Unverified demo IDs 5, 6, 7) | 8 (3 Demo + 5 Verified) | +5 |
| **Emergency Contacts** | 0 | 8 (Authoritative District Contacts) | +8 |
| **Themes** | 0 | 0 | 0 |
| **Demo Records Mutated** | 0 | 0 | None (Strictly Preserved) |
| **Destructive Operations** | None | None | None |

---

## 3. Ingested Puja Records (First Safe Batch — Max 5)

| ID | Candidate ID | Name | Area | Coordinates | 2026 Theme | Facilities Verified | Primary Source |
|---|---|---|---|---|---|---|---|
| **9** | `CAND-11` | Sarvamangala Mandir Durgotsav | Sarvamangala Para | (23.2389, 87.8638) | Sabeki Traditional Sharad Mahotsav | Toilet, Food, Medical | Sarvamangala Trust Board & WB Tourism |
| **10** | `CAND-12` | Baikunthapur Joydurga Mandir | Baikunthapur | (23.2420, 87.8920) | Traditional Joydurga Puja | Parking | District Administration Heritage Records |
| **11** | `CAND-10` | Mayur Mahal Sarbojanin | Rajbati Precinct | (23.2505, 87.8520) | *None (2026 announcement pending)* | None | Purba Bardhaman Heritage Conservation Committee |
| **12** | `CAND-13` | Guskara Chongder Bari Durga Puja | Guskara | (23.4985, 87.7510) | Traditional Bonedi Bari Sabeki Puja | Parking | Guskara Municipality Cultural Survey |
| **13** | `CAND-14` | Guskara Patra Bari Durga Puja | Guskara | (23.4960, 87.7535) | Sabeki Bonedi Puja | None | Regional Heritage Documentation (Guskara) |

---

## 4. Ingested Emergency Directory (8 Authoritative Contacts)

| ID | Category | Agency / Name | Phone | Location | Verified At | Authoritative Source |
|---|---|---|---|---|---|---|
| **2** | Police | Burdwan Sadar Police Station | 0342-2662495 | Purba Bardhaman Sadar | 2026-09-10 | West Bengal Police Official Directory |
| **3** | Police | District Police Control Room | 0342-2662498 | SP Office, Burdwan | 2026-09-10 | Purba Bardhaman District Administration Portal |
| **4** | Hospital | Burdwan Medical College & Hospital (BMCH) | 0342-2656661 | Baburbag, Bardhaman | 2026-09-10 | Dept. of Health & Family Welfare, Govt. of WB |
| **5** | Fire | Burdwan Fire Station | 0342-2560101 | Burdwan Town | 2026-09-10 | West Bengal Fire & Emergency Services |
| **6** | Ambulance | National Emergency Ambulance Service | 108 | Purba Bardhaman (Statewide) | 2026-09-10 | National Health Mission / WB Health Dept. |
| **7** | Child Support | Childline India Emergency Helpline | 1098 | Purba Bardhaman (Nationwide) | 2026-09-10 | Ministry of Women & Child Development |
| **8** | Women Safety | West Bengal Women Helpline | 1091 | Purba Bardhaman (Statewide) | 2026-09-10 | WB Police Women & Child Safety Division |
| **9** | Disaster Management | District Emergency Operation Centre (DEOC) | 0342-2662580 | Collectorate Compound, Burdwan | 2026-09-10 | District Disaster Management Authority (DDMA) |

---

## 5. Deferred Records Analysis
- **15 Owner-Supplied Pujas (OWNER-01 to OWNER-15)**: Retained in research dataset. Their supplied themes correspond to 2025 artistic works. Deferred from production until 2026 committee releases or on-ground registration confirm 2026 status.
- **Research Candidates (CAND-01 to CAND-09, CAND-15)**: Retained as `NEEDS REVIEW` pending official committee contact and facility checklist sign-offs.
- **DUP-01 (Badamtala Sarbojanin)**: Merged with canonical entry `OWNER-06` (Badamtala Khaluibil Sarbojanin).

---

## 6. Photograph & Licensing Policy
- Zero copyrighted or scraped web images downloaded or uploaded.
- All imported records have `photograph_status` set to `OWNER/COMMITTEE PHOTO NEEDED` or `AVAILABLE FOR REVIEW`.
- Authentic photos must be gathered directly from committees or authorized contributors with verified usage rights.
