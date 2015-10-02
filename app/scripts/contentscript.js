var up_scroll_count = 0;
var down_scroll_count = 0;
var active_timer = new clsStopwatch();
active_timer.start();
var is_active = false;
var is_fully_active = false;
var top_words = null;
var sent_description = false;

var port = chrome.runtime.connect({name: "productivity_communication"});

chrome.runtime.onMessage.addListener(
  function (request) {
    //var currentUrl = $(location).attr('href');
    //if (request.message === "tab_changed") {
    //
    //}
  }
);

function sendNewPageData() {
  var currentUrl = $(location).attr('href');
  var title = $(document).find("title").text();
  var headers = divsText($('h1'));
  var meta_description = $("meta[property='og:description']").attr("content") || $("meta[name='description']").attr("content");

  if (!top_words) {
    var corpus = joinDivsText(getTextNodesIn('div :visible'));
    top_words = analyze_web_text(corpus);
  }

  var referrer = document.referrer;
  console.log('tab_changed_url');
  port.postMessage({
    "message": "tab_changed_url",
    "url": urlSanit(currentUrl),
    "tfidf": top_words,
    "title": title,
    "headers": headers,
    "referrer": referrer,
    "meta_description": meta_description
  });
  sent_description = true;
}


function joinDivsText(divs) {
  return divsText(divs).join(" ");
}

function divsText(divs) {
  return $.map(
    divs,
    function (element) {
      return $(element).text()
    }
  );
}

function current_state() {
  var currentUrl = $(location).attr('href');
  var active_length = active_timer.time() / 1000;
  return ({
    "url": urlSanit(currentUrl),
    "up_scroll_count": up_scroll_count,
    "down_scroll_count": down_scroll_count,
    "active_length": active_length
  })
}

function urlSanit(url) {
  return url.split("?")[0].split("#")[0];
}

function focusGained() {
  active_timer.start();
  is_active = true;
  smoothFocusGain();
}

function smoothFocusGain() {
  setTimeout(function () {
    if (is_active && !is_fully_active) {
      is_fully_active = true;
      if (sent_description) {
        sendFocusGained();
      } else {
        sendNewPageData();
      }
    }
  }, 4000);
}

function sendFocusGained() {
  //var currentUrl = $(location).attr('href');
  port.postMessage({
    //url: urlSanit(currentUrl),
    message: 'active_status',
    active: true
  });
}

function focusLost() {
  is_active = false;
  active_timer.removeAfk();
  var params = current_state();
  smoothFocusLost(params);
  active_timer.stop();
}

function smoothFocusLost(params) {
  setTimeout(function () {
    if (!is_active && is_fully_active) {
      is_fully_active = false;
      sendFocusLost(params);
      up_scroll_count = 0;
      down_scroll_count = 0;
      active_timer.reset();
    }
  }, 4000);
}

function sendFocusLost(params) {
  port.postMessage({
    "message": "lost_focus",
    "params": params
  });
}

$(window).on('blur', function () {
  focusLost();
});

$(window).on('unload', function () {
  focusLost();
});


$(window).on('focus', function () {
  focusGained();
});


var scrollPos = 0;
$(window).scroll(function () {
  active_timer.removeAfk();
  var scrollPosCur = $(this).scrollTop();
  if (scrollPosCur > scrollPos) {
    down_scroll_count += 1;
  } else {
    up_scroll_count += 1;
  }
  scrollPos = scrollPosCur;
  active_timer.ping();
});

$(window).keypress(function () {
  active_timer.removeAfk();
  active_timer.ping();
});

if (document.hasFocus()) {
  sendNewPageData();
}else{
  if (!top_words) {
    var corpus = joinDivsText(getTextNodesIn('div :visible'));
    top_words = analyze_web_text(corpus);
  }
}

