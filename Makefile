dist/cms:
	mkdir -p dist/cms
	cp cms/index.html dist/cms
	npm run cms.js

clean:
	rm -r dist

test:
	./node_modules/.bin/mocha --reporter spec

.PHONY: test clean