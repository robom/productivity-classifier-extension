var current_id = -1;
var current_urls = {};
var current_url = '';
var chrome_active = false;

//New tab and changes within tab url
chrome.tabs.onUpdated.addListener(function () {
    notifyTabChanged()
});

// Switching tabs
chrome.tabs.onActivated.addListener(function () {
    // Send a message to the active tab
    notifyTabChanged()
});

// Listener for messages
chrome.runtime.onMessage.addListener(
    function (request) {
        if (request.message === "tab_changed_url") {
            if (current_url != request.url) {
                current_url = request.url;
                sendToServer(request, 'active_page/new_page')
            }
        } else if (request.message === 'active_status') {
            if (request.active && !chrome_active) {
                sendToServer({}, 'chrome_activated');
                chrome_active = true;
            }else if(!request.active && chrome_active){
                sendToServer({}, 'chrome_closed');
                chrome_active = false;
            }
        }
    }
);


// notify content script url has changed
function notifyTabChanged() {
//     Send a message to the active tab
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        var activeTab = tabs[0];
        if (current_url != activeTab.url) {
            if (current_id != activeTab.id && current_urls[activeTab.id] == activeTab.url) {
                sendToServer({tab_id: activeTab.id}, 'tab_change');
                current_url = activeTab.url
            } else {
                chrome.tabs.sendMessage(activeTab.id, {
                    "message": "tab_changed",
                    "tab_id": activeTab.id,
                    "previous_tab_id": current_id,
                    "previous_url": current_url
                });
            }
            console.log(activeTab.id)
            current_id = activeTab.id;
            current_urls[activeTab.id] = activeTab.url;
        }
    });
}

// send data to server action
function sendToServer(send_data, action) {
    $.post('http://localhost:3000/extension_api/' + action, send_data, function (data) {

    });
}

chrome.alarms.create('active-window', {'periodInMinutes': 0.1});
chrome.alarms.onAlarm.addListener(function (alarm) {
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
        if (!tabs[0] && chrome_active == true) {
            sendToServer({}, 'chrome_closed');
            chrome_active = false;
        } else if (tabs[0]) {
            chrome.tabs.sendMessage(tabs[0].id, {
                "message": "active_status"
            });
        }
    });
});
