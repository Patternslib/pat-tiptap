

### [3.4.1](https://github.com/patternslib/pat-tiptap/compare/3.4.0...3.4.1) (2022-04-24)


### Bug Fixes


* **Suggestion:** Do not break when trying to set a item active, but no results are available. ([d222ebd](https://github.com/patternslib/pat-tiptap/commit/d222ebd2d9bb87becdccf2c4c17a180115d20615))


* **Suggestion:** Get whole suggestion text also when copying. ([bdd12ac](https://github.com/patternslib/pat-tiptap/commit/bdd12acc81a835161a3ca74fdc0e6bebf9e0a8d9))
Always get the text starting from the suggestion character to the end.
Previously when copying a suggestion text into the text area, the text wasn't recognized and not used to filter down the items.

## [3.4.0](https://github.com/patternslib/pat-tiptap/compare/3.3.0...3.4.0) (2022-04-21)


### Features


* **Suggestion:** Allow accessibility attributes on the suggestion link. ([2907d97](https://github.com/patternslib/pat-tiptap/commit/2907d97826b676c84ef7e8d5302c2f6fdd7b7ae4))



### Bug Fixes


* **Suggestion:** Use data-title to for the link's text. This frees up data-id which we need to add the suggestion id which can then be used by the backend to identify the term. ([6cd6669](https://github.com/patternslib/pat-tiptap/commit/6cd66690c33a5185463d61a5718f2b195c2adb9d))



### Maintenance


* Upgrade dependencies. ([a673507](https://github.com/patternslib/pat-tiptap/commit/a6735070afd636a053ed56feac26cf6a75a9d79a))

## [3.3.0](https://github.com/patternslib/pat-tiptap/compare/3.2.1...3.3.0) (2022-04-19)


### Features


* **Suggestions:** Allow data-NAME as attribute on the mention-link. ([e13397e](https://github.com/patternslib/pat-tiptap/commit/e13397e496e907cef457d4a1bf282eaeded1402c))



### Bug Fixes


* **Suggestions:** Use the closest <a> element as the one where attributes are copied from. e.target is not necessarily the anchor itself but can be any element within the anchor. ([eadde22](https://github.com/patternslib/pat-tiptap/commit/eadde22dbba7b59b63a3dd2e85d6fec4b8cc030a))



### Maintenance


* **Suggestions:** Enable the data-attribute copying test. It works in the meantime. ([7735af1](https://github.com/patternslib/pat-tiptap/commit/7735af17df7d9c1bf82aadd1be0928439b6c1f29))


* **Suggestions:** Test to not copy disallowed attributes. ([62c4df6](https://github.com/patternslib/pat-tiptap/commit/62c4df6445c900cf3a17feeef030f134b1434885))

### [3.2.1](https://github.com/patternslib/pat-tiptap/compare/3.2.0...3.2.1) (2022-04-15)


### Maintenance


* Ugrade to Patternslib 7.8.0 with a fix to re-init patterns in a tooltip after content was reloaded. ([8d2469f](https://github.com/patternslib/pat-tiptap/commit/8d2469f5cf77bc39cc4e5700ab3cb82dce47cffa))


* Upgrade dependencies. ([e0942d5](https://github.com/patternslib/pat-tiptap/commit/e0942d52a596781438df17351ced5ddf63e5474c))

## [3.2.0](https://github.com/patternslib/pat-tiptap/compare/3.1.1...3.2.0) (2022-04-12)


### Features


* Scan content on update for patterns and initialize. ([420d6f5](https://github.com/patternslib/pat-tiptap/commit/420d6f533435c64e0fbff1467e184429465be368))


* Transform pasted links to anchor elements. ([b537356](https://github.com/patternslib/pat-tiptap/commit/b537356ddecdcaeb2de8743a9d6db141a976fa05))



### Bug Fixes


* Don't add a line-break when selecting a suggestion from the context-menu. ([7b8738a](https://github.com/patternslib/pat-tiptap/commit/7b8738af0e5d9f1d2fbd4006aec8afbeca02f17c))



### Maintenance


* Update documentation with ``disable-patterns`` note for the suggestion menu and extend mentions/tags demo with patterns which are initialized when inserted into the content. ([f9d31bf](https://github.com/patternslib/pat-tiptap/commit/f9d31bf59a86ad188e718206ab922cea185679ba))


* Upgrade dependencies. ([472ac86](https://github.com/patternslib/pat-tiptap/commit/472ac8652f6a30b2e78188eaed422db6dbb6914f))


* Upgrade to Patternslib 7.7.0 with disable-patterns feature. ([2103d1b](https://github.com/patternslib/pat-tiptap/commit/2103d1bbd2abb4ee231585021e629cc5e7facc8c))



### [3.1.1](https://github.com/patternslib/pat-tiptap/compare/3.1.0...3.1.1) (2022-04-08)


### Bug Fixes

* After text changes dispatch the input event. ([2babe56](https://github.com/patternslib/pat-tiptap/commit/2babe564172b5d1f74f56cb340df273b17a2a736))


### Maintenance

* Cleanup and remove two unused patterns from the demo bundle. ([65bfc98](https://github.com/patternslib/pat-tiptap/commit/65bfc9887fe5738c35094f43a4d3b5ecb33df045))

* Upgrade dependencies. ([cf850da](https://github.com/patternslib/pat-tiptap/commit/cf850da4f3e381cb8a32356a8715bf9317f23d50))


## [3.1.0](https://github.com/patternslib/pat-tiptap/compare/3.0.0...3.1.0) (2022-04-07)


### Bug Fixes

* After setting the text in an textarea, dispatch the change event. ([99c9647](https://github.com/patternslib/pat-tiptap/commit/99c9647af32056cc325983529b44cc39e3ba1403))

* Allow data-tiptap-value not be the direct parent of the click target. ([3b0bb40](https://github.com/patternslib/pat-tiptap/commit/3b0bb400aaa16fcca46be095af8b70a1b4f0c16e))

* Dont break with suggestion not following markup conventions. ([d3d18cb](https://github.com/patternslib/pat-tiptap/commit/d3d18cbf2b308bb80be9a020aa86789d27a3dd3a))


### Breaking Changes

* Rename tiptap-suggestion class to tiptap-items to better follow code/naming style conventions. ([9bfa537](https://github.com/patternslib/pat-tiptap/commit/9bfa537819ca7899f6b8abf6ade2f33280c444b1))


## [3.0.0](https://github.com/patternslib/pat-tiptap/compare/2.1.0...3.0.0) (2022-04-05)


### Features

* Add extra classes tiptap-mentions and tiptap-tags to context menu wrapper. ([8318531](https://github.com/patternslib/pat-tiptap/commit/83185313cf34b53b5de12bc62aa42ae0486e7003))

* Allow ``<br>`` line breaks. Use ``<mod><enter>`` or ``<shift><enter>`` on your keyboard. ([0e96118](https://github.com/patternslib/pat-tiptap/commit/0e9611816b2c1b6aa3c94a939abbf498c6987c53))

* Rework suggestion support. ([673be2d](https://github.com/patternslib/pat-tiptap/commit/673be2d1fe1b3967bf115a8fdecb03e292b971c8))
- Remove mentioning and tagging modules and combine the functionality in a new suggestion extension.

- Implement filtering functionality where the text after the suggestion trigger character can be used to filter the results on the server side.

- Implement suggestion item navigation via arrow keys, suggestion selection via enter key, selecting via mouse and closing via escape key.

- Allow to configure the suggestion extension. This is used for ``@`` mentions and ``#`` tagging.


### Bug Fixes

* Do not close each others context menu from suggestion or links by passing the extension's own context menu instance. ([b98bfeb](https://github.com/patternslib/pat-tiptap/commit/b98bfeb99cb7284016372a96fa04fd29f81dd729))

* Do not close/open the context menu when reloading it's contents unless force_reload is given. ([c808b76](https://github.com/patternslib/pat-tiptap/commit/c808b7619b199c59369e81ac5d68e757a67d3138))

* Keep context menu on the left side. ([59c65df](https://github.com/patternslib/pat-tiptap/commit/59c65dfafbdfccd869c71d4b19999b2cc6c89775))

* Position the context menu only when first opened and not while writing. ([4453eb6](https://github.com/patternslib/pat-tiptap/commit/4453eb672f769831de6c56e3f83bfd412edf0459))


### Breaking Changes

* Remove mentions-search-key and tags-search-key parameters. ([776f88f](https://github.com/patternslib/pat-tiptap/commit/776f88f67eea4d3068d04d9821cbeafe1c10f8e2))
The filter term is just appended at the end of the URL, so you can configure any search query string you want.
* Rename context-menu-link to link-menu, context-menu-mentions to mentions-menu and context-menu-tags to tags menu for easier names. ([2d0c0f3](https://github.com/patternslib/pat-tiptap/commit/2d0c0f379fca581df3d4a1d67df709857dcdbf58))


### Maintenance

* **Cleanup:** Align figcaption extension to factory pattern. ([62de8b7](https://github.com/patternslib/pat-tiptap/commit/62de8b75db37078ed0e5ccc0cc3303e94a522614))

* **Cleanup:** Align figure extension to factory pattern. ([159efe4](https://github.com/patternslib/pat-tiptap/commit/159efe46b089fbc0e07c4b770d9fe55a697163d9))

* **Cleanup:** Align heading extension to factory pattern. ([3a3cbdb](https://github.com/patternslib/pat-tiptap/commit/3a3cbdb61500556b9e50fc3f0b65759d73da945f))

* **Cleanup:** Align image-inline extension to factory pattern. ([23b9830](https://github.com/patternslib/pat-tiptap/commit/23b98307969ff545f2c306b73ee91893ca0294f0))

* **Cleanup:** Align suggestion factory naming to other extensions. ([c0ca99e](https://github.com/patternslib/pat-tiptap/commit/c0ca99e394134cf6d00c995373885deb86492f43))

* **Cleanup:** Factor out embed panel initialization into embed extension module. ([8f79d08](https://github.com/patternslib/pat-tiptap/commit/8f79d085964e27330c273bd75fbdb564579f65a0))

* **Cleanup:** Factor out image panel initialization into image-figure extension module. ([30f2ece](https://github.com/patternslib/pat-tiptap/commit/30f2ecec78ab74e48697201a013dee2375ec0313))

* **Cleanup:** Factor out link extension and panel initialization to seperate module. ([71ca4e2](https://github.com/patternslib/pat-tiptap/commit/71ca4e2092fa36c10e9f837a097d2de7dcd0ce78))

* **Cleanup:** Factor out source panel into own extension module. ([d5c65df](https://github.com/patternslib/pat-tiptap/commit/d5c65dffde41fbe0df40b833d43f2303d7cf214d))

* **Cleanup:** Factor out toolbar initialization into own module. ([86fa69c](https://github.com/patternslib/pat-tiptap/commit/86fa69c12f535a789c0922eba218725c510d6d18))

* **Cleanup:** Factor-out focus class handler which is responsible to set a focus class on specified elements like the toolbar when another element is active. ([a2eedfa](https://github.com/patternslib/pat-tiptap/commit/a2eedfabba1a713c3592232369bdd61bddad90bb))

* **Cleanup:** Remove now unused import events from main module. ([4e3d096](https://github.com/patternslib/pat-tiptap/commit/4e3d0968d96c6a9d787e7f54d04f5a861a47ae97))

* **Cleanup:** Remove unused extension placeholder-top-bottom. ([582f462](https://github.com/patternslib/pat-tiptap/commit/582f46293b6642170e169d823b35299655ee8959))

* **Demo:** Add demo page for many tiptap instances. ([4e1b82d](https://github.com/patternslib/pat-tiptap/commit/4e1b82d23119b3de5df2808875c2fefdf64aafff))

* **Demo:** Use better names for mentions and tags in the demo. ([afc9448](https://github.com/patternslib/pat-tiptap/commit/afc944830b540e02f00a89360777ea7ccf814c14))

* **Demo:** Use extra unicode characters for suggestion names, contrasting better the difference between names and ``data-tiptap-value``. ([66a8fe6](https://github.com/patternslib/pat-tiptap/commit/66a8fe61997e3a8d855571995eaf010b662a84f8))

* Depend on Patternslib 7.3.0. ([7f89d19](https://github.com/patternslib/pat-tiptap/commit/7f89d199404032e4704541e5ac43e56ba617e43d))

* **Dependencies:** Upgrade dependencies. ([9644f7b](https://github.com/patternslib/pat-tiptap/commit/9644f7b562447b57af034726bd8be6827e925feb))

* **Dependencies:** Upgrade to Patternslib 7.2.0. ([603aa87](https://github.com/patternslib/pat-tiptap/commit/603aa87076bbbccd501bc250018c8452feac5e77))

* Export logger from tiptap to be used in extensions and other modules. JS can handle circular imports, so no worries. ([2e2025a](https://github.com/patternslib/pat-tiptap/commit/2e2025a2860c66041d03d5b62b4493b6020008b9))

* Move documentation to src/documentation.md for consistency. ([ec4a97b](https://github.com/patternslib/pat-tiptap/commit/ec4a97b8dec8fc34700830bfbb911cc54295131b))

* Remove resolution dependencies. Should not be needed anymore. ([4d374b7](https://github.com/patternslib/pat-tiptap/commit/4d374b702529cae69ac8a4dcb8e5a06244d5299d))

* Upgrade dependencies ([6460330](https://github.com/patternslib/pat-tiptap/commit/646033004da36704e51a588ff73f9427b17758ae))

* Upgrade dependencies. ([a8035b4](https://github.com/patternslib/pat-tiptap/commit/a8035b4eff428064f00f7de05424f68d2d07a50f))

* Upgrade to Patternslib 7.5.0 which with pat-tooltip get_content API method which allows for reloading content without closing/opening the tooltip. ([6ab7435](https://github.com/patternslib/pat-tiptap/commit/6ab743514e257db08686300fa019792241a9c886))



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