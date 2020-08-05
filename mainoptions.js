document.getElementById("blockTPJSToggle").addEventListener("click", savePrefereneces);
document.getElementById("blockTPC").addEventListener("click", savePrefereneces);
document.getElementById("adblock").addEventListener("click", savePrefereneces);
document.getElementById("arrowLabel").addEventListener("click", setLocation);




function setLocation() { 
    chrome.tabs.create({'url': "/options.html" } )
}

function setPreferences() {
    chrome.storage.sync.get(['thirdPartyJS'], function(result) {
        document.getElementById("blockTPJSToggle").checked = result.thirdPartyJS;
    });

    chrome.storage.sync.get(['blockTPC'], function(result) {
        document.getElementById("blockTPC").checked = result.blockTPC;
    });
    chrome.storage.sync.get(['adblock'], function(result) {
        document.getElementById("adblock").checked = result.adblock;
    });
}


function savePrefereneces() { 
    var thirdpartyJSValue = document.getElementById("blockTPJSToggle").checked;
    chrome.storage.sync.set({thirdPartyJS: thirdpartyJSValue }, function() {
        
    });
    var blockTPCValue = document.getElementById("blockTPC").checked;
    chrome.storage.sync.set({blockTPC: blockTPCValue }, function() {
        
    });
    var adblockValue = document.getElementById("adblock").checked;
    chrome.storage.sync.set({adblock: adblockValue }, function() {
        
    });
    
}

function thirdPartyCookies() { 
    chrome.storage.sync.get(['blockTPC'], function(result) {
        if (result.blockTPC == false) { 
            chrome.privacy.websites.thirdPartyCookiesAllowed.set({ value: true }, function() {});
            document.getElementById("blockTPC").checked = result.blockTPC;
        };

        if (result.blockTPC == true) { 
            chrome.privacy.websites.thirdPartyCookiesAllowed.set({ value: false }, function() {});
            document.getElementById("blockTPC").checked = result.blockTPC;
        };
    });
}






// Check whether new version is installed
chrome.runtime.onInstalled.addListener(function(){
  chrome.tabs.create({'url': "/aboutBarrier.html" } )
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
  
});
  
  
  
  

setPreferences();







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
  
  function removeCookiesForDomain(domain) {
    var timer = new Timer();
    cache.getCookies(domain).forEach(function(cookie) {
      removeCookie(cookie);
    });
  }
  
  
  
  function listener(info) {
    cache.remove(info.cookie);
    if (!info.removed) {
      cache.add(info.cookie);
    }
    scheduleReloadCookieTable();
  }
  
  function startListening() {
    chrome.cookies.onChanged.addListener(listener);
  }
  
  function stopListening() {
    chrome.cookies.onChanged.removeListener(listener);
  }
  
  function onload() {
    focusFilter();
    var timer = new Timer();
    chrome.cookies.getAll({}, function(cookies) {
      startListening();
      start = new Date();
      for (var i in cookies) {
        cache.add(cookies[i]);
      }
      timer.reset();
      reloadCookieTable();
    });
  }
  

function toggleOff22() { 
  

  chrome.storage.local.get(['on3'], function(result) {
  
    if(result.on3 == true) { 
    
      document.getElementById('barriericon').src = 'icon_32off.png'
      chrome.storage.local.set({"on3": false}, function() {});
      
    } else { 
      
      document.getElementById('barriericon').src = 'BarrierIcon.png';
      chrome.storage.local.set({"on3": true}, function() {});
    }
  });
  
 
}

function toggleOff25() { 
  

  chrome.storage.local.get(['on3'], function(result) {
  
    if(result.on3 == true) { 
    
      document.getElementById('barriericon').src = 'BarrierIcon.png'
      
    
    } else { 
      
      document.getElementById('barriericon').src = 'icon_32off.png';
      
    }
  });
  
 
}

toggleOff25()