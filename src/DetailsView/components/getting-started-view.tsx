// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as styles from 'DetailsView/components/getting-started-view.scss';
import * as React from 'react';
import { ContentLink, ContentLinkDeps } from 'views/content/content-link';
import { ContentPageComponent } from 'views/content/content-page';

export type GettingStartedViewDeps = ContentLinkDeps;

export interface GettingStartedViewProps {
    deps: GettingStartedViewDeps;
    gettingStartedContent: JSX.Element;
    title: string;
    guidance: ContentPageComponent;
}

export const GettingStartedView = NamedFC<GettingStartedViewProps>('GettingStartedView', props => {
    return (
        <div className={styles.gettingStartedView}>
            <h1 className={styles.gettingStartedHeader}>
                <span className={styles.gettingStartedHeaderTitle}>{props.title}</span>
                <ContentLink deps={props.deps} reference={props.guidance} iconName="info" />
            </h1>
            <h2 className={styles.gettingStartedTitle}>Getting Started</h2>
            {props.gettingStartedContent}
        </div>
    );
});
