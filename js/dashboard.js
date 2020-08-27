

'use strict';

/******************************************************************************/

{
// >>>>> start of local scope

/******************************************************************************/

const discardUnsavedData = function(synchronous = false) {
    const paneFrame = document.getElementById('iframe');
    const paneWindow = paneFrame.contentWindow;
    if (
        typeof paneWindow.hasUnsavedData !== 'function' ||
        paneWindow.hasUnsavedData() === false
    ) {
        return true;
    }

    if ( synchronous ) {
        return false;
    }

    return new Promise(resolve => {
        const modal = uDom.nodeFromId('unsavedWarning');
        modal.classList.add('on');
        modal.focus();

        const onDone = status => {
            modal.classList.remove('on');
            document.removeEventListener('click', onClick, true);
            resolve(status);
        };

        const onClick = ev => {
            const target = ev.target;
            if ( target.matches('[data-i18n="dashboardUnsavedWarningStay"]') ) {
                return onDone(false);
            }
            if ( target.matches('[data-i18n="dashboardUnsavedWarningIgnore"]') ) {
                return onDone(true);
            }
            if ( modal.querySelector('[data-i18n="dashboardUnsavedWarning"]').contains(target) ) {
                return;
            }
            onDone(false);
        };

        document.addEventListener('click', onClick, true);
    });
};

const loadDashboardPanel = function(pane, first) {
    const tabButton = uDom.nodeFromSelector(`[data-pane="${pane}"]`);
    if ( tabButton === null || tabButton.classList.contains('selected') ) {
        return;
    }
    const loadPane = ( ) => {
        self.location.replace(`#${pane}`);
        uDom('.tabButton.selected').toggleClass('selected', false);
        tabButton.classList.add('selected');
        tabButton.scrollIntoView();
        uDom.nodeFromId('iframe').setAttribute('src', pane);
        vAPI.localStorage.setItem('dashboardLastVisitedPane', pane);
    };
    if ( first ) {
        return loadPane();
    }
    const r = discardUnsavedData();
    if ( r === false ) { return; }
    if ( r === true ) {
        return loadPane();
    }
    r.then(status => {
        if ( status === false ) { return; }
        loadPane();
    });
};

const onTabClickHandler = function(ev) {
    loadDashboardPanel(ev.target.getAttribute('data-pane'));
};

// https://github.com/uBlockOrigin/uBlock-issues/issues/106
vAPI.messaging.send('dashboard', {
    what: 'canUpdateShortcuts',
}).then(response => {
    document.body.classList.toggle('canUpdateShortcuts', response === true);
});

vAPI.localStorage.getItemAsync('dashboardLastVisitedPane').then(value => {
    loadDashboardPanel(value !== null ? value : 'settings.html', true);

    uDom('.tabButton').on('click', onTabClickHandler);

    // https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event
    window.addEventListener('beforeunload', ( ) => {
        if ( discardUnsavedData(true) ) { return; }
        event.preventDefault();
        event.returnValue = '';
    });
});

/******************************************************************************/

// <<<<< end of local scope
}
