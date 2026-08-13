.PHONY: dev backend frontend seed test lint

dev:
	docker compose up --build

backend:
	cd backend && uvicorn app.main:app --reload

frontend:
	cd frontend && npm run dev

seed:
	cd backend && python -m app.seed

test:
	cd backend && python -m pytest tests/ -v

lint:
	cd backend && ruff check app/
	cd frontend && npm run lint && npm run typecheck
