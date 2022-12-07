// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const request = require('request');
const http = require('http');

// This script is used to generate new chrome web store access tokens and refresh tokens from the
// chrome web store API (see docs: https://developer.chrome.com/docs/webstore/using_webstore_api/).
// Before running this script, be sure to updated the following variables with the appropriate
// client ID and secret values.
const clientId = 'TODO';
const clientSecret = 'TODO';

const host = 'localhost';
const port = 8000;
const scope = 'https://www.googleapis.com/auth/chromewebstore';

const constructAccessTokenUrl = function () {
    return `https://accounts.google.com/o/oauth2/v2/auth?scope=${scope}&response_type=code&redirect_uri=http%3A//${host}%3A${post}&client_id=${clientId}`;
};

const fetchRefreshToken = function (accessToken) {
    var body =
        'grant_type=authorization_code&code=' +
        accessToken +
        '&redirect_uri=http%3A//' +
        host +
        '%3A' +
        scope +
        '&client_id=' +
        clientId +
        '&client_secret=' +
        clientSecret;
    request.post(
        {
            url: 'https://accounts.google.com/o/oauth2/token',
            form: body,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        },
        function (_err, _httpResponse, body) {
            console.log('Refresh token: ' + JSON.parse(body).refresh_token);
        },
    );
};

const requestListener = function (req, res) {
    if (req.headers.referer) {
        // Parse access token
        const url = new URL(req.headers.referer);
        const params = new Proxy(new URLSearchParams(url.search), {
            get: (searchParams, prop) => searchParams.get(prop),
        });
        console.log('Access token: ' + params.code);
        fetchRefreshToken(params.code);
    }
    res.writeHead(200);
    res.end('See terminal for access token');
};

// Start a server to receive the access token once authentication is completed. This is necessary
// since OOB has been deprecated (https://developers.googleblog.com/2022/02/making-oauth-flows-safer.html#disallowed-oob).
const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
    console.log(
        `Get access token by opening the following URL in a browser: ${constructAccessTokenUrl()}`,
    );
});
