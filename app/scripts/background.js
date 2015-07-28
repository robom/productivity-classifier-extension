//New tab and changes within tab url
chrome.tabs.onUpdated.addListener(function() {
    notifyTabChanged()
});

// Switching tabs
chrome.tabs.onActivated.addListener(function() {
    // Send a message to the active tab
    notifyTabChanged()
});

// Listener for messages
chrome.runtime.onMessage.addListener(
    function(request) {
        if( request.message === "tab_changed_url" ) {
            console.log(request.url);
            sendToServer({"new_url": request.url}, 'tab_changed')
        }
    }
);

// notify content script url has changed
function notifyTabChanged() {
//     Send a message to the active tab
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {"message": "tab_changed"});
    });
}

// send data to server action
function sendToServer(send_data, action){
    $.post('http://localhost:3000/extension_api/' + action, send_data, function(data){

    });
}
