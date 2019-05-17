// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import * as React from 'react';

import { DisplayableVisualizationTypeData } from '../../common/configs/visualization-configuration-factory';
import { NamedSFC } from '../../common/react/named-sfc';
import { VisualizationType } from '../../common/types/visualization-type';

export interface TargetPageChangedViewProps {
    visualizationType: VisualizationType;
    displayableData: DisplayableVisualizationTypeData;
    toggleClickHandler: (event) => void;
}

export const TargetPageChangedView = NamedSFC<TargetPageChangedViewProps>('TargetPageChangedView', props => {
    const { title = '', toggleLabel = '' } = props.displayableData;

    return (
        <div className="target-page-changed">
            <h1>{title}</h1>
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
