// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Button } from '@fluentui/react-components';
import { Icons } from 'common/icons/fluentui-v9-icons';
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
    reference: ContentReference | undefined;
    iconName?: string;
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
            <Button
                className="info"
                appearance="transparent"
                icon={Icons[iconName]}
                onClick={onClick}
                aria-label={'info and examples'}
            >
                {children}
            </Button>
        );
    },
);
