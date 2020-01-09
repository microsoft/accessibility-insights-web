// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FeatureFlags } from 'common/feature-flags';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { Toggle } from 'office-ui-fabric-react';
import * as React from 'react';

import { DisplayableVisualizationTypeData } from '../../common/configs/visualization-configuration-factory';
import { NamedFC } from '../../common/react/named-fc';
import { VisualizationType } from '../../common/types/visualization-type';

export interface TargetPageChangedViewProps {
    visualizationType: VisualizationType;
    displayableData: DisplayableVisualizationTypeData;
    toggleClickHandler: (event) => void;
    featureFlagStoreData: FeatureFlagStoreData;
}

export const TargetPageChangedView = NamedFC<TargetPageChangedViewProps>(
    'TargetPageChangedView',
    props => {
        const { title = '', toggleLabel = '', subtitle } = props.displayableData;

        const toggleText =
            'The target page was changed. Use the toggle to enable the visualization in the current target page.';
        const startOverText =
            'The target page has changed. Use the start over button to scan the new target page.';

        const isCardsUIEnabled = props.featureFlagStoreData[FeatureFlags.universalCardsUI];
        const displayedText = isCardsUIEnabled ? startOverText : toggleText;
        const toggle = !isCardsUIEnabled ? (
            <Toggle
                onText="On"
                offText="Off"
                checked={false}
                onClick={props.toggleClickHandler}
                label={toggleLabel}
                className="details-view-toggle"
            />
        ) : null;

        return (
            <div className="target-page-changed">
                <h1>{title}</h1>
                <div className="target-page-changed-subtitle">{subtitle}</div>
                {toggle}
                <p>{displayedText}</p>
            </div>
        );
    },
);
