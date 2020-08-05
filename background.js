
var mek = null;
chrome.storage.sync.get(['thirdPartyJS'], function(result) {
    mek = result.thirdPartyJS;
    
});



chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == "clearCookies") { 
     
      
      chrome.storage.local.get(['siteCookieDeletion'], function(result) {
        if(result.siteCookieDeletion) { 
          
          removeAll()
        }
    });
      
    
    } else
      sendResponse({}); // snub them.
});


chrome.privacy.websites.doNotTrackEnabled.set({ value: true }, function() {
        
});
chrome.privacy.services.searchSuggestEnabled.set({ value: false }, function() {
        
});
chrome.privacy.services.spellingServiceEnabled.set({ value: false }, function() {
        
});
chrome.privacy.services.translationServiceEnabled.set({ value: false }, function() {
        
});
chrome.privacy.network.webRTCMultipleRoutesEnabled.set({ value: false }, function() {
        
});
chrome.privacy.network.networkPredictionEnabled.set({ value: false }, function() {
        
});
chrome.privacy.services.alternateErrorPagesEnabled.set({ value: false }, function() {
        
});
chrome.privacy.websites.thirdPartyCookiesAllowed.set({ value: false }, function() {});

chrome.storage.local.set({doNotTrackProc: true }, function() {

});
chrome.storage.local.set({disableSearchSuggestions: true }, function() {

});
chrome.storage.local.set({disableSpellingSuggestion: true }, function() {

});
chrome.storage.local.set({disableGoogleTranslation: true }, function() {

});
chrome.storage.local.set({webRTCProc: true }, function() {

});
chrome.storage.local.set({disableNetworkPrediction: true }, function() {

});
chrome.storage.local.set({alternateErrorPagesProc: true }, function() {

});
chrome.storage.local.set({forceHttps: true }, function() {

});
chrome.storage.local.set({siteCookieDeletion: false }, function() {

});
chrome.storage.local.set({cookieEndDeletion: true }, function() {

});
chrome.storage.local.set({disableAllCookies: false }, function() {

});
chrome.storage.local.set({disableJavascript: false }, function() {

});
chrome.storage.sync.set({adblock: true }, function() {
      
});

chrome.storage.sync.set({blockTPC: true }, function() {
        
});

chrome.storage.sync.set({thirdPartyJS: true  }, function() {
        
});
chrome.storage.local.set({"cookieEndDeletion": true}, function() {
        
});
chrome.storage.local.set({"disableJavascript": false}, function() {
        
});

chrome.cookies.onChanged.addListener(function() {
  
});

function focusOrCreateTab(url) {
  chrome.windows.getAll({"populate":true}, function(windows) {
    var existing_tab = null;
    for (var i in windows) {
      var tabs = windows[i].tabs;
      for (var j in tabs) {
        var tab = tabs[j];
        if (tab.url == url) {
          existing_tab = tab;
          break;
        }
      }
    }
    if (existing_tab) {
      chrome.tabs.update(existing_tab.id, {"selected":true});
    } else {
      chrome.tabs.create({"url":url, "selected":true});
    }
  });
}

chrome.browserAction.onClicked.addListener(function(tab) {
  var manager_url = chrome.extension.getURL("manager.html");
  focusOrCreateTab(manager_url);
});


// sep

if (!chrome.cookies) {
  chrome.cookies = chrome.experimental.cookies;
}

// A simple Timer class.
function Timer() {
  this.start_ = new Date();

  this.elapsed = function() {
    return (new Date()) - this.start_;
  }

  this.reset = function() {
    this.start_ = new Date();
  }
}

// Compares cookies for "key" (name, domain, etc.) equality, but not "value"
// equality.
function cookieMatch(c1, c2) {
  return (c1.name == c2.name) && (c1.domain == c2.domain) &&
         (c1.hostOnly == c2.hostOnly) && (c1.path == c2.path) &&
         (c1.secure == c2.secure) && (c1.httpOnly == c2.httpOnly) &&
         (c1.session == c2.session) && (c1.storeId == c2.storeId);
}

// Returns an array of sorted keys from an associative array.
function sortedKeys(array) {
  var keys = [];
  for (var i in array) {
    keys.push(i);
  }
  keys.sort();
  return keys;
}

// Shorthand for document.querySelector.
function select(selector) {
  return document.querySelector(selector);
}

