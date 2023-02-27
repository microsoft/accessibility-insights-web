// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Icon } from '@fluentui/react';
import { NewTabLink } from 'common/components/new-tab-link';
import { NewTabLinkWithTooltip } from 'common/components/new-tab-link-with-tooltip';
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
    reference: ContentReference | undefined;
    linkText?: string;
    iconName?: string;
    hideTooltip?: boolean;
};

export const ContentLink = NamedFC<ContentLinkProps>(
    'ContentLink',
    ({ deps, reference, iconName, linkText, hideTooltip }) => {
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
        const handleLinkClick = ev => openContentPage(ev, contentPath);
        const linkHref = `/insights.html#/content/${contentPath}`;
        const TabLinkComponent = hideTooltip ? (
            <NewTabLink href={linkHref} onClick={handleLinkClick} aria-label={ariaLabel}>
                {icon}
                {linkText}
            </NewTabLink>
        ) : (
            <NewTabLinkWithTooltip
                href={linkHref}
                onClick={handleLinkClick}
                tooltipContent={'Guidance'}
                aria-label={ariaLabel}
            >
                {icon}
                {linkText}
            </NewTabLinkWithTooltip>
        );

        return TabLinkComponent;
    },
);
