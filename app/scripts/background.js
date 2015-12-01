var current_id = -1;
var current_urls = {};
var tab_change = false;
var chrome_active = false;
var previous_tab_id = null;
var port = chrome.runtime.connect({name: "productivity_communication"});

////New tab and changes within tab url
//chrome.tabs.onUpdated.addListener(function () {
//  notifyTabChanged()
//});
//
//// Switching tabs
//chrome.tabs.onActivated.addListener(function () {
//  // Send a message to the active tab
//  notifyTabChanged()
//});

// Listener for messages
chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(function (request, sender) {
      var sender = sender.sender;
      console.log(request);
      var sender_tab_id = sender.tab.id;
      var sender_tab_url = urlSanit(sender.tab.url);

      if (request.message === "tab_changed_url") {
        request["tab_id"] = sender_tab_id;
        sendToServer(request, 'extension_api/active_pages/new_page.json')
      } else if (request.message === 'active_status') {
        sendToServer({
          'tab_id': sender_tab_id,
          'previous_tab_id': previous_tab_id
        }, 'extension_api/active_pages/tab_change.json');
        previous_tab_id = sender_tab_id;
      }
      else if (request.message === 'lost_focus') {
        request.params['tab_id'] = sender_tab_id;
        sendToServer(request.params, 'extension_api/active_pages/page_lost_focus.json')
      }
      else if (request.message === 'send_to_server') {
        request.params['tab_id'] = sender_tab_id;
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

function urlSanit(url) {
  return url.split("?")[0].split("#")[0];
}

//// notify content script url has changed
//function notifyTabChanged() {
////     Send a message to the active tab
//  chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
//    if (tabs[0] && current_urls[tabs[0].id] != urlSanit(tabs[0].url)) {
//      var activeTab_id = tabs[0].id;
//      var activeTab_url = urlSanit(tabs[0].url);
//
//      if (current_urls[activeTab_id] == activeTab_url) {
//        console.log('tab change');
//        tab_change = true;
//      } else {
//        console.log('new page');
//        tab_change = false;
//        chrome.tabs.sendMessage(activeTab_id, {
//          "message": "tab_changed",
//          "tab_id": activeTab_id,
//          "previous_tab_id": current_id,
//        });
//      }
//      //console.log(activeTab_id);
//      current_id = activeTab_id;
//      current_urls[activeTab_id] = activeTab_url;
//    }
//  });
//}

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
    url: 'http://vnenk.com/' + action,
    data: JSON.stringify(send_data),
    contentType: "application/json",
    processData: false,
    success: function (msg) {
    }
  });

  //$.post('http://vnenk.com/extension_api/' + action, send_data, function (data) {
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
