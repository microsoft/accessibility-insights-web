// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { BrowserAdapter } from '../../common/browser-adapters/browser-adapter';
import { NewTabLink } from '../../common/components/new-tab-link';
import { DisplayableStrings } from '../../common/constants/displayable-strings';
import { NamedSFC } from '../../common/react/named-sfc';

export type FileUrlUnsupportedMessagePanelDeps = {
    browserAdapter: BrowserAdapter;
};
export type FileUrlUnsupportedMessagePanelProps = {
    deps: FileUrlUnsupportedMessagePanelDeps;
    header: JSX.Element;
    title: string;
};

export const FileUrlUnsupportedMessagePanel = NamedSFC<FileUrlUnsupportedMessagePanelProps>(
    'FileUrlUnsupportedMessagePanel',
    ({ deps, header, title }) => {
        const { browserAdapter } = deps;

        const openExtensionPage = () => {
            browserAdapter.createTab(browserAdapter.getManageExtensionUrl());
        };

        return (
            <div className="ms-Fabric unsupported-url-info-panel">
                {header}
                <div className="ms-Grid main-section">
                    <div className="launch-panel-general-container">{DisplayableStrings.fileUrlDoesNotHaveAccess}</div>
                    <div>
                        <div>To allow this extension to run on file URLs:</div>
                        <div>
                            {'1. Open '}
                            <NewTabLink onClick={openExtensionPage} aria-label={`open ${title} extension page`}>
                                {`${title} extension page`}
                            </NewTabLink>
                            {'.'}
                        </div>
                        <div>
                            {'2. Enable '}
                            <span className="ms-fontWeight-semibold">Allow Access to file URLs</span>.
                        </div>
                    </div>
                </div>
            </div>
        );
    },
);
