// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { mapValues } from 'lodash';
import * as React from 'react';

import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { NamedFC } from '../../../common/react/named-fc';
import { AssessmentStoreData } from '../../../common/types/store-data/assessment-result-data';
import { FeatureFlagStoreData } from '../../../common/types/store-data/feature-flag-store-data';
import { VisualizationType } from '../../../common/types/visualization-type';
import { DetailsRightPanelConfiguration } from '../details-view-right-panel';
import { DetailsViewSwitcherNavConfiguration, LeftNavDeps } from '../details-view-switcher-nav';

export type DetailsViewLeftNavDeps = {
    assessmentsProvider: AssessmentsProvider;
    assessmentsProviderWithFeaturesEnabled: (
        assessmentProvider: AssessmentsProvider,
        flags: FeatureFlagStoreData,
    ) => AssessmentsProvider;
} & LeftNavDeps;

export type DetailsViewLeftNavProps = {
    deps: DetailsViewLeftNavDeps;
    selectedTest: VisualizationType;
    switcherNavConfiguration: DetailsViewSwitcherNavConfiguration;
    rightPanelConfiguration: DetailsRightPanelConfiguration;
    featureFlagStoreData: FeatureFlagStoreData;
    assessmentStoreData: AssessmentStoreData;
};

export const DetailsViewLeftNav = NamedFC<DetailsViewLeftNavProps>('DetailsViewLeftNav', props => {
    const {
        deps,
        selectedTest,
        switcherNavConfiguration,
        rightPanelConfiguration,
        featureFlagStoreData,
        assessmentStoreData,
    } = props;

    const { assessmentsProvider, assessmentsProviderWithFeaturesEnabled } = deps;

    const selectedKey: string = rightPanelConfiguration.GetLeftNavSelectedKey({
        visualizationType: selectedTest,
    });
    const filteredProvider = assessmentsProviderWithFeaturesEnabled(
        assessmentsProvider,
        featureFlagStoreData,
    );

    const leftNav: JSX.Element = (
        <div className="left-nav main-nav">
            <switcherNavConfiguration.LeftNav
                deps={deps}
                assessmentsProvider={filteredProvider}
                selectedKey={selectedKey}
                assessmentsData={mapValues(
                    assessmentStoreData.assessments,
                    data => data.testStepStatus,
                )}
                featureFlagStoreData={featureFlagStoreData}
            />
        </div>
    );

    return leftNav;
});
