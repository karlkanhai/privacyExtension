

'use strict';


(( ) => {



self.cloud = {
    options: {},
    datakey: '',
    data: undefined,
    onPush: null,
    onPull: null
};

/******************************************************************************/

const widget = uDom.nodeFromId('cloudWidget');
if ( widget === null ) { return; }

self.cloud.datakey = widget.getAttribute('data-cloud-entry') || '';
if ( self.cloud.datakey === '' ) { return; }

/******************************************************************************/

const fetchCloudData = async function() {
    const entry = await vAPI.messaging.send('cloudWidget', {
        what: 'cloudPull',
        datakey: self.cloud.datakey,
    });
    if ( entry instanceof Object === false ) { return; }

    self.cloud.data = entry.data;

    uDom.nodeFromId('cloudPull').removeAttribute('disabled');
    uDom.nodeFromId('cloudPullAndMerge').removeAttribute('disabled');

    const timeOptions = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZoneName: 'short'
    };

    const time = new Date(entry.tstamp);
    widget.querySelector('#cloudInfo').textContent =
        entry.source + '\n' +
        time.toLocaleString('fullwide', timeOptions);
};

/******************************************************************************/

const pushData = async function() {
    if ( typeof self.cloud.onPush !== 'function' ) { return; }

    const error = await vAPI.messaging.send('cloudWidget', {
        what: 'cloudPush',
        datakey: self.cloud.datakey,
        data: self.cloud.onPush(),
    });
    const failed = typeof error === 'string';
    document.getElementById('cloudPush')
            .classList
            .toggle('error', failed);
    document.querySelector('#cloudError')
            .textContent = failed ? error : '';
    fetchCloudData();
};

/******************************************************************************/

var pullData = function() {
    if ( typeof self.cloud.onPull === 'function' ) {
        self.cloud.onPull(self.cloud.data, false);
    }
};

/******************************************************************************/

var pullAndMergeData = function() {
    if ( typeof self.cloud.onPull === 'function' ) {
        self.cloud.onPull(self.cloud.data, true);
    }
};

/******************************************************************************/

var openOptions = function() {
    var input = uDom.nodeFromId('cloudDeviceName');
    input.value = self.cloud.options.deviceName;
    input.setAttribute('placeholder', self.cloud.options.defaultDeviceName);
    uDom.nodeFromId('cloudOptions').classList.add('show');
};

/******************************************************************************/

var closeOptions = function(ev) {
    var root = uDom.nodeFromId('cloudOptions');
    if ( ev.target !== root ) {
        return;
    }
    root.classList.remove('show');
};

/******************************************************************************/

const submitOptions = async function() {
    uDom.nodeFromId('cloudOptions').classList.remove('show');

    const options = await vAPI.messaging.send('cloudWidget', {
        what: 'cloudSetOptions',
        options: {
            deviceName: uDom.nodeFromId('cloudDeviceName').value
        },
    });
    if ( options instanceof Object ) {
        self.cloud.options = options;
    }
};

/******************************************************************************/

const onInitialize = function(options) {
    if ( options instanceof Object === false ) { return; }
    if ( !options.enabled ) { return; }
    self.cloud.options = options;

    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'cloud-ui.html', true);
    xhr.overrideMimeType('text/html;charset=utf-8');
    xhr.responseType = 'text';
    xhr.onload = function() {
        this.onload = null;
        const parser = new DOMParser(),
            parsed = parser.parseFromString(this.responseText, 'text/html'),
            fromParent = parsed.body;
        while ( fromParent.firstElementChild !== null ) {
            widget.appendChild(
                document.adoptNode(fromParent.firstElementChild)
            );
        }

        faIconsInit(widget);

        vAPI.i18n.render(widget);
        widget.classList.remove('hide');

        uDom('#cloudPush').on('click', ( ) => { pushData(); });
        uDom('#cloudPull').on('click', pullData);
        uDom('#cloudPullAndMerge').on('click', pullAndMergeData);
        uDom('#cloudCog').on('click', openOptions);
        uDom('#cloudOptions').on('click', closeOptions);
        uDom('#cloudOptionsSubmit').on('click', ( ) => { submitOptions(); });
        
        // Patch 2018-01-05: Must not assume this XHR will always be faster
        // than messaging
        fetchCloudData();
    };
    xhr.send();
};

vAPI.messaging.send('cloudWidget', {
    what: 'cloudGetOptions',
}).then(options => {
    onInitialize(options);
});

/******************************************************************************/

})();
