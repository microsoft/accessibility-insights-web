// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export class XmlHttpRequestStubBuilder {
    public static build(): XMLHttpRequest {
        const request: XMLHttpRequest = {
            timeout: 0,
            onload: null,
            onerror: null,
            ontimeout: null,
            send: () => {},
            open: (() => {}) as any,
            setRequestHeader: (header, value) => {},
            addEventListener: (theType, listener) => {},
            responseText: null,
        } as XMLHttpRequest;

        return request;
    }
}
