install:
	npm prune
	npm install

dist/cms: install
	mkdir -p dist/cms
	cp lib/cms/index.html dist/cms
	./node_modules/.bin/browserify lib/cms/app.js > dist/cms/app.js

test: install
	./node_modules/.bin/mocha --reporter spec

clean:
	rm -r dist

.PHONY: test clean