// An object used for caching data about the browser's cookies, which we update
// as notifications come in.
function CookieCache() {
  this.cookies_ = {};

  this.reset = function() {
    this.cookies_ = {};
  }

  this.add = function(cookie) {
    var domain = cookie.domain;
    if (!this.cookies_[domain]) {
      this.cookies_[domain] = [];
    }
    this.cookies_[domain].push(cookie);
  };

  this.remove = function(cookie) {
    var domain = cookie.domain;
    if (this.cookies_[domain]) {
      var i = 0;
      while (i < this.cookies_[domain].length) {
        if (cookieMatch(this.cookies_[domain][i], cookie)) {
          this.cookies_[domain].splice(i, 1);
        } else {
          i++;
        }
      }
      if (this.cookies_[domain].length == 0) {
        delete this.cookies_[domain];
      }
    }
  };

  // Returns a sorted list of cookie domains that match |filter|. If |filter| is
  //  null, returns all domains.
  this.getDomains = function(filter) {
    var result = [];
    sortedKeys(this.cookies_).forEach(function(domain) {
      if (!filter || domain.indexOf(filter) != -1) {
        result.push(domain);
      }
    });
    return result;
  }

  this.getCookies = function(domain) {
    return this.cookies_[domain];
  };
}


var cache = new CookieCache();


function removeAllForFilter() {
  var filter = select("#filter").value;
  var timer = new Timer();
  cache.getDomains(filter).forEach(function(domain) {
    removeCookiesForDomain(domain);
  });
}

function removeAll() {
  var all_cookies = [];
  cache.getDomains().forEach(function(domain) {
    cache.getCookies(domain).forEach(function(cookie) {
      all_cookies.push(cookie);
    });
  });
  cache.reset();
  var count = all_cookies.length;
  var timer = new Timer();
  for (var i = 0; i < count; i++) {
    removeCookie(all_cookies[i]);
  }
  timer.reset();
  chrome.cookies.getAll({}, function(cookies) {
    for (var i in cookies) {
      cache.add(cookies[i]);
      removeCookie(cookies[i]);
    }
  });
}

function removeCookie(cookie) {
  var url = "http" + (cookie.secure ? "s" : "") + "://" + cookie.domain +
            cookie.path;
  chrome.cookies.remove({"url": url, "name": cookie.name});
}


chrome.tabs.onRemoved.addListener(function() { 

  chrome.tabs.query({windowType:'normal'}, function(tabs) {
      
    chrome.storage.local.get(["cookieEndDeletion"], function(result) {
        if(result.cookieEndDeletion == true) { 
          removeAll()
        }
    });
  
  }); 

})


function removeHeader(headers, name) {
    
  chrome.storage.local.get(['disableAllCookies'], function(result) {
      chrome.privacy.websites.thirdPartyCookiesAllowed.set({ value: false }, function() {});
      if(result.disableAllCookies == true) {
          
      
          for (var i = 0; i < headers.length; i++) {
          if (headers[i].name.toLowerCase() == name) {
            console.log('Removing "' + name + '" header.');
            headers.splice(i, 1);
            break;
          }
    
        }

      }

      if(result.disableAllCookies == false) { 
          
        chrome.storage.sync.get(['blockTPC'], function(result) {
          if (result.blockTPC == false) { 
            chrome.privacy.websites.thirdPartyCookiesAllowed.set({ value: true }, function() {});
          }
        });



      }
  });
  
  




}



'use strict';

// Simple extension to remove 'Cookie' request header and 'Set-Cookie' response
// header.

function removeHeader(headers, name) {
  chrome.storage.local.get(['disableAllCookies'], function(result) {
    if(result.disableAllCookies == true) { 
      for (var i = 0; i < headers.length; i++) {
        if (headers[i].name.toLowerCase() == name) {
          console.log('Removing "' + name + '" header.');
          headers.splice(i, 1);
          break;
        }
      }
    }
  });
  
}

chrome.webRequest.onBeforeSendHeaders.addListener(
 
  
  function(details) {
    removeHeader(details.requestHeaders, 'cookie');
    return {requestHeaders: details.requestHeaders};
  },
  // filters
  {urls: ['https://*/*', 'http://*/*']},
  // extraInfoSpec
  ['blocking', 'requestHeaders', 'extraHeaders']);

chrome.webRequest.onHeadersReceived.addListener(
  function(details) {
    removeHeader(details.responseHeaders, 'set-cookie');
    return {responseHeaders: details.responseHeaders};
  },
  // filters
  {urls: ['https://*/*', 'http://*/*']},
  // extraInfoSpec
  ['blocking', 'responseHeaders', 'extraHeaders']);




  function toggleJS() { 
    chrome.storage.local.get(['disableJavascript'], function(result) {
      
      
      if(result.disableJavascript == false) { 
        chrome.contentSettings.javascript.set({primaryPattern: "*://*/*", setting: "allow"}, function(){});
      }
      if(result.disableJavascript == true) { 
        chrome.contentSettings.javascript.set({primaryPattern: "*://*/*", setting: "block"}, function(){});
      }
  });
    
  
    
    
  
  }

  chrome.storage.onChanged.addListener(function(changes, namespace) {
    		toggleJS()
  });

  chrome.storage.local.set({"on3": true}, function() {});



var mek = 'off'
function makeoff() {
    chrome.browserAction.setBadgeText({text:'off'});
}
makeoff()


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  
  setbadgerText()




});

function setbadgerText() { 
  chrome.browserAction.setBadgeText({text:'off'});
}