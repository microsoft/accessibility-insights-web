// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export type QuerySelectable = Pick<Document, 'querySelector'>;

export class IframeDetector {
    constructor(private document: QuerySelectable) {}

    public hasIframes = () => this.document.querySelector('iframe') != null;
}
