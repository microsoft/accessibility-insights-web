// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { INav } from '@fluentui/react';
import { MediumPassRequirementKeys } from 'assessments/medium-pass-requirements';
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { VisualizationType } from 'common/types/visualization-type';
import * as React from 'react';
import { NamedFC } from '../../../common/react/named-fc';
import { ManualTestStatusData } from '../../../common/types/store-data/manual-test-status';
import { DictionaryStringTo } from '../../../types/common-types';
import { BaseLeftNav } from '../base-left-nav';
import {
    AssessmentLinkBuilderDeps,
    LeftNavLinkBuilder,
    OverviewLinkBuilderDeps,
} from './left-nav-link-builder';
import { NavLinkHandler } from './nav-link-handler';

export type MediumPassLeftNavDeps = {
    leftNavLinkBuilder: LeftNavLinkBuilder;
    navLinkHandler: NavLinkHandler;
} & OverviewLinkBuilderDeps &
    AssessmentLinkBuilderDeps;

export type MediumPassLeftNavProps = {
    deps: MediumPassLeftNavDeps;
    selectedKey: string;
    assessmentsProvider: AssessmentsProvider;
    assessmentsData: DictionaryStringTo<ManualTestStatusData>;
    featureFlagStoreData: FeatureFlagStoreData;
    expandedTest: VisualizationType | undefined;
    onRightPanelContentSwitch: () => void;
    setNavComponentRef: (nav: INav) => void;
};

export const MediumPassLeftNav = NamedFC<MediumPassLeftNavProps>('MediumPassLeftNav', props => {
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

    links.push(
        leftNavLinkBuilder.buildAutomatedChecksLinks(
            deps,
            assessmentsProvider,
            assessmentsData,
            1,
            expandedTest,
            onRightPanelContentSwitch,
        ),
    );

    links = links.concat(
        leftNavLinkBuilder.buildMediumPassTestLinks(
            deps,
            assessmentsProvider,
            assessmentsData,
            2,
            MediumPassRequirementKeys,
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
