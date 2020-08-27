

'use strict';


if ( self.browser instanceof Object ) {
    self.chrome = self.browser;
} else {
    self.browser = self.chrome;
}

/******************************************************************************/


var vAPI = self.vAPI; // jshint ignore:line

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









void 0;
