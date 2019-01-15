// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { ExternalLink } from '../../../common/components/external-link';
import { NamedSFC } from '../../../common/react/named-sfc';
import { HyperlinkDefinition } from '../../../views/content/content-page';
import { HelpLinkDeps } from './overview-help-section';

export interface HelpLinksProps {
    deps: HelpLinkDeps;
    linkInformation: HyperlinkDefinition[];
}

export const HelpLinks = NamedSFC('HelpLinks', (props: HelpLinksProps) => {
    const { linkInformation } = props;
    return (
        <>
            {linkInformation.map((link: HyperlinkDefinition) => (
                <div className="help-link" key={link.href}>
                    <ExternalLink
                        deps={props.deps}
                        href={link.href}
                    >
                        {link.text}
                    </ExternalLink>
                </div>
            ))}
        </>
    );
});
