// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { HeadingWithContentLink } from 'common/components/heading-with-content-link';
import styles from 'DetailsView/components/static-content-common.scss';
import * as React from 'react';
import { ContentInclude, ContentIncludeDeps } from 'views/content/content-include';
import { ContentLinkDeps } from 'views/content/content-link';
import { ContentReference } from 'views/content/content-page';
import { VisualizationToggle } from '../../common/components/visualization-toggle';
import { NamedFC } from '../../common/react/named-fc';

export type StaticContentDetailsViewDeps = ContentIncludeDeps & ContentLinkDeps;

export interface StaticContentDetailsViewProps {
    deps: StaticContentDetailsViewDeps;
    title: string;
    visualizationEnabled: boolean;
    toggleLabel: string;
    content: ContentReference | undefined;
    guidance: ContentReference | undefined;
    onToggleClick: (event) => void;
    stepsText: string;
}

export const StaticContentDetailsView = NamedFC<StaticContentDetailsViewProps>(
    'StaticContentDetailsView',
    props => {
        return (
            <div className={styles.staticContentInDetailsView}>
                <HeadingWithContentLink
                    deps={props.deps}
                    headingTitle={props.title}
                    secondaryText={` ${props.stepsText} `}
                    guidance={props.guidance}
                />
                <VisualizationToggle
                    checked={props.visualizationEnabled}
                    onClick={props.onToggleClick}
                    label={props.toggleLabel}
                    className={styles.detailsViewToggle}
                    visualizationName={props.title}
                />
                <ContentInclude deps={props.deps} content={props.content} />
            </div>
        );
    },
);
