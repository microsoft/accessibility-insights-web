// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import * as ReactDOM from 'react-dom';

export class AndroidConnectRenderer {
    constructor(private readonly renderer: typeof ReactDOM.render, private readonly dom: ParentNode) {}

    public render(): void {
        const androidConnectContainer = this.dom.querySelector('#android-connect-container');
        this.renderer(
            <>
                <h1>Hello, Android</h1>
            </>,
            androidConnectContainer,
        );
    }
}
