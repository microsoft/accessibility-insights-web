// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InsightsCommandButton } from 'common/components/controls/insights-command-button';
import { CommandBarProps } from 'DetailsView/components/details-view-command-bar';
import { StartOverDropdown, StartOverProps } from 'DetailsView/components/start-over-dropdown';
import * as React from 'react';

export function getStartOverComponentForAssessment(props: CommandBarProps): JSX.Element {
    const selectedTest = props.assessmentStoreData.assessmentNavState.selectedTestType;
    const test = props.assessmentsProvider.forType(selectedTest);
    const deps = props.deps;
    const startOverProps: StartOverProps = {
        deps: deps,
        testName: test.title,
        test: selectedTest,
        requirementKey: props.assessmentStoreData.assessmentNavState.selectedTestSubview,
        rightPanelConfiguration: props.rightPanelConfiguration,
        dropdownDirection: 'down',
    };

    return <StartOverDropdown {...startOverProps} />;
}

export const startOverAutomationId = 'start-over';

export function getStartOverComponentForFastPass(props: CommandBarProps): JSX.Element {
    const selectedTest = props.visualizationStoreData.selectedFastPassDetailsView;
    const detailsViewActionMessageCreator = props.deps.detailsViewActionMessageCreator;

    return (
        <InsightsCommandButton
            iconProps={{ iconName: 'Refresh' }}
            onClick={event =>
                detailsViewActionMessageCreator.rescanVisualization(selectedTest, event)
            }
            disabled={props.visualizationStoreData.scanning !== null}
            data-automation-id={startOverAutomationId}
        >
            Start over
        </InsightsCommandButton>
    );
}
