// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FeatureFlags } from 'common/feature-flags';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
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

export const TargetPageChangedView = NamedFC<TargetPageChangedViewProps>('TargetPageChangedView', props => {
    const { title = '', toggleLabel = '', subtitle } = props.displayableData;

    const oldText = 'The target page was changed. Use the toggle to enable the visualization in the current target page.';
    const cardsUIText = 'The target page has changed. Use the start over button to scan this new target page.';
    const displayedText = props.featureFlagStoreData[FeatureFlags.universalCardsUI] ? cardsUIText : oldText;

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
            <p>{displayedText}</p>
        </div>
    );
});
