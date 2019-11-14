// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { FeatureFlags } from 'common/feature-flags';
import { SupportedMouseEvent } from 'common/telemetry-data-factory';
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

    return (
        <ActionButton
            iconProps={{ iconName: 'Refresh' }}
            onClick={(event: SupportedMouseEvent) => actionMessageCreator.rescanVisualization(selectedTest, event)}
            disabled={props.visualizationStoreData.scanning !== null}
        >
            Start over
        </ActionButton>
    );
}
