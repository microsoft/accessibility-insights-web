// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { HyperlinkDefinition } from 'views/content/content-page';

import { ExternalLink, ExternalLinkDeps } from '../../../common/components/external-link';
import { NamedSFC } from '../../../common/react/named-sfc';
import { helpLink } from './help-links.scss';

export type HelpLinksDeps = ExternalLinkDeps;

export interface HelpLinksProps {
    deps: HelpLinksDeps;
    linkInformation: HyperlinkDefinition[];
}

export const HelpLinks = NamedSFC('HelpLinks', (props: HelpLinksProps) => {
    const { linkInformation } = props;
    return (
        <>
            {linkInformation.map((link: HyperlinkDefinition) => (
                <div className={helpLink} key={link.href}>
                    <ExternalLink deps={props.deps} href={link.href}>
                        {link.text}
                    </ExternalLink>
                </div>
            ))}
        </>
    );
});
