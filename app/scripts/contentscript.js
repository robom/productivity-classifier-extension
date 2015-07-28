chrome.runtime.onMessage.addListener(
    function (request) {
        if( request.message === "tab_changed" ) {
            var currentUrl = $(location).attr('href');
            chrome.runtime.sendMessage({"message": "tab_changed_url", "url": currentUrl});
        }
    }
);