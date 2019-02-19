// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { VisualizationToggle } from '../../common/components/visualization-toggle';
import { NamedSFC } from '../../common/react/named-sfc';
import { ContentPageComponent, ContentPageDeps } from '../../views/content/content-page';

export type StaticContentDetailsViewDeps = ContentPageDeps;

export interface StaticContentDetailsViewProps {
    deps?: StaticContentDetailsViewDeps;
    title: string;
    visualizationEnabled: boolean;
    toggleLabel: string;
    staticContent: ContentPageComponent;
    onToggleClick: (event) => void;
}

export const StaticContentDetailsView = NamedSFC<StaticContentDetailsViewProps>('StaticContentDetailsView', props => {
    const wrapContentPage = () => {
        return props.staticContent ? <props.staticContent deps={props.deps} /> : null;
    };

    return (
        <div className="static-content-details-view">
            <h1>{props.title}</h1>
            <VisualizationToggle
                checked={props.visualizationEnabled}
                onClick={props.onToggleClick}
                label={props.toggleLabel}
                className="details-view-toggle"
                visualizationName={props.title}
            />
            {wrapContentPage()}
        </div>
    );
});
