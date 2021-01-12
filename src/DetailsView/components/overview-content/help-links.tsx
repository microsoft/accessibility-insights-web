// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ExternalLink, ExternalLinkDeps } from 'common/components/external-link';
import { NamedFC } from 'common/react/named-fc';
import { HyperlinkDefinition } from 'common/types/hyperlink-definition';
import * as React from 'react';

import * as styles from './help-links.scss';

export type HelpLinksDeps = ExternalLinkDeps;

export interface HelpLinksProps {
    deps: HelpLinksDeps;
    linkInformation: HyperlinkDefinition[];
}

export const HelpLinks = NamedFC('HelpLinks', (props: HelpLinksProps) => {
    const { linkInformation } = props;
    return (
        <>
            {linkInformation.map((link: HyperlinkDefinition) => (
                <div className={styles.helpLink} key={link.href}>
                    <ExternalLink deps={props.deps} href={link.href}>
                        {link.text}
                    </ExternalLink>
                </div>
            ))}
        </>
    );
});
