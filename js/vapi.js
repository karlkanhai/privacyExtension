

'use strict';


if ( self.browser instanceof Object ) {
    self.chrome = self.browser;
} else {
    self.browser = self.chrome;
}

/******************************************************************************/

// https://bugzilla.mozilla.org/show_bug.cgi?id=1408996#c9
var vAPI = self.vAPI; // jshint ignore:line

// https://github.com/chrisaljoudi/uBlock/issues/464
// https://github.com/chrisaljoudi/uBlock/issues/1528
//   A XMLDocument can be a valid HTML document.

// https://github.com/gorhill/uBlock/issues/1124
//   Looks like `contentType` is on track to be standardized:
//   https://dom.spec.whatwg.org/#concept-document-content-type

// https://forums.lanik.us/viewtopic.php?f=64&t=31522
//   Skip text/plain documents.

if (
    (
        document instanceof HTMLDocument ||
        document instanceof XMLDocument &&
        document.createElement('div') instanceof HTMLDivElement
    ) &&
    (
        /^image\/|^text\/plain/.test(document.contentType || '') === false
    ) &&
    (
        self.vAPI instanceof Object === false || vAPI.uBO !== true
    )
) {
    vAPI = self.vAPI = { uBO: true };
}








/*******************************************************************************

    DO NOT:
    - Remove the following code
    - Add code beyond the following code
    Reason:
    - https://github.com/gorhill/uBlock/pull/3721
    - uBO never uses the return value from injected content scripts

**/

void 0;
