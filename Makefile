.PHONY: build

help:
	@echo "Usage: make <command>"
	@echo "  serve  Runs a development webserver at http://localhost:1313"
	@echo "  build   Build the site with minification"

serve:
	hugo serve --disableFastRender 

build:
	rm -rf public
	hugo --minify
