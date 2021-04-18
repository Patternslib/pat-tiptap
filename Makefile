ESLINT ?= npx eslint
YARN   ?= npx yarn


define get_package_var
$(shell node -p "require('./package.json').$(1)")
endef
PACKAGE_NAME := $(shell node -p "'$(call get_package_var,name)'.replace('@patternslib/', '')")
PACKAGE_VERSION := $(call get_package_var,version)


stamp-yarn:
	$(YARN) install
	# Install pre commit hook
	$(YARN) husky install
	touch stamp-yarn


clean-dist:
	rm -Rf dist/


.PHONY: clean
clean: clean-dist
	rm -f stamp-yarn
	rm -Rf node_modules/


eslint: stamp-yarn
	$(ESLINT) ./src


.PHONY: check
check:: stamp-yarn eslint
	$(YARN) run test


.PHONY: bundle
bundle: stamp-yarn
	$(YARN) run build


release-web: clean-dist bundle
	@echo name is $(PACKAGE_NAME)
	@echo version is $(PACKAGE_VERSION)
	tar -czf ./$(PACKAGE_NAME)-$(PACKAGE_VERSION).tar.gz dist --transform s/dist/$(PACKAGE_NAME)-$(PACKAGE_VERSION)/
	git clone -n git@github.com:Patternslib/Patterns-releases.git --depth 1 ./dist/Patterns-releases
	mkdir ./dist/Patterns-releases/releases
	mv ./$(PACKAGE_NAME)-$(PACKAGE_VERSION).tar.gz ./dist/Patterns-releases/releases/
	cd ./dist/Patterns-releases && \
		git reset HEAD && \
		git add ./releases/$(PACKAGE_NAME)-$(PACKAGE_VERSION).tar.gz && \
		git commit -m"Add release $(PACKAGE_NAME)-$(PACKAGE_VERSION).tar.gz" && \
		git push


.PHONY: release-major
release-major: check
	npx release-it major --dry-run --ci && \
		npx release-it major --ci  && \
		make release-web


.PHONY: release-minor
release-minor: check
	npx release-it minor --dry-run --ci && \
		npx release-it minor --ci  && \
		make release-web


.PHONY: release-patch
release-patch: check
	npx release-it --dry-run --ci && \
		npx release-it --ci  && \
		make release-web


.PHONY: serve
serve:: stamp-yarn
	$(YARN) run start


#
