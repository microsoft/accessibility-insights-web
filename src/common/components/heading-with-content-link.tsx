// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import styles from 'common/components/heading-with-content-common.scss';
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';
import { ContentLink, ContentLinkDeps } from 'views/content/content-link';
import { ContentReference } from 'views/content/content-page';

export interface HeaderWithContentLinkProps {
    deps: ContentLinkDeps;
    headerClass?: string;
    headingTitleClassName?: string;
    headingTitle: string;
    secondaryText?: string;
    guidance: ContentReference | undefined;
}

export const HeadingWithContentLink = NamedFC<HeaderWithContentLinkProps>(
    'HeadingWithContentLink',
    props => {
        const finalHeading = props.secondaryText
            ? `${props.headingTitle} ${props.secondaryText}`
            : props.headingTitle;
        return (
            <div className={`${styles.headerWithContentLink} ${props.headerClass}`}>
                <h1>
                    <span className={props.headingTitleClassName}>{finalHeading}</span>
                </h1>
                <ContentLink deps={props.deps} reference={props.guidance} iconName="info" />
            </div>
        );
    },
);
