// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { DetailsViewPivotType } from 'common/types/details-view-pivot-type';
import { generateReflowAssessmentTestKey } from 'DetailsView/components/left-nav/left-nav-link-builder';
import { Switcher, SwitcherDeps } from 'DetailsView/components/switcher';
import { leftNavSwitcherStyleNames } from 'DetailsView/components/switcher-style-names';
import { mapValues } from 'lodash';
import { INav } from 'office-ui-fabric-react';
import * as React from 'react';
import { NamedFC } from '../../../common/react/named-fc';
import { AssessmentStoreData } from '../../../common/types/store-data/assessment-result-data';
import { FeatureFlagStoreData } from '../../../common/types/store-data/feature-flag-store-data';
import { VisualizationType } from '../../../common/types/visualization-type';
import { DetailsRightPanelConfiguration } from '../details-view-right-panel';
import { DetailsViewSwitcherNavConfiguration, LeftNavDeps } from '../details-view-switcher-nav';
import * as styles from './details-view-left-nav.scss';

export type DetailsViewLeftNavDeps = {
    assessmentsProvider: AssessmentsProvider;
    assessmentsProviderWithFeaturesEnabled: (
        assessmentProvider: AssessmentsProvider,
        flags: FeatureFlagStoreData,
    ) => AssessmentsProvider;
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

    const { assessmentsProvider, assessmentsProviderWithFeaturesEnabled } = deps;

    const selectedKey: string = rightPanelConfiguration.GetLeftNavSelectedKey({
        visualizationType: selectedTest,
        selectedSubview: assessmentStoreData.assessmentNavState.selectedTestSubview,
        featureFlagStoreData,
        assessmentsProvider,
        deps: {
            generateReflowAssessmentTestKey,
        },
    });
    const filteredProvider = assessmentsProviderWithFeaturesEnabled(
        assessmentsProvider,
        featureFlagStoreData,
    );

    const leftNav: JSX.Element = (
        <div className={`${styles.leftNav} main-nav`}>
            <Switcher
                deps={props.deps}
                pivotKey={props.selectedPivot}
                styles={leftNavSwitcherStyleNames}
            />
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
