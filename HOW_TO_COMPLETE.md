# Completion Notes

This repo has moved past the original scaffold state. The core full-stack
assignment flow is implemented and verified:

- browse/search/filter seeded stays
- open listing details and gallery
- reserve a stay with overlap validation
- view and cancel trips
- save listings to a wishlist
- create, edit, and delete host listings
- run backend tests, frontend lint/typecheck/build, and CI

The remaining work is polish rather than core functionality:

- Replace remaining raw `<img>` tags with Next `<Image />` where useful.
- Stabilize a few client `useEffect` dependencies to remove lint warnings.
- Add dark mode if desired.
- Add deployment links after deploying the frontend/backend.

Run these before submission:

```bash
make seed
make test
make lint
cd frontend && npm run build
```
