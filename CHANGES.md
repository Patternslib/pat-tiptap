# Changelog



## [4.9.1](https://github.com/patternslib/pat-tiptap/compare/4.9.0...4.9.1) (2024-07-23)


### Bug Fixes


* Update getAttrs function to correctly check for the presence of a table inside a div.scroll-table wrapper ([8843e28](https://github.com/patternslib/pat-tiptap/commit/8843e28ad996a021e52fc42877a512e486672d29))


* Upgrade node version for GitHub Actions. ([952b4fb](https://github.com/patternslib/pat-tiptap/commit/952b4fb9b45ea6dc1f8fe58e888d0ef1d5fe9933))

## [4.9.0](https://github.com/patternslib/pat-tiptap/compare/4.8.6...4.9.0) (2023-11-23)


### Features


* Always wrap tables in a div.scroll-table wrapper. ([16e1cc5](https://github.com/patternslib/pat-tiptap/commit/16e1cc5899f2d0783aace74dc61bda195b474c73))



### Bug Fixes


* Allow to select the figcaption node. ([aa71dfc](https://github.com/patternslib/pat-tiptap/commit/aa71dfc6cac2a10757791671eb55f5fb2140e049))


* Allow to select-all in tables. ([606a4be](https://github.com/patternslib/pat-tiptap/commit/606a4be319e4dbb7c8eb16d5939919dad4820dc1))

  Allow to select all (Ctrl-A, Command-A) with tables in certain
conditions.
Due to a tiptap/ProseMirror bug tables with some empty cells and no
content preceding or following the table, selecting the whole table did
not work. This fix makes sure that a non-empty paragraph is added at the
end, if no other content is present at the end of the document.

Follow-up from:
- https://github.com/Patternslib/pat-tiptap/pull/61

More information here:
- https://github.com/ueberdosis/tiptap/issues/2401
- https://github.com/ueberdosis/tiptap/issues/3651


* Make fixed-paragraph selectable to make the corresponding table selectable. ([2c69109](https://github.com/patternslib/pat-tiptap/commit/2c691090277ca0d4834a012a8b718ce9e0d85347))

## [4.8.6](https://github.com/patternslib/pat-tiptap/compare/4.8.5...4.8.6) (2023-10-16)


### Bug Fixes


* Fix problem with table not selectable with <ctrl>-<a> ([4284664](https://github.com/patternslib/pat-tiptap/commit/42846644dc06ffe820efa796ad395e093a73a5bc))

  There is a strange problem with tables and selecting all content with
<ctrl>-<a>. When the last node in the document is a table and the last
table cell is empty, then pressing <CTRL>-<a> to select everyting only
selects the very first node in the document. As soon as one of the
conditions - table not the last node or last table cell not empty - is
not met, <CTRL>-<a> selects all, as expected.

We fix the problem by making sure some content is following the table
and add an empty paragraph. When another solution is found we can remove
this hack again.

More information here:
- https://github.com/ueberdosis/tiptap/issues/2401
- https://github.com/ueberdosis/tiptap/issues/3651



### Maintenance


* Disable horizontal table cell resizing. ([81214c6](https://github.com/patternslib/pat-tiptap/commit/81214c6a7f12dea6dc3a4ec91b3cbbf915fb7a4d))

  We would need quite some extra CSS for the `.column-resize-handle` for a
questionable benefit. Disable it for now until we need it back and find
a solution for the missing CSS.
Example for the CSS to be added (touches also table and cell styles):
https://tiptap.dev/api/nodes/table#resizable


* Upgrade dependencies. ([a5ea09b](https://github.com/patternslib/pat-tiptap/commit/a5ea09b7669a768a96d9870d2785a89df550c1de))


* Use a different webpack dev server port than the default Patternslib one. ([a099635](https://github.com/patternslib/pat-tiptap/commit/a09963582cff49a22696675a863a971d58dc332c))

## [4.8.5](https://github.com/patternslib/pat-tiptap/compare/4.8.4...4.8.5) (2023-09-25)


### Maintenance


* Mock ClipboardEvent and DragEvent. ([c5bee7a](https://github.com/patternslib/pat-tiptap/commit/c5bee7ad03fe6dcfc2678d3504f49f2566eab0e6))


* Upgrade dependencies. ([e063c4a](https://github.com/patternslib/pat-tiptap/commit/e063c4a4d5ba01d98925c0cfe2ad63404070c0d9))

## [4.8.4](https://github.com/patternslib/pat-tiptap/compare/4.8.3...4.8.4) (2023-08-30)


### Maintenance


* Upgrade dependencies. ([ac4ab29](https://github.com/patternslib/pat-tiptap/commit/ac4ab2918ce685730b26d8ca2a4223d78e974490))

## [4.8.3](https://github.com/patternslib/pat-tiptap/compare/4.8.2...4.8.3) (2023-07-27)


### Maintenance


* Upgrade dependencies. ([9d03afd](https://github.com/patternslib/pat-tiptap/commit/9d03afdea63efa792b0fcd45836457dc2b02fdcb))


* Upgrade dependencies. ([7a6f6ae](https://github.com/patternslib/pat-tiptap/commit/7a6f6ae63265b3ff47f1e18d61d1926425271b99))


## [4.8.2](https://github.com/patternslib/pat-tiptap/compare/4.8.1...4.8.2) (2023-04-17)


### Maintenance


* Upgrade tiptap to 2.0.3 and other dependencies. ([39c3df9](https://github.com/patternslib/pat-tiptap/commit/39c3df9f60bb24b18e5d7d46e2aab2175d747e2b))


## [4.8.1](https://github.com/patternslib/pat-tiptap/compare/4.8.0...4.8.1) (2023-03-09)


### Bug Fixes


* Fix problem with mention/tagging menus. ([4bd92c6](https://github.com/patternslib/pat-tiptap/commit/4bd92c69c0f62309864b3c843e595e8f6179ee80))Fix a problem where a mention/tagging menu could not be opened when
there was already a pat-tooltip instance in tiptap's text content.
The dependency on Patternslib 9.8.3-alpha.1+ solves the problem.


### Maintenance


* Improve update performance. ([44ab8d2](https://github.com/patternslib/pat-tiptap/commit/44ab8d2c4faad3098091db61fc6f173a062665c9))Do not do a Patterns-scan on the content on each update but debounce it
for better performance.

* Upgrade dependencies. ([f6a6871](https://github.com/patternslib/pat-tiptap/commit/f6a68719ab3f5b7a113d6e5873fa3f9c192a5d95))


## [4.8.0](https://github.com/patternslib/pat-tiptap/compare/4.7.2...4.8.0) (2023-02-14)


### Features


* Adding Links: Correct mail address without the mailto: scheme. ([36bfeb0](https://github.com/patternslib/pat-tiptap/commit/36bfeb0bd9b2ba1c68273cc1591fa131a0dd82bb))

* Improve util.is_url and add util.is_mail. ([3ba848c](https://github.com/patternslib/pat-tiptap/commit/3ba848c0b08dcaafbf426fda9a590a7161fe672c))util.is_url now allows for protocol schemes without slashes and let it detect e.g. also mailto:
util.is_mail checks for a valid email adress.


### Maintenance


* Upgrade dependencies. ([f42cefe](https://github.com/patternslib/pat-tiptap/commit/f42cefe5c6096b099bdf296b7ded3a8baf35d8a8))

* Upgrade dependencies. ([0ce9920](https://github.com/patternslib/pat-tiptap/commit/0ce9920b74f9d80d86e7eac7cfb6b65cf3358f2c))


## [4.7.2](https://github.com/patternslib/pat-tiptap/compare/4.7.1...4.7.2) (2022-12-19)


### Bug Fixes


* Ensure correct execution order when closing the context menu. ([986379c](https://github.com/patternslib/pat-tiptap/commit/986379ceca9d0eab4781e8cccb7523eeab0724ae))Wait for the tooltip to have been hidden before calling it's destroy
method. Then also wait for the close_context_menu to have run before
clearing it's instance. This should ensure a correct execution order
when closing the context menu.

* Fix the build. ([f4244fb](https://github.com/patternslib/pat-tiptap/commit/f4244fbe8f1293419ad16f0f139ae55fdba676bd))Temporarily depend on a source-checkout of Patterns to include the sass
directory in the npm package to fix the pat-tiptap build. Change back
once Patterns 9.8.0-beta.2 is released.


### Maintenance


* Add missing dependency prosemirror-tables. ([00a5f6f](https://github.com/patternslib/pat-tiptap/commit/00a5f6f7216d0df094c04012d233b0a6a89ed6d2))

* Fix import for module federation initialization. ([9663a37](https://github.com/patternslib/pat-tiptap/commit/9663a372640f644901255d073947f47244e89192))

* Only include dist/ and src/ directories in the npm package. ([12637bf](https://github.com/patternslib/pat-tiptap/commit/12637bf032d753ad1e68e46b9b4a6eb450263574))

* Upgrade dependencies. ([ebfc763](https://github.com/patternslib/pat-tiptap/commit/ebfc7635eebe7449fe2c7617c2a96fa4b88d64be))

* Use browserslist defaults. ([02a6257](https://github.com/patternslib/pat-tiptap/commit/02a62573d8e919e58506773b588e6e5024a62cb0))


## [4.7.1](https://github.com/patternslib/pat-tiptap/compare/4.7.0...4.7.1) (2022-12-07)


### Maintenance


* Update documentation. ([58472fd](https://github.com/patternslib/pat-tiptap/commit/58472fdb33a4b6768bef72fe037d04b57a0c6eac))

* Upgrade dependencies. ([d4fa774](https://github.com/patternslib/pat-tiptap/commit/d4fa774bc5ce7b1b0dad2b4c721f1c507ec8e3fa))

## [4.7.0](https://github.com/patternslib/pat-tiptap/compare/4.6.2...4.7.0) (2022-12-06)


### Features


* Remove embed, image, link and source panel options. ([e7f5da1](https://github.com/patternslib/pat-tiptap/commit/e7f5da1e9232f319c72c0937a5b5b6a89c7d0d35))Remove the need to define embed, image, link and source panel options
and classes. Since the recent change on the panel initialization these
options are not needed anymore but kept for backwards compatibility.

* Support multiple tabs in modal panels. ([da9e2d0](https://github.com/patternslib/pat-tiptap/commit/da9e2d0e020fe899de3cdea44ca799772205c05b))The embed, link and source panels now support multiple tabs like the
image panel, which can be switched with pat-inject. This allows for more
complex panels.

Fixes: https://github.com/Patternslib/pat-tiptap/issues/45


### Maintenance


* Install missing peerDependencies. ([4181132](https://github.com/patternslib/pat-tiptap/commit/41811322be76828e32851bed6bc6d701c07afdcd))

* Switch to class based patterns. ([fe97124](https://github.com/patternslib/pat-tiptap/commit/fe9712447398c33794a75206f234555ed34dde7f))

* Upgrade dependencies. ([5eb5724](https://github.com/patternslib/pat-tiptap/commit/5eb57245a5cae5f88f28267afc572cc477ed258e))

* Use getter/setter now that we can‌ (since class based patterns). ([d3a9b5b](https://github.com/patternslib/pat-tiptap/commit/d3a9b5bf752e6eb7170ba41e6b9e59aa3d1c09b5))

## [4.6.2](https://github.com/patternslib/pat-tiptap/compare/4.6.1...4.6.2) (2022-11-15)


### Bug Fixes


* Initialize patterns on load. ([022d75b](https://github.com/patternslib/pat-tiptap/commit/022d75b7c6e0191325f929d5be2f2e282bd32f93))Scan the content DOM not only when updating the content but also when the content is initially loaded.

* **Suggestion:** Correctly initialize suggestions when initially loading the content. ([38332ec](https://github.com/patternslib/pat-tiptap/commit/38332ec67106aa5c7f4870718bf779cbcff6b653))Do not initialize suggestion as normal links instead as suggestions.
This change also keeps all the suggestion-related attributes when loading the content.

* **Suggestion:** Fall back to text content if data-title is not set. ([480916f](https://github.com/patternslib/pat-tiptap/commit/480916f8b26fc6b7c7980d5c7442c9724d862a51))When rendering suggestions which do not have a data-title attribute, use
the source node's text content as text for the rendered suggestion.

* **Suggestion:** Set suggestions as isolating content. ([d70f32b](https://github.com/patternslib/pat-tiptap/commit/d70f32b40f2ba58e69eb43d09aceb8475be6114a))Together with the atomic property it The text cannot be changed except by changing the selection.


### Maintenance


* Fix tests after Upgrading Patternslib. ([1ce3359](https://github.com/patternslib/pat-tiptap/commit/1ce3359bde8be01f0a5c66781e4ea0d9333a7c9b))

* Upgrade dependencies. ([ac7f59e](https://github.com/patternslib/pat-tiptap/commit/ac7f59ec0ed0317674195e7bf7be0ca698639e4e))

## [4.6.1](https://github.com/patternslib/pat-tiptap/compare/4.6.0...4.6.1) (2022-09-20)


### Bug Fixes


* Add missing extension @tiptap/suggestion. ([f4fd619](https://github.com/patternslib/pat-tiptap/commit/f4fd619770b6b11983f4822a2f7f1111985b98c8))


### Maintenance


* Upgrade dependencies. ([c3e51ae](https://github.com/patternslib/pat-tiptap/commit/c3e51aec747406a8bfe320c7f0b17723e3f1eb6f))

## [4.6.0](https://github.com/patternslib/pat-tiptap/compare/4.5.1...4.6.0) (2022-09-06)


### Features


* Better handle submits in link, image, embed and source panels. ([97f14b4](https://github.com/patternslib/pat-tiptap/commit/97f14b4ccd8a3a48d9ece4a3f9241e36ae41049a))Encourage in documentation to use .tiptap-confirm buttons in link,
image, embed and source panels and actually prevent a form
submit. This allows to hit <Enter> in forms and take over the
changes without submitting to the server and without doing a
full request/response cycle.

Fixes: https://github.com/Patternslib/pat-tiptap/issues/36


### Maintenance


* Update webpack config. ([c5816e8](https://github.com/patternslib/pat-tiptap/commit/c5816e8503129d91e6d30a886e2f342a1944acab))

## [4.5.1](https://github.com/patternslib/pat-tiptap/compare/4.5.0...4.5.1) (2022-09-05)


### Maintenance


* Add a video to the demo. ([6e8d310](https://github.com/patternslib/pat-tiptap/commit/6e8d310b93950c24692790a81cbaddf4b0a5e83d))

* Upgrade dependencies. ([bfc7cea](https://github.com/patternslib/pat-tiptap/commit/bfc7cea96e3d876cd9f91b49f6c9033bc328913a))

## [4.5.0](https://github.com/patternslib/pat-tiptap/compare/4.4.0...4.5.0) (2022-08-23)


### Features


* Allow to edit embeds. ([7e665f6](https://github.com/patternslib/pat-tiptap/commit/7e665f6c9649a4aed44e13c894b88d7522393dd0))

* Allow to edit images with a image picker and support multiple tabs within the image picker dialogue. ([95f9a05](https://github.com/patternslib/pat-tiptap/commit/95f9a05720a64ae27d3f23294f7e39d3b413bef4))

* Allow to edit images. ([da89fc1](https://github.com/patternslib/pat-tiptap/commit/da89fc100889d52ecec2cab817287a8129c6df53))


### Maintenance


* Add test for multiple tiptap instances sharing one toolbar. ([50e5bfa](https://github.com/patternslib/pat-tiptap/commit/50e5bfab1f6633ef881d92741f6e5c2f1d1dd722))

* **Build:** Include bundle name and version in generated files (Feature of @patternslib/dev 2.4.0.) ([34b16e5](https://github.com/patternslib/pat-tiptap/commit/34b16e53eeaf01d9387f9d11f77b4a2732b0337f))

* **Build:** Unlink all linked dependencies before building a bundle. ([a97c615](https://github.com/patternslib/pat-tiptap/commit/a97c61526b3b6272596cac2dc82750fd0854e2b5))

* **Build:** Upgrade dependencies. ([25e93c4](https://github.com/patternslib/pat-tiptap/commit/25e93c49d54c3426f6317d26048851da1158c878))

* Change link context menu class to tiptap-link-menu to avoid potential same class as the trigger class for the link-panel pattern. ([c5500e0](https://github.com/patternslib/pat-tiptap/commit/c5500e05b51cad0f2fa60378ea0221814be6cdf7))

* Document and demo URL validation in link panel. ([ce08c34](https://github.com/patternslib/pat-tiptap/commit/ce08c34cd83cf4019098c45007ee3c6683fe3300))

* Only open link context menu if it is defined. ([46f9aeb](https://github.com/patternslib/pat-tiptap/commit/46f9aeba653cc368d9bc17360f5b6c1cdcba9ae8))

* Switch to base pattern based patterns. ([83a51b5](https://github.com/patternslib/pat-tiptap/commit/83a51b58b8116851717dba8a9f20394b0b577aee))Change internal patterns to be base pattern based for better integration in the patterns registry and usage of features like preventin double initialization on already initialized nodes.

## [4.4.0](https://github.com/patternslib/pat-tiptap/compare/4.3.0...4.4.0) (2022-08-11)


### Features


* Add utils.is_url to test if a string is a URL. ([28e197f](https://github.com/patternslib/pat-tiptap/commit/28e197fb7dae39228d64e0b4d23f12ac755ea937))

* Link panel: Try to correct invalid URLs. ([72c25fd](https://github.com/patternslib/pat-tiptap/commit/72c25fda642fbb62a3f48f5dcd5756e8c591dadd))If a URL was entered in the link panel but the protocol part was
forgotten, prepend https:// to the URL.
Relative URLs are kept as-is.


### Maintenance


* Upgrade dependencies. ([2bf375b](https://github.com/patternslib/pat-tiptap/commit/2bf375b2e268fb5fb734d6063a8024c1be02a6b6))

## [4.3.0](https://github.com/patternslib/pat-tiptap/compare/4.2.0...4.3.0) (2022-07-17)


### Features


* Close context menu on ESC and outside click. ([6de22c2](https://github.com/patternslib/pat-tiptap/commit/6de22c2a64e0fc05b66f43bb3fdbd8c7f05410df))Always close context menu (link, mentions, tagging) when clicked outside or
escape key was pressed.

* When editing links and closing the link edit panel restore the cursor position to the position where we left. ([2b00839](https://github.com/patternslib/pat-tiptap/commit/2b008396c18d7dfdcf962d95c9f4db0296f3fda3))


### Bug Fixes


* Align to changes in pat-modal where pat-modal-ready is thrown only once and not on the initiating button but on the injected modal. ([7011525](https://github.com/patternslib/pat-tiptap/commit/7011525e0b3d2e422bb56dc72cb7af27e163847d))

* Correct import of logger. ([ee290e4](https://github.com/patternslib/pat-tiptap/commit/ee290e4964eb9a0a156df01ef7bd923e50b7cefb))

* Do not open the link context menu after opening the link editing panel. ([f7d9e95](https://github.com/patternslib/pat-tiptap/commit/f7d9e95ac5c46e1ad0384e9b0443b60ca362e4ab))

* Prevent double initialization of link and suggestion context menu patterns. ([fbda4f6](https://github.com/patternslib/pat-tiptap/commit/fbda4f60e449850539e767e5bd70e11821cb8d78))


### Maintenance


* **Demo:** Add a link to the demo. ([b424f19](https://github.com/patternslib/pat-tiptap/commit/b424f1969aa4ed8505e5c3eb8a404f3cd106ecce))

* **Demo:** Mark focused element in red. ([c969ade](https://github.com/patternslib/pat-tiptap/commit/c969ade377d5165c904d8ab76f054d4710e2f645))

## [4.2.0](https://github.com/patternslib/pat-tiptap/compare/4.1.0...4.2.0) (2022-07-11)


### Features


* Always include undo/redo functionality. ([870b22c](https://github.com/patternslib/pat-tiptap/commit/870b22c5a0f3989da3fcf5091646777902c97911))This allows to use undo/redo via keyboard shortcuts even if undo/redo buttons are not shown.


### Maintenance


* Remove dependency on starter-kit and directly depend on all necessary extensions. Upgrade extensions. ([0862192](https://github.com/patternslib/pat-tiptap/commit/086219238296b46770afdca1069bd444b12ab20c))

* Upgrade @tiptap/core. ([1aa4688](https://github.com/patternslib/pat-tiptap/commit/1aa46886de03ae450fa7075eb6da892937055447))

* Upgrade to @patternslib/dev 2.3.0. ([b55cbc4](https://github.com/patternslib/pat-tiptap/commit/b55cbc45ef02469d0561387dc388240b9624a317))

## [4.1.0](https://github.com/patternslib/pat-tiptap/compare/4.0.0...4.1.0) (2022-06-27)


### Bug Fixes


* Allow to share one toolbar with multiple tiptap instances. ([86022a7](https://github.com/patternslib/pat-tiptap/commit/86022a756e6a6ce7f9819dbd69f3878483a2fc64))Fix an issue with a toolbar which is shared among multiple editor
instances would invoke the command on each instance.
Now you have to focus at least once the editor so that the toolbar will
issue a command on it.
When clicking a toolbar button, the last focused texteditor instance is
used to issue to command on.
To make sure that the toolbar will always invoke an action even without
first clicking into a tiptap contenteditable area use pat-autofocus.

* Fix demo index-many.html with many tiptap instances to use the correct bundle JavaScript. ([6ca04b1](https://github.com/patternslib/pat-tiptap/commit/6ca04b155e3edad351101cafd40bd7539916228f))

* Use known good versions for [@tiptap](https://github.com/tiptap) until current issues with newer beta releases are resolved. ([c9d5716](https://github.com/patternslib/pat-tiptap/commit/c9d57165e5b8ccfb4cf471a81e9827f60a4c5094))Newer versions break with: "RangeError: Adding different instances of a keyed plugin (plugin$)"


### Maintenance


* Upgrade to @patternslib/dev 2.2.0 and adapt module federation config. ([603f12c](https://github.com/patternslib/pat-tiptap/commit/603f12c2574af5c312552a88ce5403fd5022e15c))

## [4.0.0](https://github.com/patternslib/pat-tiptap/compare/4.0.0-alpha.1...4.0.0) (2022-06-21)


### Bug Fixes


* Close the suggestion popup when clicking outside. ([ca75099](https://github.com/patternslib/pat-tiptap/commit/ca75099745b56b3962d0c48d2f2a92ccfbba0aa6))

* Update demo for correct bundle since we extend @patternslib/dev webpack config. ([6c21285](https://github.com/patternslib/pat-tiptap/commit/6c212852d0067fc261ce30e9cc1ae82813488f22))


### Maintenance


* Remove console.log message in tests. ([b82508c](https://github.com/patternslib/pat-tiptap/commit/b82508c84b73db471cb589fe8db85085808666a8))

## [4.0.0-alpha.1](https://github.com/patternslib/pat-tiptap/compare/4.0.0-alpha.0...4.0.0-alpha.1) (2022-06-15)


### Breaking Changes


* Depend on @patternslib/dev and extend config from there. ([c7989ac](https://github.com/patternslib/pat-tiptap/commit/c7989acc639eab92fb33410f9121dc1bc9214c9b))

* Extend babel config from @patternslib/dev. ([b20800e](https://github.com/patternslib/pat-tiptap/commit/b20800e2710ef12c15b95ed965ad409d6378f67d))

* Extend commitlint config from @patternslib/dev. ([96ef27e](https://github.com/patternslib/pat-tiptap/commit/96ef27ed92c33806825931291e81c26a624b12d8))

* Extend eslint config from @patternslib/dev. ([6173108](https://github.com/patternslib/pat-tiptap/commit/6173108c6cdd2fb481bc45c4d21030d49abaeafb))

* Extend jest config from @patternslib/dev. ([f80ad63](https://github.com/patternslib/pat-tiptap/commit/f80ad63655327ac7a48fec7144195f86a9d11218))

* Extend Makefile from @patternslib/dev. ([37e2c0c](https://github.com/patternslib/pat-tiptap/commit/37e2c0ceb54be4233ae93377338b3a1b2c890592))

* Extend prettier config from @patternslib/dev. ([36daaf8](https://github.com/patternslib/pat-tiptap/commit/36daaf86cb64ec0d0320e7ee0126cb467c6d8ac7))

* Extend release-it config from @patternslib/dev. ([17cea4b](https://github.com/patternslib/pat-tiptap/commit/17cea4b95e06f993d2cbf0aa133c9f452bae0723))

* Extend webpack config from @patternslib/dev. ([5c19f1a](https://github.com/patternslib/pat-tiptap/commit/5c19f1a58dd0820fedccbbcfa247cfa58e035228))


### Maintenance


* **Build:** Update GitHub actions setup. ([a516f9b](https://github.com/patternslib/pat-tiptap/commit/a516f9bcd608cfa94db2a917e13b7ef3fea7d668))

See the [history](./docs/history/index.md) for older changelog entries.



## [4.0.0-alpha.0](https://github.com/patternslib/pat-tiptap/compare/3.4.1...4.0.0-alpha.0) (2022-06-14)


### Features


* **Build:** Build module federation enabled bundles. ([f7012d3](https://github.com/patternslib/pat-tiptap/commit/f7012d3adacccbb56162f207ded9404c4febc868))


### Maintenance


* **Build:** @patternslib/patternslib as peerDependency. ([7dd2328](https://github.com/patternslib/pat-tiptap/commit/7dd23285275768849af42681371978a4ad26833b))Move @patternslib/patternslib dependency to peerDependencies and set to any version to avoid version conflicts when this package is a dependency of another Patternslib based package.

* **Build:** Add @patternslib/patternslib also to devDependencies so that we get it installed. ([0e96688](https://github.com/patternslib/pat-tiptap/commit/0e966887eb4fe656972ce436174c4e5fddad0291))

* **build:** Add build:dev script to package.json to create a unminified development build. ([d7a0cb2](https://github.com/patternslib/pat-tiptap/commit/d7a0cb236260a207657185b2b8ad7400d28aa21f))

* **Build:** Add keyword "patternslib" to package.json. ([35e1714](https://github.com/patternslib/pat-tiptap/commit/35e1714ef6c16452bee65ad52af2f6c4cd77c82b))

* **Build:** Extend jest.config.js from Patternslib and reuse their setupTests file too. ([f772a66](https://github.com/patternslib/pat-tiptap/commit/f772a6668c2aebd7ec84524bc870c9d1b1817609))

* **Build:** Makefile - Allow OTP when publishing to npm, build bundles and publish them on GitHub, add pre-release targets. ([1a376cc](https://github.com/patternslib/pat-tiptap/commit/1a376cc1c23aa1ed131047da6974b40f34414d44))

* **Build:** Remove dependency regenerator-runtime except from test setup. The async/await runtime handling is already built-in in current Babel. ([c88b735](https://github.com/patternslib/pat-tiptap/commit/c88b7359c9f5ec38384cdcb7e188bf5a4ffad2ba))

* **Build:** Upgrade and cleanup dependencies. ([0558bfc](https://github.com/patternslib/pat-tiptap/commit/0558bfcda9b13545cf11f5ba4f6dcd94fe1caebe))

* Make core a little more efficient and don't overuse optional chaining where it's not needed. ([f10b94a](https://github.com/patternslib/pat-tiptap/commit/f10b94abc6f22580f3b93c39af020f1b87c6ffd1))

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
