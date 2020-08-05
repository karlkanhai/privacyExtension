

var status = null;
var enabledOrNoT = null;
//check if process is enabled
function toggleScriptBlocker() { 
    if(enabledOrNoT == true) { 
        status=true;
    } else 
        status = false;

}

//intialize a blank function
function needsToBeBlacklisted (x,y) { 

}

const observer = new MutationObserver(mutations => {
    mutations.forEach(({ addedNodes }) => {
        addedNodes.forEach(node => {
            // For each added script tag
            if(node.nodeType === 1 && node.tagName === 'SCRIPT') {
                const src = node.src || 'https://www.google.com'
                const type = node.type
                // If the src is inside your blacklist
                if(needsToBeBlacklisted(src, type)) {
                    if(status == true) { 
                        // Assume that this code is executed inside the mutation observer callback:
                        addedNodes.forEach(node => {
                        // See above for script tag checks…

                        // Blocks the script tag execution in Safari, Chrome, Edge & IE
                        node.type = 'javascript/blocked'

                        // Unnecessary, but cleaner: remove the node from the DOM
                        node.parentElement.removeChild(node)

            })}



                   
                }
            }
        })
    })
})

// Starts the monitoring
observer.observe(document.documentElement, {
    childList: true,
    subtree: true
})


chrome.runtime.sendMessage({method: "getLocalStorage", key: "thirdPartyJS"}, function(response) {
  enabledOrNoT= response.data; 
  
});



    
chrome.runtime.sendMessage({method: "clearCookies", key: true}, function(response) {
    
        
});
    