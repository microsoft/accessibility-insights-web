// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as styles from 'common/components/header-with-content-common.scss';
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
    guidance?: ContentReference;
}

export const HeaderWithContentLink = NamedFC<HeaderWithContentLinkProps>(
    'HeaderWithContent Link',
    props => {
        return (
            <div className={`${styles.headerWithContentLink} ${props.headerClass}`}>
                <h1>
                    <span
                        className={props.headingTitleClassName}
                    >{`${props.headingTitle} ${props.secondaryText}`}</span>
                </h1>
                <ContentLink deps={props.deps} reference={props.guidance} iconName="info" />
            </div>
        );
    },
);
