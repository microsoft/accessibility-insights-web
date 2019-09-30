// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Link } from 'office-ui-fabric-react/lib/Link';
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

export const ExternalLink = NamedFC<ExternalLinkProps>('ExternalLink', ({ deps, href, title, children }) => {
    const onClick = e => deps.actionInitiators.openExternalLink(e, { href });
    return (
        <Link className="insights-link" target="_blank" href={href} title={title} onClick={onClick}>
            {children}
        </Link>
    );
});
