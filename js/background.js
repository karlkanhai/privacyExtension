
'use strict';

/******************************************************************************/

// Not all platforms may have properly declared vAPI.webextFlavor.

if ( vAPI.webextFlavor === undefined ) {
    vAPI.webextFlavor = { major: 0, soup: new Set([ 'ublock' ]) };
}


/******************************************************************************/

const µBlock = (( ) => { // jshint ignore:line

    const hiddenSettingsDefault = {
        allowGenericProceduralFilters: false,
        assetFetchTimeout: 30,
        autoCommentFilterTemplate: '{{date}} {{origin}}',
        autoUpdateAssetFetchPeriod: 120,
        autoUpdateDelayAfterLaunch: 180,
        autoUpdatePeriod: 7,
        benchmarkDatasetURL: 'unset',
        blockingProfiles: '11111/#F00 11011/#C0F 11001/#00F 00001',
        cacheStorageAPI: 'unset',
        cacheStorageCompression: true,
        cacheControlForFirefox1376932: 'no-cache, no-store, must-revalidate',
        cnameIgnoreList: 'unset',
        cnameIgnore1stParty: true,
        cnameIgnoreExceptions: true,
        cnameIgnoreRootDocument: true,
        cnameMaxTTL: 120,
        cnameReplayFullURL: false,
        cnameUncloak: true,
        cnameUncloakProxied: false,
        consoleLogLevel: 'unset',
        debugScriptlets: false,
        debugScriptletInjector: false,
        disableWebAssembly: false,
        extensionUpdateForceReload: false,
        ignoreRedirectFilters: false,
        ignoreScriptInjectFilters: false,
        filterAuthorMode: false,
        loggerPopupType: 'popup',
        manualUpdateAssetFetchPeriod: 500,
        popupFontSize: 'unset',
        popupPanelDisabledSections: 0,
        popupPanelLockedSections: 0,
        popupPanelHeightMode: 0,
        requestJournalProcessPeriod: 1000,
        selfieAfter: 3,
        strictBlockingBypassDuration: 120,
        suspendTabsUntilReady: 'unset',
        uiPopupConfig: 'undocumented',
        uiFlavor: 'unset',
        uiStyles: 'unset',
        updateAssetBypassBrowserCache: false,
        userResourcesLocation: 'unset',
    };

    return {
        userSettings: {
            advancedUserEnabled: false,
            alwaysDetachLogger: true,
            autoUpdate: true,
            cloudStorageEnabled: false,
            collapseBlocked: true,
            colorBlindFriendly: false,
            contextMenuEnabled: true,
            dynamicFilteringEnabled: false,
            externalLists: [],
            firewallPaneMinimized: true,
            hyperlinkAuditingDisabled: true,
            ignoreGenericCosmeticFilters: vAPI.webextFlavor.soup.has('mobile'),
            largeMediaSize: 50,
            parseAllABPHideFilters: true,
            popupPanelSections: 0b111,
            prefetchingDisabled: true,
            requestLogMaxEntries: 1000,
            showIconBadge: true,
            tooltipsDisabled: false,
            webrtcIPAddressHidden: false,
        },

        hiddenSettingsDefault: hiddenSettingsDefault,
        hiddenSettings: Object.assign({}, hiddenSettingsDefault),

        // Features detection.
        privacySettingsSupported: vAPI.browserSettings instanceof Object,
        cloudStorageSupported: vAPI.cloud instanceof Object,
        canFilterResponseData: typeof browser.webRequest.filterResponseData === 'function',
        canInjectScriptletsNow: vAPI.webextFlavor.soup.has('chromium'),

        // https://github.com/chrisaljoudi/uBlock/issues/180
        // Whitelist directives need to be loaded once the PSL is available
        netWhitelist: new Map(),
        netWhitelistModifyTime: 0,
        netWhitelistDefault: [
            'about-scheme',
            'chrome-extension-scheme',
            'chrome-scheme',
            'edge-scheme',
            'moz-extension-scheme',
            'opera-scheme',
            'vivaldi-scheme',
            'wyciwyg-scheme',   // Firefox's "What-You-Cache-Is-What-You-Get"
        ],

        localSettings: {
            blockedRequestCount: 0,
            allowedRequestCount: 0,
        },
        localSettingsLastModified: 0,
        localSettingsLastSaved: 0,

        // Read-only
        systemSettings: {
            compiledMagic: 28,  // Increase when compiled format changes
            selfieMagic: 28,    // Increase when selfie format changes
        },

       
        compiledFormatChanged: false,
        selfieIsInvalid: false,

        restoreBackupSettings: {
            lastRestoreFile: '',
            lastRestoreTime: 0,
            lastBackupFile: '',
            lastBackupTime: 0,
        },

        commandShortcuts: new Map(),

       
        assetsBootstrapLocation: undefined,

        userFiltersPath: 'user-filters',
        pslAssetKey: 'public_suffix_list.dat',

        selectedFilterLists: [],
        availableFilterLists: {},

        
        readyToFilter: false,

        pageStores: new Map(),
        pageStoresToken: 0,

        storageQuota: vAPI.storage.QUOTA_BYTES,
        storageUsed: 0,

        noopFunc: function(){},

        apiErrorCount: 0,

        maybeGoodPopup: {
            tabId: 0,
            url: '',
        },

        epickerArgs: {
            eprom: null,
            mouse: false,
            target: '',
            zap: false,
        },

        scriptlets: {},

        cspNoInlineScript: "script-src 'unsafe-eval' * blob: data:",
        cspNoScripting: 'script-src http: https:',
        cspNoInlineFont: 'font-src *',

        liveBlockingProfiles: [],
        blockingProfileColorCache: new Map(),
    };

})();

/******************************************************************************/
