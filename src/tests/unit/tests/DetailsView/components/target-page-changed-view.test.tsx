// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import * as React from 'react';

import { DisplayableVisualizationTypeData } from '../../../../../common/configs/visualization-configuration-factory';
import { VisualizationType } from '../../../../../common/types/visualization-type';
import { TargetPageChangedView, TargetPageChangedViewProps } from '../../../../../DetailsView/components/target-page-changed-view';

describe('TargetPageChangedView', () => {
    const clickHandlerStub: () => void = () => {};

    test('render TargetPageChangedView', () => {
        const type = VisualizationType.Landmarks;
        const displayableData = {
            title: 'test title',
            toggleLabel: 'test toggle label',
        } as DisplayableVisualizationTypeData;

        const props: TargetPageChangedViewProps = {
            type: type,
            toggleClickHandler: clickHandlerStub,
            displayableData,
        };

        const targetPageChangedView = new TargetPageChangedView(props);

        const expectedComponent = (
            <div className="target-page-changed">
                <h1>{displayableData.title}</h1>
                <Toggle
                    onText="On"
                    offText="Off"
                    checked={false}
                    onClick={clickHandlerStub}
                    label={displayableData.toggleLabel}
                    className="details-view-toggle"
                />
                <p>The target page was changed. Use the toggle to enable the visualization in the current target page.</p>
            </div>
        );

        expect(targetPageChangedView.render()).toEqual(expectedComponent);
    });

    test('render TargetPageChangedView with unsupported type', () => {
        const type = VisualizationType.Landmarks;
        const displayableData = null;

        const props: TargetPageChangedViewProps = {
            type: type,
            toggleClickHandler: clickHandlerStub,
            displayableData,
        };

        const targetPageChangedView = new TargetPageChangedView(props);

        const expectedComponent = (
            <div className="target-page-changed">
                <h1>{''}</h1>
                <Toggle onText="On" offText="Off" checked={false} onClick={clickHandlerStub} label="" className="details-view-toggle" />
                <p>The target page was changed. Use the toggle to enable the visualization in the current target page.</p>
            </div>
        );

        expect(targetPageChangedView.render()).toEqual(expectedComponent);
    });
});
