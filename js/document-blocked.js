
'use strict';

/******************************************************************************/

(( ) => {

/******************************************************************************/

const messaging = vAPI.messaging;
let details = {};

{
    const matches = /details=([^&]+)/.exec(window.location.search);
    if ( matches !== null ) {
        details = JSON.parse(decodeURIComponent(matches[1]));
    }
}

/******************************************************************************/

(async ( ) => {
    const response = await messaging.send('documentBlocked', {
        what: 'listsFromNetFilter',
        rawFilter: details.fs,
    });
    if ( response instanceof Object === false ) { return; }

    let lists;
    for ( const rawFilter in response ) {
        if ( response.hasOwnProperty(rawFilter) ) {
            lists = response[rawFilter];
            break;
        }
    }

    if ( Array.isArray(lists) === false || lists.length === 0 ) { return; }

    const parent = uDom.nodeFromSelector('#whyex > span:nth-of-type(2)');
    for ( const list of lists ) {
        const elem = document.querySelector('#templates .filterList')
                             .cloneNode(true);
        const source = elem.querySelector('.filterListSource');
        source.href += encodeURIComponent(list.assetKey);
        source.textContent = list.title;
        if (
            typeof list.supportURL === 'string' &&
            list.supportURL !== ''
        ) {
            elem.querySelector('.filterListSupport')
                .setAttribute('href', list.supportURL);
        }
        parent.appendChild(elem);
    }
    uDom.nodeFromId('whyex').style.removeProperty('display');
})();

/******************************************************************************/

(( ) => {
    const matches = /^(.*)\{\{hostname\}\}(.*)$/.exec(vAPI.i18n('docblockedProceed'));
    if ( matches === null ) { return; }
    const proceed = uDom('#templates .proceed').clone();
    proceed.descendants('span:nth-of-type(1)').text(matches[1]);
    proceed.descendants('span:nth-of-type(3)').text(matches[2]);
    if ( details.hn !== details.dn ) {
        proceed.descendants('.hn').text(details.hn).attr('value', details.hn);
    } else {
        proceed.descendants('.hn').remove();
    }
    proceed.descendants('.dn').text(details.dn).attr('value', details.dn);

    uDom('#proceed').append(proceed);
})();

/******************************************************************************/

uDom.nodeFromSelector('#theURL > p').textContent = details.url;
uDom.nodeFromId('why').textContent = details.fs;

/******************************************************************************/

// https://github.com/gorhill/uBlock/issues/691
// Parse URL to extract as much useful information as possible. This is useful
// to assist the user in deciding whether to navigate to the web page.

(( ) => {
    if ( typeof URL !== 'function' ) { return; }

    const reURL = /^https?:\/\//;

    const liFromParam = function(name, value) {
        if ( value === '' ) {
            value = name;
            name = '';
        }
        const li = document.createElement('li');
        let span = document.createElement('span');
        span.textContent = name;
        li.appendChild(span);
        if ( name !== '' && value !== '' ) {
            li.appendChild(document.createTextNode(' = '));
        }
        span = document.createElement('span');
        if ( reURL.test(value) ) {
            const a = document.createElement('a');
            a.href = a.textContent = value;
            span.appendChild(a);
        } else {
            span.textContent = value;
        }
        li.appendChild(span);
        return li;
    };

    const safeDecodeURIComponent = function(s) {
        try {
            s = decodeURIComponent(s);
        } catch (ex) {
        }
        return s;
    };

    const renderParams = function(parentNode, rawURL) {
        const a = document.createElement('a');
        a.href = rawURL;
        if ( a.search.length === 0 ) { return false; }

        let pos = rawURL.indexOf('?');
        const li = liFromParam(
            vAPI.i18n('docblockedNoParamsPrompt'),
            rawURL.slice(0, pos)
        );
        parentNode.appendChild(li);

        const params = a.search.slice(1).split('&');
        for ( const param of params ) {
            let pos = param.indexOf('=');
            if ( pos === -1 ) {
                pos = param.length;
            }
            const name = safeDecodeURIComponent(param.slice(0, pos));
            const value = safeDecodeURIComponent(param.slice(pos + 1));
            const li = liFromParam(name, value);
            if ( reURL.test(value) ) {
                const ul = document.createElement('ul');
                renderParams(ul, value);
                li.appendChild(ul);
            }
            parentNode.appendChild(li);
        }
        return true;
    };

    if ( renderParams(uDom.nodeFromId('parsed'), details.url) === false ) {
        return;
    }

    const toggler = document.createElement('span');
    toggler.className = 'fa';
    uDom('#theURL > p').append(toggler);

    uDom(toggler).on('click', function() {
        const cl = uDom.nodeFromId('theURL').classList;
        cl.toggle('collapsed');
        vAPI.localStorage.setItem(
            'document-blocked-expand-url',
            (cl.contains('collapsed') === false).toString()
        );
    });

    vAPI.localStorage.getItemAsync('document-blocked-expand-url').then(value => {
        uDom.nodeFromId('theURL').classList.toggle(
            'collapsed',
            value !== 'true' && value !== true
        );
    });
})();

/******************************************************************************/

// https://www.reddit.com/r/uBlockOrigin/comments/breeux/close_this_window_doesnt_work_on_firefox/

if ( window.history.length > 1 ) {
    uDom('#back').on(
        'click',
        ( ) => {
            window.history.back();
        }
    );
    uDom('#bye').css('display', 'none');
} else {
    uDom('#bye').on(
        'click',
        ( ) => {
            messaging.send('documentBlocked', {
                what: 'closeThisTab',
            });
        }
    );
    uDom('#back').css('display', 'none');
}

/******************************************************************************/

const getTargetHostname = function() {
    const elem = document.querySelector('#proceed select');
    if ( elem === null ) { return details.hn; }
    return elem.value;
};

const proceedToURL = function() {
    window.location.replace(details.url);
};

const proceedTemporary = async function() {
    await messaging.send('documentBlocked', {
        what: 'temporarilyWhitelistDocument',
        hostname: getTargetHostname(),
    });
    proceedToURL();
};

const proceedPermanent = async function() {
    await messaging.send('documentBlocked', {
        what: 'toggleHostnameSwitch',
        name: 'no-strict-blocking',
        hostname: getTargetHostname(),
        deep: true,
        state: true,
        persist: true,
    });
    proceedToURL();
};

uDom('#proceedTemporary').attr('href', details.url).on('click', proceedTemporary);
uDom('#proceedPermanent').attr('href', details.url).on('click', proceedPermanent);

/******************************************************************************/

})();

/******************************************************************************/
