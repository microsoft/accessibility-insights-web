// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { mapValues } from 'lodash';
import * as React from 'react';

import { NamedSFC } from '../../../common/react/named-sfc';
import { AssessmentStoreData } from '../../../common/types/store-data/assessment-result-data';
import { FeatureFlagStoreData } from '../../../common/types/store-data/feature-flag-store-data';
import { VisualizationType } from '../../../common/types/visualization-type';
import { DetailsRightPanelConfiguration } from '../details-view-right-panel';
import { DetailsViewSwitcherNavConfiguration, LeftNavDeps } from '../details-view-switcher-nav';

export type DetailsViewLeftNavDeps = {
    assessmentsProvider: AssessmentsProvider;
} & LeftNavDeps;

export type DetailsViewLeftNavProps = {
    deps: DetailsViewLeftNavDeps;
    selectedTest: VisualizationType;
    switcherNavConfiguration: DetailsViewSwitcherNavConfiguration;
    rightPanelConfiguration: DetailsRightPanelConfiguration;
    featureFlagStoreData: FeatureFlagStoreData;
    assessmentStoreData: AssessmentStoreData;
};

export const DetailsViewLeftNav = NamedSFC<DetailsViewLeftNavProps>('DetailsViewLeftNav', props => {
    const { deps, selectedTest, switcherNavConfiguration, rightPanelConfiguration, featureFlagStoreData, assessmentStoreData } = props;

    const { assessmentsProvider } = deps;

    const selectedKey: string = rightPanelConfiguration.GetLeftNavSelectedKey({ visualizationType: selectedTest });

    const leftNav: JSX.Element = (
        <div className="left-nav main-nav">
            <switcherNavConfiguration.LeftNav
                {...props}
                assessmentsProvider={assessmentsProvider}
                selectedKey={selectedKey}
                assessmentsData={mapValues(assessmentStoreData.assessments, data => data.testStepStatus)}
            />
        </div>
    );

    return leftNav;
});
