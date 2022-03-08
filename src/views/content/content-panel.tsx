// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Panel, PanelType } from '@fluentui/react';
import * as React from 'react';

import { ContentActionMessageCreator } from '../../common/message-creators/content-action-message-creator';
import { NamedFC } from '../../common/react/named-fc';
import { ContentPageDeps, ContentProvider, ContentReference } from './content-page';

export type ContentPanelDeps = {
    contentProvider: ContentProvider;
    contentActionMessageCreator: ContentActionMessageCreator;
} & ContentPageDeps;

export type ContentPanelProps = {
    deps: ContentPanelDeps;
    content: ContentReference;
    contentTitle: string;
    isOpen: boolean;
};

export const ContentPanel = NamedFC<ContentPanelProps>(
    'ContentPanel',
    ({ deps, content, contentTitle, isOpen }) => {
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
                headerText={contentTitle}
                headerTextProps={{ role: 'heading', 'aria-level': 1 }}
                headerClassName={'content-header'}
            >
                <div className="content">
                    <ContentPage deps={deps} />
                </div>
            </Panel>
        );
    },
);
