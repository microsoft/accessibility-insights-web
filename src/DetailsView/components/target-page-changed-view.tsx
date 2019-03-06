// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import * as React from 'react';

import { IDisplayableVisualizationTypeData } from '../../common/configs/visualization-configuration-factory';
import { VisualizationType } from '../../common/types/visualization-type';

export interface TargetPageChangedViewProps {
    type: VisualizationType;
    displayableData: IDisplayableVisualizationTypeData;
    toggleClickHandler: (event) => void;
}

export class TargetPageChangedView extends React.Component<TargetPageChangedViewProps, {}> {
    public render(): JSX.Element {
        const data = this.props.displayableData;
        const title = data ? data.title : '';
        const label = data ? data.toggleLabel : '';

        return (
            <div className="target-page-changed">
                <h1>{title}</h1>
                <Toggle
                    onText="On"
                    offText="Off"
                    checked={false}
                    onClick={this.props.toggleClickHandler}
                    label={label}
                    className="details-view-toggle"
                />
                <p>The target page was changed. Use the toggle to enable the visualization in the current target page.</p>
            </div>
        );
    }
}
