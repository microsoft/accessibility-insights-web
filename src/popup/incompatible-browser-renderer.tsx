// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { title } from 'content/strings/application';
import * as React from 'react';
import * as ReactDOMClient from 'react-dom/client';

import { NewTabLink } from '../common/components/new-tab-link';
import { Header } from './components/header';

export class IncompatibleBrowserRenderer {
    constructor(
        private readonly createRoot: typeof ReactDOMClient.createRoot,
        private readonly dom: Document,
    ) {}

    public render(): void {
        const container = this.dom.querySelector('#popup-container') as Element;
        const root = this.createRoot(container);
        root.render(
            <>
                <div className="ms-Fabric unsupported-browser-info-panel">
                    <Header title={title} />
                    <div className="main-section">
                        <div className="popup-grid">
                            <div className="launch-panel-general-container">
                                Thanks for your interest in Accessibility Insights!
                                <div className="incompatible-browser-message">
                                    We don’t currently support your browser.
                                    <br />
                                    Please check
                                    <NewTabLink href="https://accessibilityinsights.io/">
                                        accessibilityinsights.io
                                    </NewTabLink>
                                    for download options.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>,
        );
    }
}
