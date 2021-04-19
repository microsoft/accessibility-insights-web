// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as styles from 'DetailsView/components/static-content-common.scss';
import * as React from 'react';
import { ContentInclude, ContentIncludeDeps } from 'views/content/content-include';
import { ContentLink, ContentLinkDeps } from 'views/content/content-link';
import { ContentReference } from 'views/content/content-page';
import { VisualizationToggle } from '../../common/components/visualization-toggle';
import { NamedFC } from '../../common/react/named-fc';

export type StaticContentDetailsViewDeps = ContentIncludeDeps & ContentLinkDeps;

export interface StaticContentDetailsViewProps {
    deps: StaticContentDetailsViewDeps;
    title: string;
    visualizationEnabled: boolean;
    toggleLabel: string;
    content: ContentReference;
    guidance: ContentReference;
    onToggleClick: (event) => void;
    stepsText: string;
}

export const StaticContentDetailsView = NamedFC<StaticContentDetailsViewProps>(
    'StaticContentDetailsView',
    props => {
        return (
            <div className={styles.staticContentInDetailsView}>
                <h1>
                    {props.title}
                    {` ${props.stepsText} `}
                    <ContentLink deps={props.deps} reference={props.guidance} iconName="info" />
                </h1>
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
