default: readability-eml-epub.zip
	
readability-eml-epub.zip: index.mts package.json
	yarn run tsc
	cp bin/* dist/
	yarn install --prod --modules-folder dist/node_modules
	rm -f readability-eml-epub.zip
	cd dist && zip -r -q ../readability-eml-epub.zip *

