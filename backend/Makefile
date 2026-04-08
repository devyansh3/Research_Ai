SHELL := /bin/zsh
VENV_DIR := .venv
PYTHON := $(VENV_DIR)/bin/python

.PHONY: openapi

openapi:
	test -d $(VENV_DIR) || python3 -m venv $(VENV_DIR)
	$(PYTHON) scripts/export_openapi.py
