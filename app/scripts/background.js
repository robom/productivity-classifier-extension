var current_id = -1;
var current_urls = {};
var current_url = '';
var tab_change = false;
var chrome_active = false;
var chrome_active_switch = false;

var port = chrome.runtime.connect({name: "productivity_communication"});

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
chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(function (request, sender) {
      var sender = sender.sender;
      console.log(request);
      var sender_tab_id = sender.tab.id;
      var sender_tab_url = sender.tab.url;

      if (request.message === "tab_changed_url") {
        if (!tab_change) {
          current_url = request.url;
          tab_change = true;
          sendToServer(request, 'extension_api/active_pages/new_page.json')
        }
      } else if (request.message === 'active_status') {
        if (request.active && !chrome_active) {
          chrome_active = true;
          setTimeout(function () {
            actual_viewing_tab(function (current_tab) {
              if (!chrome_active_switch && chrome_active && current_tab && current_tab.id === sender_tab_id && current_tab.url == sender_tab_url) {
                chrome_active_switch = true;
                sendToServer({'tab_id': sender.tab.id}, 'extension_api/active_pages/chrome_activated.json');
              }
            });
          }, 4000);
        }
      } else if (request.message === 'lost_focus') {
        chrome_active = false;

        setTimeout(function () {
          actual_viewing_tab(function (current_tab) {
            if (chrome_active_switch && (!chrome_active || !current_tab || current_tab.id != sender_tab_id || current_tab.url != sender_tab_url)) {
              if (!chrome_active)
                chrome_active_switch = false;
              request.params['tab_id'] = sender_tab_id;
              sendToServer(request.params, 'extension_api/active_pages/page_lost_focus.json')
            }
          });
        }, 4000)
      }
      else if (request.message === 'send_to_server') {
        request.params['tab_id'] = sender.tab.id;
        sendToServer(request.params, 'extension_api/' + request.action)
      }

    }
  )
  ;
})
;
function actual_viewing_tab(callback) {
  chrome.tabs.query({active: true, currentWindow: true}, function (arrayOfTabs) {
    callback(arrayOfTabs[0]);
  });
}

// notify content script url has changed
function notifyTabChanged() {
//     Send a message to the active tab
  chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    if (tabs[0] && current_url != tabs[0].url) {
      var activeTab_id = tabs[0].id;
      var activeTab_url = tabs[0].url;
      chrome_active_switch = true;

      setTimeout(function () {
        actual_viewing_tab(function (current_tab) {
          //console.log(current_tab);
          if (current_tab && current_tab.id === activeTab_id && current_tab.url == activeTab_url) {

            if (current_id != activeTab_id && current_urls[activeTab_id] == activeTab_url) {
              sendToServer({tab_id: activeTab_id}, 'extension_api/active_pages/tab_change');
              current_url = activeTab_url;
              tab_change = true;
            } else {
              tab_change = false;
              chrome.tabs.sendMessage(activeTab_id, {
                "message": "tab_changed",
                "tab_id": activeTab_id,
                "previous_tab_id": current_id,
                "previous_url": current_url
              });
            }
            //console.log(activeTab_id);
            current_id = activeTab_id;
            current_urls[activeTab_id] = activeTab_url;
          }
        });
      }, 4000);
    }
  });
}

function token() {
  if (localStorage['ngStorage-token']) {
    return "Bearer " + localStorage['ngStorage-token'].replace(/"/g, "")
  } else {
    return null
  }
}

// send data to server action
function sendToServer(send_data, action) {
  $.ajax({
    type: "POST",
    beforeSend: function (request) {
      if (token !== 'Bearer ') {
        request.setRequestHeader("Authorization", token());
      }
    },
    url: 'http://localhost:3000/' + action,
    data: JSON.stringify(send_data),
    contentType: "application/json",
    processData: false,
    success: function (msg) {
    }
  });

  //$.post('http://localhost:3000/extension_api/' + action, send_data, function (data) {
  //
  //});
}

//chrome.alarms.create('active-window', {'periodInMinutes': 0.1});
//chrome.alarms.onAlarm.addListener(function (alarm) {
//  chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
//    if (!tabs[0] && chrome_active == true) {
//      chrome_active = false;
//    } else if (tabs[0]) {
//      chrome.tabs.sendMessage(tabs[0].id, {
//        "message": "active_status"
//      });
//    }
//  });
//});
