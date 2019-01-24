// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NewTabLink } from '../../common/components/new-tab-link';
import { NamedSFC } from '../../common/react/named-sfc';
import { HyperlinkDefinition } from '../../views/content/content-page';

export interface GuidanceLinksProps {
    links: HyperlinkDefinition[];
    classNameForDiv?: string;
}

export const GuidanceLinks = NamedSFC('GuidanceLinks', (props: GuidanceLinksProps) => {
    const { links, classNameForDiv } = props;

    if (links == null || links.length === 0) {
        return null;
    }

    const renderLinks = (): JSX.Element[] => {
        return links.map((link, index) => {
            return renderLink(link, index, links.length);
        });
    };

    const renderLink = (link: HyperlinkDefinition, index: number, length: number): JSX.Element => {
        const addComma: boolean = index !== length - 1;
        const comma = addComma ? <span>,&nbsp;</span> : null;
        return (
            <React.Fragment key={`guidance-link-${index}`}>
                <NewTabLink href={link.href} onClick={event => event.stopPropagation()}>
                    {link.text.toUpperCase()}
                </NewTabLink>
                {comma}
            </React.Fragment>
        );
    };

    const spanClassName = classNameForDiv || 'guidance-links';
    return <span className={spanClassName}>{renderLinks()}</span>;
});
