// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { HyperlinkDefinition } from 'common/types/hyperlink-definition';
import { LinkComponentType } from 'common/types/link-component-type';
import { isEmpty } from 'lodash';
import * as React from 'react';
import { NamedFC } from '../react/named-fc';

export interface GuidanceLinksProps {
    links: HyperlinkDefinition[];
    classNameForDiv?: string;
    LinkComponent: LinkComponentType;
}

export const GuidanceLinks = NamedFC('GuidanceLinks', (props: GuidanceLinksProps) => {
    const { links, classNameForDiv } = props;
    if (isEmpty(links)) {
        return null;
    }

    const renderLinks = (): JSX.Element[] => {
        const linksToRender = getLinksWithDestinations();
        return linksToRender.map((link, index) => {
            return renderLink(link, index, linksToRender.length);
        });
    };

    const getLinksWithDestinations = (): HyperlinkDefinition[] => {
        return links.filter(link => !isEmpty(link.href));
    };

    const renderLink = (link: HyperlinkDefinition, index: number, length: number): JSX.Element => {
        const addComma: boolean = index !== length - 1;
        const comma = addComma ? <span>,&nbsp;</span> : null;
        const LinkComponent: LinkComponentType = props.LinkComponent;
        return (
            <React.Fragment key={`guidance-link-${index}`}>
                <LinkComponent href={link.href} onClick={event => event.stopPropagation()}>
                    {link.text.toUpperCase()}
                </LinkComponent>
                {comma}
            </React.Fragment>
        );
    };

    const spanClassName = classNameForDiv || 'guidance-links';
    return <span className={spanClassName}>{renderLinks()}</span>;
});
