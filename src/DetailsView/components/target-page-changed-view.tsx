// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import * as React from 'react';

import { DisplayableVisualizationTypeData } from '../../common/configs/visualization-configuration-factory';
import { NamedFC } from '../../common/react/named-fc';
import { VisualizationType } from '../../common/types/visualization-type';

export interface TargetPageChangedViewProps {
    visualizationType: VisualizationType;
    displayableData: DisplayableVisualizationTypeData;
    toggleClickHandler: (event) => void;
}

export const TargetPageChangedView = NamedFC<TargetPageChangedViewProps>('TargetPageChangedView', props => {
    const { title = '', toggleLabel = '', subtitle } = props.displayableData;

    return (
        <div className="target-page-changed">
            <h1>{title}</h1>
            <div className="target-page-changed-subtitle">{subtitle}</div>
            <Toggle
                onText="On"
                offText="Off"
                checked={false}
                onClick={props.toggleClickHandler}
                label={toggleLabel}
                className="details-view-toggle"
            />
            <p>The target page was changed. Use the toggle to enable the visualization in the current target page.</p>
        </div>
    );
});
