// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import ReactDOM from 'react-dom';

import { title } from '../content/strings/application';
import { Header } from './components/header';

export class IncompatibleBrowserRenderer {
    constructor(private readonly renderer: typeof ReactDOM.render, private readonly dom: NodeSelector & Node) {}

    public render(): void {
        const container = this.dom.querySelector('#popup-container');

        this.renderer(
            <>
                <div className="ms-Fabric unsupported-url-info-panel">
                    <Header title={title} />
                    <div className="ms-Grid main-section">
                        <div className="launch-panel-general-container">This application is not supported in the current browser.</div>
                    </div>
                </div>
            </>,
            container,
        );
    }
}
