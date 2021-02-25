// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ActionButton } from 'office-ui-fabric-react';
import * as React from 'react';

import { ContentActionMessageCreator } from '../../common/message-creators/content-action-message-creator';
import { NamedFC } from '../../common/react/named-fc';
import { ContentProvider, ContentReference } from './content-page';

export type ContentPanelButtonDeps = {
    contentProvider: ContentProvider;
    contentActionMessageCreator: ContentActionMessageCreator;
};

export type ContentPanelButtonProps = {
    contentTitle: string;
    deps: ContentPanelButtonDeps;
    reference: ContentReference;
    iconName: string;
};

export const ContentPanelButton = NamedFC<ContentPanelButtonProps>(
    'ContentPanelButton',
    ({ contentTitle, deps, reference, children, iconName }) => {
        const { contentProvider, contentActionMessageCreator } = deps;

        if (!reference) {
            return null;
        }

        const contentPath = contentProvider.pathFromReference(reference);
        if (contentPath == null) {
            return null;
        }

        const onClick = ev =>
            contentActionMessageCreator.openContentPanel(ev, contentPath, contentTitle);

        return (
            <ActionButton
                iconProps={{ iconName }}
                onClick={onClick}
                ariaLabel={'info and examples'}
            >
                {children}
            </ActionButton>
        );
    },
);
