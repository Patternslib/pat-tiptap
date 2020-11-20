# Prerequisites:
# - make
# - yarn

YARN ?= yarn

stamp-yarn:
	$(YARN) install
	touch stamp-yarn


.PHONY: clean
clean::
	rm -rf stamp-yarn node_modules


.PHONY: bundle
bundle: stamp-yarn
	$(YARN) run build


.PHONY: serve
serve:: stamp-yarn
	printf "\n\nGo to http://localhost:8000 to see the demo\n\n\n\n"
	$(YARN) run start


#
