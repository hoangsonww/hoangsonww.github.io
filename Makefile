.PHONY: install start format clean

install:
	npm install

start:
	npm run start

format:
	npm run format

clean:
	rm -rf node_modules

.PHONY: lint help

lint:
	npx prettier --check .

help:
	@grep -E "^[a-zA-Z_-]+:" Makefile | cut -d: -f1

.PHONY: format-check serve

format-check:
	npx prettier --check .

serve: start
