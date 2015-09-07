var up_scroll_count = 0;
var down_scroll_count = 0;
var active_since = Date.now();

var port = chrome.runtime.connect({name: "productivity_communication"});

chrome.runtime.onMessage.addListener(
  function (request) {
    var currentUrl = $(location).attr('href');
    if (request.message === "tab_changed" && currentUrl != request.previous_url) {
      var title = $(document).find("title").text();
      var headers = divsText($('h1'));
      var meta_description = $("meta[property='og:description']").attr("content") || $("meta[name='description']").attr("content")

      var corpus = joinDivsText(getTextNodesIn('div :visible'));
      var tfidf = analyze_web_text(corpus);

      var referrer = document.referrer;

      console.log('change 3 ' + currentUrl);
      port.postMessage({
        "message": "tab_changed_url",
        "url": urlSanit(currentUrl),
        "tfidf": tfidf,
        "title": title,
        "headers": headers,
        "tab_id": request.tab_id,
        "previous_tab_id": request.previous_tab_id,
        "previous_url": request.previous_url,
        "referrer": referrer,
        "meta_description": meta_description
      });
      console.log('change 2 ' + currentUrl);

    } else if (request.message === 'active_status') {
      port.postMessage({
        message: 'active_status',
        active: document.hasFocus()
      });
    }
  }
);

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


function page_info() {
  var title = $(document).find("title").text();
  var headers = joinDivsText($('h1'));
  var meta_description = $("meta[property='og:description']").attr("content") || $("meta[name='description']").attr("content")

  var corpus = joinDivsText(getTextNodesIn('div'));
  var tfidf = analyze_web_text(corpus);

  var referrer = document.referrer;

  return ( {
    "title": title,
    "tfidf": tfidf,
    "headers": headers,
    "meta_description": meta_description,
    "referrer": referrer
  } );
}

function current_state() {
  var currentUrl = $(location).attr('href');
  var active_length = (Date.now() - active_since) / 1000;
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
  active_since = Date.now();
  up_scroll_count = 0;
  down_scroll_count = 0;

  port.postMessage({
    message: 'active_status',
    active: true
  });
}

function focusLost() {
  var params = current_state();
  //if (params['active_length'] >= 4) {
    port.postMessage({
      "message": "lost_focus",
      "params": params
    });
  //}

}

$(window).on('blur', function () {
  console.log( 'focus out');
  focusLost();
});

$(window).on('unload', function () {
  focusLost();
});


$(window).on('focus', function () {
  console.log( 'focus in');
  focusGained();
});


var scrollPos = 0;
$(window).scroll(function(){
  var scrollPosCur = $(this).scrollTop();
  if (scrollPosCur > scrollPos) {
    down_scroll_count += 1;
  } else {
    up_scroll_count += 1;
  }
  scrollPos = scrollPosCur;
})