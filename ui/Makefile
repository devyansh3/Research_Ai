SHELL := /bin/zsh
BACKEND_OPENAPI := ../backend/openapi/openapi.json
UI_OPENAPI := openapi/openapi.json

.PHONY: api-refresh

api-refresh:
	test -f "$(BACKEND_OPENAPI)" || (echo "Backend OpenAPI file not found: $(BACKEND_OPENAPI)" && exit 1)
	rm -rf src/lib/api/generated
	mkdir -p openapi
	cp "$(BACKEND_OPENAPI)" "$(UI_OPENAPI)"
	@echo "Synced $(UI_OPENAPI)"
	npx orval --config orval.config.ts
