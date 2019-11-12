// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { FeatureFlags } from 'common/feature-flags';
import { VisualizationType } from 'common/types/visualization-type';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import { CommandBarProps } from 'DetailsView/components/details-view-command-bar';
import { StartOverDropdown, StartOverProps } from 'DetailsView/components/start-over-dropdown';
import { ActionButton } from 'office-ui-fabric-react/lib/Button';
import * as React from 'react';

export function getStartOverComponentForAssessment(props: CommandBarProps): JSX.Element {
    const selectedTest = props.assessmentStoreData.assessmentNavState.selectedTestType;
    const test = props.assessmentsProvider.forType(selectedTest);
    const deps = props.deps;
    const startOverProps: StartOverProps = {
        deps: deps,
        testName: test.title,
        test: selectedTest,
        requirementKey: props.assessmentStoreData.assessmentNavState.selectedTestStep,
        actionMessageCreator: props.actionMessageCreator,
        rightPanelConfiguration: props.rightPanelConfiguration,
    };

    return <StartOverDropdown {...startOverProps} />;
}

export function getStartOverComponentForFastPass(props: CommandBarProps): JSX.Element {
    if (!props.featureFlagStoreData[FeatureFlags.universalCardsUI]) {
        return null;
    }

    if (!props.visualizationScanResultData.issues.scanResult) {
        return null;
    }

    const selectedTest = props.visualizationStoreData.selectedFastPassDetailsView;
    const actionMessageCreator = props.actionMessageCreator;

    const element: JSX.Element = (
        <ActionButton onClick={() => onClickFastPass(actionMessageCreator, selectedTest)}>Start over</ActionButton>
    );
    return element;
}

function onClickFastPass(actionMessageCreator: DetailsViewActionMessageCreator, selectedTest: VisualizationType): void {
    let x: number = 4;
    if (x > 3) {
        x = 0;
    }
}
