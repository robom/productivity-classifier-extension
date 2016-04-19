var DEBUG = false;

var tokens = {};
tokens.asq_browser_token = "ASQ-br0wseR_30126";
tokens.asq_aoi_token = "ASQ-a01_30126";

var current_id = -1;
var current_urls = {};
var tab_change = false;
var chrome_active = false;
var previous_tab_id = null;
var port = chrome.runtime.connect({name: "browser_events"});

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
      DEBUG && console.log(request);
      var sender_tab_id = sender.tab.id;
      var sender_tab_url = urlSanit(sender.tab.url);

      if (request.message === "element_xpath") {
          request["tab_id"] = sender_tab_id;
          request["tab_url"] = sender_tab_url;

          sendAoiEvent(request);
      } else if (request.message === "tab_changed_url") {
          request["tab_id"] = sender_tab_id;
          //sendToServer(request, 'extension_api/active_pages/new_page.json')
        sendBrowserEvent(request);
      } else if (request.message === 'active_status') {
          request["tab_id"] = sender_tab_id;
          request["previous_tab_id"] = previous_tab_id;
        //sendToServer({
        //  'tab_id': sender_tab_id,
        //  'previous_tab_id': previous_tab_id
        //}, 'extension_api/active_pages/tab_change.json');
          sendBrowserEvent(request);
          previous_tab_id = sender_tab_id;
      }
      else if (request.message === 'lost_focus' || request.message === 'unload') {
        request.params['tab_id'] = sender_tab_id;
        //sendToServer(request.params, 'extension_api/active_pages/page_lost_focus.json')
        sendBrowserEvent(request);
      }
      else if (request.message === 'send_to_server') {
        request.params['tab_id'] = sender_tab_id;
        //sendToServer(request.params, 'extension_api/' + request.action)
        sendBrowserEvent(request);
      }     
    }
  )
  ;
});

function actual_viewing_tab(callback) {
  chrome.tabs.query({active: true, currentWindow: true}, function (arrayOfTabs) {
    callback(arrayOfTabs[0]);
  });
}

function urlSanit(url) {
  // return url.split("?")[0].split("#")[0];
  return url;  
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
    //url: 'http://localhost:3000/' + action,
    data: JSON.stringify(send_data),
    contentType: "application/json",
    processData: false,
    success: function (msg) {
    }
  });

}

function sendBrowserEvent(event) {
    sendToUxr(event, tokens.asq_browser_token);
}

function sendAoiEvent(event) {
    sendToUxr(event, tokens.asq_aoi_token);
}

function sendToUxr(data, token) {
  if (data === null)
    return;
  
    DEBUG && console.log('----------- SENDING TO UXR ------------------');
    DEBUG && console.log(data);
    DEBUG && console.log(JSON.stringify(data));
    DEBUG && console.log('^^^^^^^^^^^ SENDING TO UXR ^^^^^^^^^^^^^^^^^^');
  
	$.ajax({
		type : "POST",
		url : "http://localhost:55555/api/UXS/SendEvent",
		data : {
			"Token" : token,
			"Value" : JSON.stringify(data),
			"ValidFrom" : new Date().toISOString() 
		},
		dataType : 'json',
		success : function(response) {
			DEBUG && console.log(response);
		},
		error : function(error) {
			DEBUG && console.log(error.statusText);
		}
	});
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
