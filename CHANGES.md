### [2.0.2](https://github.com/patternslib/pat-tiptap/compare/2.0.1...2.0.2) (2022-01-28)


### Maintenance

* Include the yarn.lock file. (GitHub action complained and it's not the worst idea too). ([74d2d22](https://github.com/patternslib/pat-tiptap/commit/74d2d227bd0067dc8891457a23110f89e72ab18d))

* Upgrade dependencies. ([e82b022](https://github.com/patternslib/pat-tiptap/commit/e82b0225ed74877962fe8e90be183e7a3f8025a9))

* Upgrade to Patternslib 7 and change the import for add_event_listener. ([2fc36da](https://github.com/patternslib/pat-tiptap/commit/2fc36da163db3ca1cebb7381eff3a707a210a180))

* Use caching in GitHub actions. ([25026b6](https://github.com/patternslib/pat-tiptap/commit/25026b686ee12322898ef4737e172132a95c3bb8))

* **webpack:** Simplify webpack static devServer directory config. ([252ca8e](https://github.com/patternslib/pat-tiptap/commit/252ca8eb6b8a7e08c44e495a8a6cc6b13d882ab1))

### [2.0.1](https://github.com/patternslib/pat-tiptap/compare/2.0.0...2.0.1) (2022-01-18)


### Bug Fixes

* Also set/unset the tiptap-focus class when interacting with context menus or image/link/source panels. ([03773b2](https://github.com/patternslib/pat-tiptap/commit/03773b2b2e9973eee2d498f9b96565d24241e941))

## [2.0.0](https://github.com/patternslib/pat-tiptap/compare/1.1.0...2.0.0) (2022-01-17)


### Breaking Changes

* Upgrade to tiptap version 2 (Beta).
* Use plain JavaScript instead of Vue.
* Remove collaboration support. This is up to come in a later version.

### Features

* Allow to create a toolbar based on conventions. See the [Readme](README.md) to see how this is used.
* Allow to create a external link, image and source code overlay. See the [Readme](README.md) to see how this is used.
* Implement a first implementation of a @-mentions and #-tagging functionality. A better implementation will follow.
* Add pat-autofocus and autofocus attribute support.
* Add support for the placeholder atttribute.
* Add a ``tiptap-focus`` class on the toolbar when the editor has focus.

### Maintenance

* Depend on Patternslib version 6.3.2.
* Upgrade tiptap and prosemirror dependencies.
* Switch to Webpack 5.

## [1.1.0](https://github.com/patternslib/pat-tiptap/compare/1.0.0...1.1.0) (2021-06-15)


### Maintenance

* **dependencies:** Depend on Patternslib v4.4.0. ([47a86b8](https://github.com/patternslib/pat-tiptap/commit/47a86b891b9db3d260a8776c6b94cc2b472b73ce))
* **dependencies:** Upgrade dependencies on minor+patch level. ([dcb5715](https://github.com/patternslib/pat-tiptap/commit/dcb5715baea68a69afe906ef3b18c4a16b4d8cfe))
* **make release-patch:** Add missing patch for patch level releases. ([c1e86c4](https://github.com/patternslib/pat-tiptap/commit/c1e86c4ec471595e736c076e22053546521a0eda))
* **Release:** Remove the release-web target. Only Patternslib releases are pushed to Patterns-releases on Github. ([9facb77](https://github.com/patternslib/pat-tiptap/commit/9facb77a93fd436c49abe6c3cacbfa191b70df2f))
* **Release process:** Do not include the release commit in the changelog. ([4b08a72](https://github.com/patternslib/pat-tiptap/commit/4b08a723059bfab1b9f59c6fe094568897277ab4))
* **webpack:** Adapt start script to recent dependency changes. ([5afc465](https://github.com/patternslib/pat-tiptap/commit/5afc4650321ce464e3908c3418ab6de1064be394))
* **webpack:** Simplify webpack and make vue webpack config reuseable. ([21bdefd](https://github.com/patternslib/pat-tiptap/commit/21bdefd9f02fb738476371c3c5f578ea2a9ce066))

## 1.0.0 (2021-04-20)


### Bug Fixes

* **tests:** Install a vue-jest version which is compatible with @babel/core instead babel-core. ([d9d4f2e](https://github.com/patternslib/pat-tiptap/commit/d9d4f2e20c271f158ca5939398691c9562bf6977))


### Maintenance

* Upgrade TipTap. ([f5a4bb6](https://github.com/patternslib/pat-tiptap/commit/f5a4bb635527101919fcb44de35213b7d435bb64))
* Upgrade to Patternslib v4 final - tiptap customizations. ([3cc6a2e](https://github.com/patternslib/pat-tiptap/commit/3cc6a2e17ba52524cb680fbbc678501d9b6c1db0))
* Upgrade to Patternslib v4 final. ([e4e65be](https://github.com/patternslib/pat-tiptap/commit/e4e65beee247453cd83dce92757fdcf395498be6))

# Changelog


## 1.0.0 - unreleased

- Initial release.

