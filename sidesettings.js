document.getElementById("DNT").addEventListener("click", savePreferences)
document.getElementById("webRTC").addEventListener("click", savePreferences)
document.getElementById("learnTrackers").addEventListener("click", savePreferences)
document.getElementById("cookieEndDeletion").addEventListener("click", savePreferences)
document.getElementById("siteCookieDeletion").addEventListener("click", savePreferences)
document.getElementById("forceHttps").addEventListener("click", savePreferences)
document.getElementById("disableAllCookies").addEventListener("click", savePreferences)
document.getElementById("disableSearchSuggestions").addEventListener("click", savePreferences)
document.getElementById("disableNetworkPrediction").addEventListener("click", savePreferences)
document.getElementById("disableJavascript").addEventListener("click", savePreferences)
document.getElementById("disableSpellingSuggestion").addEventListener("click", savePreferences)
document.getElementById("IncognitoTrackingBlock").addEventListener("click", savePreferences)
document.getElementById("disableGoogleTranslation").addEventListener("click", savePreferences)
document.getElementById("addToWhitelist").addEventListener("click", whiteList)
document.getElementById("deleteAll").addEventListener("click", deleteURL)



function savePreferences() { 
    var doNotTrackProc = document.getElementById("DNT").checked;

    chrome.storage.local.set({"doNotTrackProc": doNotTrackProc}, function() {
        
    });
    var webRTCProc = document.getElementById("webRTC").checked;
    
    chrome.storage.local.set({"webRTCProc": webRTCProc}, function() {
        
    });
    var learnTrackers = document.getElementById("learnTrackers").checked;
    
    chrome.storage.local.set({"learnTrackers": learnTrackers}, function() {
        
    });
    var cookieEndDeletion = document.getElementById("cookieEndDeletion").checked;
    
    chrome.storage.local.set({"cookieEndDeletion": cookieEndDeletion}, function() {
        
    });
    var siteCookieDeletion = document.getElementById("siteCookieDeletion").checked;
    
    chrome.storage.local.set({"siteCookieDeletion": siteCookieDeletion}, function() {
        
    });
    var IncognitoTrackingBlock = document.getElementById("IncognitoTrackingBlock").checked;
    
    chrome.storage.local.set({"IncognitoTrackingBlock": IncognitoTrackingBlock}, function() {
        
    });
    var forceHttps = document.getElementById("forceHttps").checked;
    
    chrome.storage.local.set({"forceHttps": forceHttps}, function() {
        
    });
    var disableAllCookies = document.getElementById("disableAllCookies").checked;
    
    chrome.storage.local.set({"disableAllCookies": disableAllCookies}, function() {
        
    });
    var disableSearchSuggestions = document.getElementById("disableSearchSuggestions").checked;
    
    chrome.storage.local.set({"disableSearchSuggestions": disableSearchSuggestions}, function() {
        
    });
    var disableJavascript = document.getElementById("disableJavascript").checked;
    
    chrome.storage.local.set({"disableJavascript": disableJavascript}, function() {
        
    });
    var disableNetworkPrediction = document.getElementById("disableNetworkPrediction").checked;
    
    chrome.storage.local.set({"disableNetworkPrediction": disableNetworkPrediction}, function() {
        
    });
    var disableSpellingSuggestion = document.getElementById("disableSpellingSuggestion").checked;
    
    chrome.storage.local.set({"disableSpellingSuggestion": disableSpellingSuggestion}, function() {
        
    });
    var disableGoogleTranslation = document.getElementById("disableGoogleTranslation").checked;
    
    chrome.storage.local.set({"disableGoogleTranslation": disableGoogleTranslation}, function() {
        
    });
    activateSideSettings()
}







