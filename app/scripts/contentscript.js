chrome.runtime.onMessage.addListener(
    function (request) {
        var currentUrl = $(location).attr('href');
        if (request.message === "tab_changed" && currentUrl != request.previous_url) {
            var title = $(document).find("title").text();
            var headers = joinDivsText($('h1'));
            var meta_description = $("meta[property='og:description']").attr("content") || $("meta[name='description']").attr("content")

            var corpus = joinDivsText(getTextNodesIn('div'));
            var tfidf = analyze_web_text(corpus);
            var referrer =  document.referrer;

            console.log('change 3 ' + currentUrl);
            chrome.runtime.sendMessage({
                "message": "tab_changed_url",
                "url": currentUrl,
                "tfidf": tfidf,
                "title": title,
                "headers": headers,
                "tab_id": request.tab_id,
                "previous_tab_id": request.previous_tab_id,
                "previous_url": request.previous_url,
                "referrer ": referrer ,
                "meta_description": meta_description
            });
            console.log('change 2 ' + currentUrl);

        } else if (request.message === 'active_status') {
            chrome.runtime.sendMessage({
                message: 'active_status',
                active: document.hasFocus()
            });
        }
    }
);

function joinDivsText(divs) {
    return $.map(
        divs,
        function (element) {
            return $(element).text()
        }
    ).join(" ");
}