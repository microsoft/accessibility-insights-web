// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { mapValues } from 'lodash';
import * as React from 'react';

import { IAssessmentsProvider } from '../../../assessments/types/iassessments-provider';
import { NamedSFC } from '../../../common/react/named-sfc';
import { FeatureFlagStoreData } from '../../../common/types/store-data/feature-flag-store-data';
import { IAssessmentStoreData } from '../../../common/types/store-data/iassessment-result-data';
import { VisualizationType } from '../../../common/types/visualization-type';
import { DetailsRightPanelConfiguration } from '../details-view-right-panel';
import { DetailsViewSwitcherNavConfiguration, LeftNavDeps } from '../details-view-switcher-nav';

export type DetailsViewLeftNavV2Deps = {
    assessmentsProvider: IAssessmentsProvider,
    assessmentsProviderWithFeaturesEnabled: (assessmentProvider: IAssessmentsProvider, flags: FeatureFlagStoreData) => IAssessmentsProvider,
} & LeftNavDeps;

export type DetailsViewLeftNavV2Props = {
    deps: DetailsViewLeftNavV2Deps;
    selectedTest: VisualizationType;
    switcherNavConfiguration: DetailsViewSwitcherNavConfiguration;
    rightPanelConfiguration: DetailsRightPanelConfiguration;
    featureFlagStoreData: FeatureFlagStoreData;
    assessmentStoreData: IAssessmentStoreData;
};

export const DetailsViewLeftNavV2 = NamedSFC<DetailsViewLeftNavV2Props>('DetailsViewLeftNavV2', props => {
    const {
        deps,
        selectedTest,
        switcherNavConfiguration,
        rightPanelConfiguration,
        featureFlagStoreData,
        assessmentStoreData,
    } = props;

    const {
        assessmentsProvider,
        assessmentsProviderWithFeaturesEnabled,
    } = deps;

    const selectedKey: string = rightPanelConfiguration.GetLeftNavSelectedKey({ type: selectedTest });
    const filteredProvider = assessmentsProviderWithFeaturesEnabled(
        assessmentsProvider,
        featureFlagStoreData,
    );

    const leftNav: JSX.Element = (
        <div className="left-nav main-nav">
            <switcherNavConfiguration.LeftNav
                {...props}
                assessmentsProvider={filteredProvider}
                selectedKey={selectedKey}
                assessmentsData={mapValues(assessmentStoreData.assessments, data => data.testStepStatus)}
            />
        </div>
    );

    return leftNav;
});
