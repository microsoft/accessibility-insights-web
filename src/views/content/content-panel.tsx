// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import * as React from 'react';

import { ContentActionMessageCreator } from '../../common/message-creators/content-action-message-creator';
import { NamedFC } from '../../common/react/named-sfc';
import { ContentPageDeps, ContentProvider, ContentReference } from './content-page';

export type ContentPanelDeps = {
    contentProvider: ContentProvider;
    contentActionMessageCreator: ContentActionMessageCreator;
} & ContentPageDeps;

export type ContentPanelProps = {
    deps: ContentPanelDeps;
    content: ContentReference;
    isOpen: boolean;
};

export const ContentPanel = NamedFC<ContentPanelProps>('ContentPanel', ({ deps, content, isOpen }) => {
    const { contentProvider, contentActionMessageCreator } = deps;

    if (!content) {
        return null;
    }

    const ContentPage = contentProvider.contentFromReference(content);

    return (
        <Panel
            isOpen={isOpen}
            onDismiss={contentActionMessageCreator.closeContentPanel}
            type={PanelType.medium}
            isLightDismiss={true}
            closeButtonAriaLabel="Close panel"
        >
            <div className="content">
                <ContentPage deps={deps} />
            </div>
        </Panel>
    );
});
