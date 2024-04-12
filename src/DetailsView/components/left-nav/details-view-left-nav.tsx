// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { INav } from '@fluentui/react';
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { DetailsViewPivotType } from 'common/types/store-data/details-view-pivot-type';
import { GetSelectedAssessmentSummaryModelFromProviderAndStatusData } from 'DetailsView/components/left-nav/get-selected-assessment-summary-model';
import { generateAssessmentTestKey } from 'DetailsView/components/left-nav/left-nav-link-builder';
import { Switcher, SwitcherDeps } from 'DetailsView/components/switcher';
import { mapValues } from 'lodash';
import * as React from 'react';
import { NamedFC } from '../../../common/react/named-fc';
import { AssessmentStoreData } from '../../../common/types/store-data/assessment-result-data';
import { FeatureFlagStoreData } from '../../../common/types/store-data/feature-flag-store-data';
import { VisualizationType } from '../../../common/types/visualization-type';
import { DetailsRightPanelConfiguration } from '../details-view-right-panel';
import { DetailsViewSwitcherNavConfiguration, LeftNavDeps } from '../details-view-switcher-nav';
import styles from './details-view-left-nav.scss';

export type DetailsViewLeftNavDeps = {
    getProvider: () => AssessmentsProvider;
    assessmentsProviderWithFeaturesEnabled: (
        assessmentProvider: AssessmentsProvider,
        flags: FeatureFlagStoreData,
    ) => AssessmentsProvider;
    quickAssessRequirementKeys: string[];
    getGetAssessmentSummaryModelFromProviderAndStatusData: () => GetSelectedAssessmentSummaryModelFromProviderAndStatusData;
} & LeftNavDeps &
    SwitcherDeps;

export type DetailsViewLeftNavProps = {
    deps: DetailsViewLeftNavDeps;
    selectedTest: VisualizationType;
    switcherNavConfiguration: DetailsViewSwitcherNavConfiguration;
    rightPanelConfiguration: DetailsRightPanelConfiguration;
    featureFlagStoreData: FeatureFlagStoreData;
    assessmentStoreData: AssessmentStoreData;
    selectedPivot: DetailsViewPivotType;
    onRightPanelContentSwitch: () => void;
    setNavComponentRef: (nav: INav) => void;
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

    const { getProvider, assessmentsProviderWithFeaturesEnabled } = deps;
    const assessmentsProvider = getProvider();
    const selectedKey: string = rightPanelConfiguration.GetLeftNavSelectedKey({
        visualizationType: selectedTest,
        selectedSubview: assessmentStoreData.assessmentNavState.selectedTestSubview,
        featureFlagStoreData,
        assessmentsProvider,
        deps: {
            generateAssessmentTestKey: generateAssessmentTestKey,
        },
    });
    const filteredProvider = assessmentsProviderWithFeaturesEnabled(
        assessmentsProvider,
        featureFlagStoreData,
    );

    const leftNav: JSX.Element = (
        <div className={`${styles.leftNav} main-nav`}>
            <Switcher deps={props.deps} pivotKey={props.selectedPivot} />
            <switcherNavConfiguration.LeftNav
                deps={deps}
                assessmentsProvider={filteredProvider}
                selectedKey={selectedKey}
                assessmentsData={mapValues(
                    assessmentStoreData.assessments,
                    data => data.testStepStatus,
                )}
                onRightPanelContentSwitch={props.onRightPanelContentSwitch}
                featureFlagStoreData={featureFlagStoreData}
                expandedTest={assessmentStoreData.assessmentNavState.expandedTestType}
                setNavComponentRef={props.setNavComponentRef}
            />
        </div>
    );

    return leftNav;
});
