// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NewTabLinkWithTooltip } from 'common/components/new-tab-link-with-tooltip';
import * as React from 'react';

import { ActionInitiators } from '../action/action-initiator';
import { NamedFC } from '../react/named-fc';

export type ExternalLinkDeps = {
    actionInitiators: Pick<ActionInitiators, 'openExternalLink'>;
};

export type ExternalLinkProps = {
    deps: ExternalLinkDeps;
    href: string;
    title?: string;
};

export const ExternalLink = NamedFC<ExternalLinkProps>(
    'ExternalLink',
    ({ deps, href, title, children }) => {
        const onClick = e => deps.actionInitiators.openExternalLink(e, { href });

        return (
            <NewTabLinkWithTooltip
                href={href}
                onClick={onClick}
                tooltipContent={title}
                aria-label={title}
            >
                {children}
            </NewTabLinkWithTooltip>
        );
    },
);
