function getEyeCoordinates() {
    $.ajax({
        type: "GET",
        url: "https://localhost.konopka.sk:55554/api/Buffer/GetDeviceLastData?device=ET",
        dataType: 'json',
        success: function (response) {
            console.log(response);

            if (response.LastData === null || response.LastData === undefined)
                return;

            var xpath = getElementXpathFromPosition(response.LastData);

            console.log(xpath);
            //if (elemId != "NA") {
            //    sendEvent(elemId);
            //}
        },
        error: function (error) {
            console.log(error.statusText);
        }
    });
}

function getElementXpathFromPosition(trackerData) {
    var coords = getEyePosition(trackerData);

    if (coords === null)
        return null;

    var x = coords.centerx;
    var y = coords.centery;

    if (!isLookingInBrowser(x, y))
        return "OutOfBounds";

    return Xpath.getElementXPath(document.elementFromPoint(x, y));
}

function getEyePosition(trackerData) {
    var leftEye = getScreenCoordinates(trackerData.LeftGazePoint2D);
    var rightEye = getScreenCoordinates(trackerData.RightGazePoint2D);

    var lx = leftEye.x;
    var ly = leftEye.y;

    var rx = rightEye.x;
    var ry = rightEye.y;

    var gd_lval = trackerData.LeftValidity;
    var gd_rval = trackerData.RightValidity;

    var centerx = null;
    var centery = null;

    if (gd_lval < 2 && gd_rval < 2) {
        centerx = (lx + rx) / 2;
        centery = (ly + ry) / 2;
    }
    else {
        if (gd_lval < 2) {
            centerx = lx;
            centery = ly;
        }
        else if (gd_rval < 2) {
            centerx = rx;
            centery = ry;
        }
        else
            return null;
    }

    return {
        centerx: centerx,
        centery: centery
    }
}

function getScreenCoordinates(eye) {
    var offx = screenX + (window.outerWidth - window.innerWidth);
    var offy = screenY + (window.outerHeight - window.innerHeight);

    var x = Math.round(screen.width * eye.X) - offx;
    var y = Math.round(screen.height * eye.Y) - offy;

    return {
        x: x,
        y: y
    }
}

function isLookingInBrowser(x, y) {
    var xnormal = x / window.innerWidth;
    var ynormal = y / window.innerHeight;

    return !(xnormal > 1 || xnormal < 0 || ynormal > 1 || ynormal < 0);
}