dist/cms:
	mkdir -p dist/cms
	cp lib/cms/index.html dist/cms
	npm run cms/app.js

clean:
	rm -r dist

test:
	./node_modules/.bin/mocha --reporter spec

.PHONY: test clean