SHELL := /bin/zsh

.PHONY: backend-openapi ui-api-refresh dev-ui dev-backend

backend-openapi:
	cd backend && make openapi

ui-api-refresh:
	cd ui && npm run api:refresh

dev-ui:
	cd ui && npm run dev

dev-backend:
	cd backend && .venv/bin/uvicorn api:app --reload --host 0.0.0.0 --port 8000
