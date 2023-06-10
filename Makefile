install:
	npm ci
lint:
	npx eslint .
build:
	npm run build
start:
	npx webpack serve