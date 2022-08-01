// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { INav } from '@fluentui/react';
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { VisualizationType } from 'common/types/visualization-type';
import * as React from 'react';
import { NamedFC } from '../../../common/react/named-fc';
import {
    ManualTestStatus,
    ManualTestStatusData,
} from '../../../common/types/store-data/manual-test-status';
import { DictionaryStringTo } from '../../../types/common-types';
import { BaseLeftNav, BaseLeftNavLink } from '../base-left-nav';
import {
    AssessmentLinkBuilderDeps,
    LeftNavLinkBuilder,
    OverviewLinkBuilderDeps,
} from './left-nav-link-builder';
import { NavLinkHandler } from './nav-link-handler';

export type AssessmentLeftNavDeps = {
    leftNavLinkBuilder: LeftNavLinkBuilder;
    navLinkHandler: NavLinkHandler;
} & OverviewLinkBuilderDeps &
    AssessmentLinkBuilderDeps;

export type AssessmentLeftNavProps = {
    deps: AssessmentLeftNavDeps;
    selectedKey: string;
    assessmentsProvider: AssessmentsProvider;
    assessmentsData: DictionaryStringTo<ManualTestStatusData>;
    featureFlagStoreData: FeatureFlagStoreData;
    expandedTest: VisualizationType | undefined;
    onRightPanelContentSwitch: () => void;
    setNavComponentRef: (nav: INav) => void;
};

export type AssessmentLeftNavLink = {
    testType: VisualizationType;
    status: ManualTestStatus;
} & BaseLeftNavLink;

export type TestGettingStartedNavLink = {
    testType: VisualizationType;
} & BaseLeftNavLink;

export type TestRequirementLeftNavLink = {
    displayedIndex: string;
    testType: VisualizationType;
    requirementKey: string;
    status: ManualTestStatus;
} & BaseLeftNavLink;

export type onTestRequirementClick = (
    event: React.MouseEvent<HTMLElement>,
    item: TestRequirementLeftNavLink,
) => void;

export type onTestGettingStartedClick = (
    event: React.MouseEvent<HTMLElement>,
    item: TestGettingStartedNavLink,
) => void;

export const AssessmentLeftNav = NamedFC<AssessmentLeftNavProps>('AssessmentLeftNav', props => {
    const {
        deps,
        selectedKey,
        assessmentsProvider,
        assessmentsData,
        expandedTest,
        onRightPanelContentSwitch,
        setNavComponentRef,
    } = props;

    const { navLinkHandler, leftNavLinkBuilder } = deps;

    let links = [];
    links.push(
        leftNavLinkBuilder.buildOverviewLink(
            deps,
            navLinkHandler.onOverviewClick,
            assessmentsProvider,
            assessmentsData,
            0,
            onRightPanelContentSwitch,
        ),
    );

    links = links.concat(
        leftNavLinkBuilder.buildAssessmentTestLinks(
            deps,
            assessmentsProvider,
            assessmentsData,
            1,
            expandedTest,
            onRightPanelContentSwitch,
        ),
    );

    return (
        <BaseLeftNav
            selectedKey={selectedKey}
            links={links}
            setNavComponentRef={setNavComponentRef}
        />
    );
});
