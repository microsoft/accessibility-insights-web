// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { NewTabLink } from 'common/components/new-tab-link';
import { DisplayableStrings } from 'common/constants/displayable-strings';
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';

export type FileUrlUnsupportedMessagePanelDeps = {
    browserAdapter: BrowserAdapter;
};

export type FileUrlUnsupportedMessagePanelProps = {
    deps: FileUrlUnsupportedMessagePanelDeps;
    header: JSX.Element;
    title: string;
};

export const FileUrlUnsupportedMessagePanel = NamedFC<FileUrlUnsupportedMessagePanelProps>(
    'FileUrlUnsupportedMessagePanel',
    ({ deps, header, title }) => {
        const { browserAdapter } = deps;

        const openExtensionPage = async () => {
            await browserAdapter.createActiveTab(browserAdapter.getManageExtensionUrl());
        };

        return (
            <div className="unsupported-url-info-panel">
                {header}
                <div className="main-section">
                    <div className="popup-grid">
                        <div className="launch-panel-general-container">
                            {DisplayableStrings.fileUrlDoesNotHaveAccess}
                        </div>
                        <div>
                            <div>To allow this extension to run on file URLs:</div>
                            <div>
                                {'1. Open '}
                                <NewTabLink
                                    // It's important that we use an onClick handler that invokes
                                    // createActiveTab, rather than just setting href.
                                    // The browser will allow the former but not the latter.
                                    onClick={openExtensionPage}
                                    aria-label={`open ${title} extension page`}
                                >
                                    {`${title} extension page`}
                                </NewTabLink>
                                {'.'}
                            </div>
                            <div>
                                {'2. Enable '}
                                <strong>Allow Access to file URLs</strong>.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    },
);
