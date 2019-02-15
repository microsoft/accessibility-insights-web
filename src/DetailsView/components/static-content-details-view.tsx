// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { VisualizationToggle } from '../../common/components/visualization-toggle';
import { NamedSFC } from '../../common/react/named-sfc';

export interface StaticContentDetailsViewProps {
    title: string;
    visualizationEnabled: boolean;
    toggleLabel: string;
    content: JSX.Element;
    onToggleClick: (event) => void;
}

export const StaticContentDetailsView = NamedSFC<StaticContentDetailsViewProps>('StaticContentDetailsView', props => {
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
            <div className="details-view-static-content">{props.content}</div>
        </div>
    );
});
