# PujaPath Production Deployment Checklist

## 1. Environment & Configuration
- [ ] **Database Connection**: Set `DATABASE_URL` with SSL mode (`sslmode=require`) pointing to the production PostgreSQL cluster.
- [ ] **Secrets Management**: Replace all development default values for `SECRET_KEY`, `JWT_SECRET`, and `ADMIN_CREDENTIALS`.
- [ ] **CORS Configuration**: Restrict `allow_origins` in `app/main.py` strictly to production frontend domains (disallow wildcard `*`).
- [ ] **Frontend Env**: Ensure `VITE_API_BASE_URL` points to the production HTTPS domain.

## 2. Database Migrations & Data Guardrails
- [ ] Run `python -m alembic upgrade head` to guarantee schema parity with migration `6d16ff3014d3`.
- [ ] Verify 8 canonical emergency contacts are loaded and marked `verified = True`.
- [ ] Maintain demo records (IDs 5, 6, 7) with `verified = False` so frontend badges render as "Demo / Unverified".
- [ ] Ensure canonical image gallery links adhere to HTTPS and valid Content-Type headers.

## 3. Server & Runtime (Backend)
- [ ] Run Uvicorn behind a production reverse proxy (Nginx or Caddy) with Gunicorn worker manager:
  `gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000`
- [ ] Enable TLS/SSL certificates (Let's Encrypt / Certbot).
- [ ] Configure rate limiting on public submission and AI chat endpoints to prevent abuse.
- [ ] Setup logging output to standard out / journalctl with structured JSON or log rotation.

## 4. Frontend Optimization & Delivery
- [ ] Build static assets using `npm.cmd run build` inside `frontend/`.
- [ ] Serve `dist/` directory via Nginx, Cloudflare Pages, or CDN with HTTP/2 and gzip/brotli enabled.
- [ ] Cache static assets (`/assets/*.js`, `/assets/*.css`, images) with immutable headers (`Cache-Control: public, max-age=31536000, immutable`).
- [ ] Ensure `index.html` has `Cache-Control: no-cache` to facilitate instant updates.

## 5. Security & Accessibility Audits
- [ ] Confirm no backend `.env` or sensitive credentials are committed to version control.
- [ ] Verify SOS button and emergency links operate with `tel:` URI schemes requiring direct user confirmation.
- [ ] Check responsive layout on mobile viewports (360px, 390px, 414px) and verify desktop navigation drawer fallback.
- [ ] Audit multilingual toggles (EN, BN, HI) to confirm headers and fallback badges load without missing keys.
