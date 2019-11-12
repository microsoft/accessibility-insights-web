// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { FeatureFlags } from 'common/feature-flags';
import { CommandBarProps } from 'DetailsView/components/details-view-command-bar';
import { StartOverComponentDeps, StartOverComponentProps } from 'DetailsView/components/start-over-component';
import { StartOverProps } from 'DetailsView/components/start-over-dropdown';

const StartOver: string = 'Start over';

export function getStartOverComponentPropsForAssessment(props: CommandBarProps): StartOverComponentProps {
    const selectedTest = props.assessmentStoreData.assessmentNavState.selectedTestType;
    const test = props.assessmentsProvider.forType(selectedTest);
    const deps: StartOverComponentDeps = props.deps;
    const startOverProps: StartOverProps = {
        deps: deps,
        buttonCaption: StartOver,
        hasDropdown: true,
        testName: test.title,
        test: selectedTest,
        requirementKey: props.assessmentStoreData.assessmentNavState.selectedTestStep,
        actionMessageCreator: props.actionMessageCreator,
        rightPanelConfiguration: props.rightPanelConfiguration,
    };
    return {
        render: true,
        startOverProps,
        ...props,
    };
}

export function getStartOverComponentPropsForFastPass(props: CommandBarProps): StartOverComponentProps {
    if (!props.visualizationScanResultData.issues.scanResult) {
        return null;
    }

    const selectedTest = props.visualizationStoreData.selectedFastPassDetailsView;
    const deps: StartOverComponentDeps = props.deps;
    const startOverProps: StartOverProps = {
        deps: deps,
        buttonCaption: StartOver,
        hasDropdown: false,
        testName: '',
        test: selectedTest,
        requirementKey: props.assessmentStoreData.assessmentNavState.selectedTestStep,
        actionMessageCreator: props.actionMessageCreator,
        rightPanelConfiguration: props.rightPanelConfiguration,
    };
    return {
        render: props.featureFlagStoreData[FeatureFlags.universalCardsUI] === true,
        startOverProps,
        ...props,
    };
}
