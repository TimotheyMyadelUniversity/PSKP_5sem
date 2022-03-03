export function onHttpError(request, response, code, message) {
    response.writeHead(code, {'Content-Type': 'application/json; charset=utf-8'});
    response.end(`{"error": "${code}", "message": "${message}"}`);
}

export function isJsonContentType(hs) {
    isJson(hs, 'content-type', 'application/json');
}

export function isJsonAccept(hs) {
    isJson(hs, 'accept', 'application/json');
}

function isJson(headers, header, mime) {
    let rc = false;
    let h = headers[header];
    if (h) {
        rc = h.indexOf(mime) >= 0;
    }
    return rc;
}