## [2.1.0](https://github.com/patternslib/pat-tiptap/compare/2.0.2...2.1.0) (2022-02-15)


### Features

* **Embed:** Add extension to embed vimeo/youtube/etc media files as iframe. ([6d75426](https://github.com/patternslib/pat-tiptap/commit/6d75426b8bdf3cffc792c2eb1ed4f11fd8287641))

* **Embed:** Support Vimeo and Youtube URLs and fix URLs if necessary. ([47f9ff0](https://github.com/patternslib/pat-tiptap/commit/47f9ff00c916568ababc49bec75ee6f8f29c9474))

* **Images:** Add images within a figure tag with optional figcaption. ([72ac9ac](https://github.com/patternslib/pat-tiptap/commit/72ac9ac5a78d11e34b37833055269a995ae9c69b))

* **Images:** Allow inline images and non-inline (within figure tags) images at the same time. ([8052b23](https://github.com/patternslib/pat-tiptap/commit/8052b239e458a3471b1a0360dc2e9b5dd15bddb5))



### Bug Fixes

* Allow tiptap to be instantiated multiple times. ([f5289ff](https://github.com/patternslib/pat-tiptap/commit/f5289ff097b75f7c762994a2d484deb534e69aab))

* **Images:** Add custom image extension to also allow images with data src. ([29b5043](https://github.com/patternslib/pat-tiptap/commit/29b5043c9492aff57524a0508abe55b3eee1ab02))

* **Images:** Do not allow any drag/drop of images within figure tags as long this doesn't work properly. ([c49f66a](https://github.com/patternslib/pat-tiptap/commit/c49f66a5f264ecd7b8b215341463f094775e3413))



### Maintenance

* **demo:** Adapt to new publicPath setting of Patternslib. ([8042ac0](https://github.com/patternslib/pat-tiptap/commit/8042ac057baef8e21460297f9d4cea8df3c755ad))

* **Demo:** Add example to demo with an top-level, a figure and an inline image. ([ffc3dd2](https://github.com/patternslib/pat-tiptap/commit/ffc3dd26ddbe417525e4664d0897d3aa199c350b))

* **demo:** Use template-tags for UI elements instead of the hidden attribute. ([446ecf1](https://github.com/patternslib/pat-tiptap/commit/446ecf126585f08a7eacec7fb642f99dbf784a30))

* **Dependencies:** Upgrade dependencies. ([29a94ab](https://github.com/patternslib/pat-tiptap/commit/29a94abe2eb46a06552e909efb9b95925ba6a502))

* **Docs:** Rework for some minor typos. ([33ce18c](https://github.com/patternslib/pat-tiptap/commit/33ce18ca0e917cb61ed76fac50e6fbab63e0db03))

* **Extensions:** Provide default exports for Mentions and Tags, so that they can conveniently be imported. ([4a07fb9](https://github.com/patternslib/pat-tiptap/commit/4a07fb98da70e73deeb033d9d1357157dc640086))

* **Tests:** Add link panel test and restructure test names. ([6234dff](https://github.com/patternslib/pat-tiptap/commit/6234dffce628b37f287169012bd7a2fc2f55910d))

* **Tests:** Instantiate Pattern via new to set up everything as expected. ([0a61ecb](https://github.com/patternslib/pat-tiptap/commit/0a61ecb25ac2e15701c081dd4a5c77fdb842631b))

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