function setPreferences() { 
    chrome.storage.local.get(['doNotTrackProc'], function(result) {
        document.getElementById("DNT").checked = result.doNotTrackProc;
    });
    chrome.storage.local.get(['webRTCProc'], function(result) {
        document.getElementById("webRTC").checked = result.webRTCProc;
    });
    chrome.storage.local.get(['learnTrackers'], function(result) {
        document.getElementById("learnTrackers").checked = result.learnTrackers;
    });
    chrome.storage.local.get(['cookieEndDeletion'], function(result) {
        document.getElementById("cookieEndDeletion").checked = result.cookieEndDeletion;
    });
    chrome.storage.local.get(['siteCookieDeletion'], function(result) {
        document.getElementById("siteCookieDeletion").checked = result.siteCookieDeletion;
    });
    chrome.storage.local.get(['IncognitoTrackingBlock'], function(result) {
        document.getElementById("IncognitoTrackingBlock").checked = result.IncognitoTrackingBlock;
    });
    chrome.storage.local.get(['forceHttps'], function(result) {
        document.getElementById("forceHttps").checked = result.forceHttps;
    });
    chrome.storage.local.get(['disableAllCookies'], function(result) {
        document.getElementById("disableAllCookies").checked = result.disableAllCookies;
    });
    chrome.storage.local.get(['disableSearchSuggestions'], function(result) {
        document.getElementById("disableSearchSuggestions").checked = result.disableSearchSuggestions;
    });
    chrome.storage.local.get(['disableNetworkPrediction'], function(result) {
        document.getElementById("disableNetworkPrediction").checked = result.disableNetworkPrediction;
    });
    chrome.storage.local.get(['disableJavascript'], function(result) {
        document.getElementById("disableJavascript").checked = result.disableJavascript;
    });
    chrome.storage.local.get(['disableSpellingSuggestion'], function(result) {
        document.getElementById("disableSpellingSuggestion").checked = result.disableSpellingSuggestion;
    });
    chrome.storage.local.get(['disableGoogleTranslation'], function(result) {
        document.getElementById("disableGoogleTranslation").checked = result.disableGoogleTranslation;
    });
}

setPreferences();



function activateSideSettings() { 
    chrome.storage.local.get(['doNotTrackProc'], function(result) {
       if(result.doNotTrackProc == true) { 
        chrome.privacy.websites.doNotTrackEnabled.set({ value: true }, function() {});
       }
       if(result.doNotTrackProc == false) { 
        chrome.privacy.websites.doNotTrackEnabled.set({ value: false }, function() {});
       } 
    });
    chrome.storage.local.get(['webRTCProc'], function(result) {

        if(result.webRTCProc == true) {
        chrome.privacy.network.webRTCMultipleRoutesEnabled.set({ value: false }, function() {});
        }

        if(result.webRTCProc == false) {
            chrome.privacy.network.webRTCMultipleRoutesEnabled.set({ value: true }, function() {});
        }
    });
    chrome.storage.local.get(['disableSpellingSuggestion'], function(result) {
       if(result.disableSpellingSuggestion == true) { 
        chrome.privacy.services.spellingServiceEnabled.set({ value: false }, function() {
        
        });
       }
       if(result.disableSpellingSuggestion == false) { 
        chrome.privacy.services.spellingServiceEnabled.set({ value: true }, function() {
        
        });
       }
    });
    chrome.storage.local.get(['disableSearchSuggestions'], function(result) {
        if(result.disableSearchSuggestions==true) { 
            chrome.privacy.services.searchSuggestEnabled.set({ value: false }, function() {});
        }
        if(result.disableSearchSuggestions==false) { 
            chrome.privacy.services.searchSuggestEnabled.set({ value: true }, function() {});
        }
    });
    chrome.storage.local.get(['disableNetworkPrediction'], function(result) {
        if(result.disableNetworkPrediction==true) { 
            chrome.privacy.network.networkPredictionEnabled.set({ value: false }, function() {});
        }
        if(result.disableNetworkPrediction==false) { 
            chrome.privacy.network.networkPredictionEnabled.set({ value: false }, function() {});
        }
    });
    chrome.storage.local.get(['disableGoogleTranslatio'], function(result) {
        if(result.disableGoogleTranslatio==true) { 
            chrome.privacy.services.translationServiceEnabled.set({ value: false }, function() {});
        }
        if(result.disableGoogleTranslatio==false) { 
            chrome.privacy.services.translationServiceEnabled.set({ value: false }, function() {});
        }
    });
    

}



chrome.storage.onChanged.addListener(function(changes, namespace) {
   activateSideSettings(); 		
});


function whiteList() { 
    var newURL = document.getElementById('whiteListBox').value
    
    document.getElementById('whiteListURLS').innerHTML += '<br><p>' + newURL + '</p>';
}

function deleteURL() { 
    document.getElementById('whiteListURLS').innerHTML = " ";
}


    
