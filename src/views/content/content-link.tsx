// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NewTabLinkWithTooltip } from 'common/components/new-tab-link-with-tooltip';
import { Icon } from 'office-ui-fabric-react';
import * as React from 'react';

import { ContentActionMessageCreator } from '../../common/message-creators/content-action-message-creator';
import { NamedFC } from '../../common/react/named-fc';
import { ContentProvider, ContentReference } from './content-page';

export type ContentLinkDeps = {
    contentProvider: ContentProvider;
    contentActionMessageCreator: ContentActionMessageCreator;
};

export type ContentLinkProps = {
    deps: ContentLinkDeps;
    reference: ContentReference;
    linkText?: string;
    iconName?: string;
};

export const ContentLink = NamedFC<ContentLinkProps>(
    'ContentLink',
    ({ deps, reference, iconName, linkText }) => {
        const { contentProvider, contentActionMessageCreator } = deps;
        const { openContentPage } = contentActionMessageCreator;

        if (!reference) {
            return null;
        }

        const contentPath = contentProvider.pathFromReference(reference);
        if (contentPath == null) {
            return null;
        }

        const icon = iconName && <Icon iconName={iconName} />;
        const ariaLabel = linkText ? `${linkText} guidance` : 'Guidance';

        return (
            <NewTabLinkWithTooltip
                href={`/insights.html#/content/${contentPath}`}
                onClick={ev => openContentPage(ev, contentPath)}
                tooltipContent={'Guidance'}
                aria-label={ariaLabel}
            >
                {icon}
                {linkText}
            </NewTabLinkWithTooltip>
        );
    },
);
