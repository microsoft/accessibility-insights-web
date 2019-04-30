// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import ReactDOM from 'react-dom';

import { title } from '../content/strings/application';
import { Header } from './components/header';
import { NewTabLink } from '../common/components/new-tab-link';

export class IncompatibleBrowserRenderer {
    constructor(private readonly renderer: typeof ReactDOM.render, private readonly dom: NodeSelector & Node) {}

    public render(): void {
        const container = this.dom.querySelector('#popup-container');

        this.renderer(
            <>
                <div className="ms-Fabric unsupported-browser-info-panel">
                    <Header title={title} />
                    <div className="ms-Grid main-section">
                        <div className="launch-panel-general-container">
                            Thanks for your interest in Accessibility Insights!
                            <div className="some-class">
                                We don’t currently support your browser.
                                <br />
                                Please check <NewTabLink href="https://accessibilityinsights.io/">accessibilityinsights.io</NewTabLink> for
                                download options.
                            </div>
                        </div>
                    </div>
                </div>
            </>,
            container,
        );
    }
}
