.PHONY: install start format clean

install:
	npm install

start:
	npm run start

format:
	npm run format

clean:
	rm -rf node_modules
