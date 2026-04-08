SHELL := /bin/zsh
BACKEND_OPENAPI := /Users/devyanshsehgal/Downloads/RAR_F1 _07_04_26/openapi/openapi.json
UI_OPENAPI := openapi/openapi.json

.PHONY: api-refresh

api-refresh:
	test -f "$(BACKEND_OPENAPI)" || (echo "Backend OpenAPI file not found: $(BACKEND_OPENAPI)" && exit 1)
	rm -rf src/lib/api/generated
	mkdir -p openapi
	cp "$(BACKEND_OPENAPI)" "$(UI_OPENAPI)"
	@echo "Synced $(UI_OPENAPI)"
	npx orval --config orval.config.ts
