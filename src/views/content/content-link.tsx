// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import * as React from 'react';

import { NewTabLink } from '../../common/components/new-tab-link';
import { ContentActionMessageCreator } from '../../common/message-creators/content-action-message-creator';
import { NamedSFC } from '../../common/react/named-sfc';
import { ContentProvider, ContentReference } from './content-page';
import { ContentUrlDecorator } from './url-decorator/content-url-decorator';

export type ContentLinkDeps = {
    contentProvider: ContentProvider;
    contentActionMessageCreator: ContentActionMessageCreator;
    contentUrlDecorator: ContentUrlDecorator;
};

export type ContentLinkProps = {
    deps: ContentLinkDeps;
    reference: ContentReference;
    linkText?: string;
    iconName?: string;
};

export const ContentLink = NamedSFC<ContentLinkProps>('ContentLink', ({ deps, reference, iconName, linkText }) => {
    const { contentProvider, contentActionMessageCreator, contentUrlDecorator } = deps;
    const { openContentPage } = contentActionMessageCreator;

    if (!reference) {
        return null;
    }

    const contentPath = contentProvider.pathFromReference(reference);
    const icon = iconName && <Icon iconName={iconName} />;

    const href = contentUrlDecorator(`/insights.html#/content/${contentPath}`);

    return (
        <NewTabLink href={href} title="Guidance" onClick={ev => openContentPage(ev, contentPath)}>
            {icon}
            {linkText}
        </NewTabLink>
    );
});
