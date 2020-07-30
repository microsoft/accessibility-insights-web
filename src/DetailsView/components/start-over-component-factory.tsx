// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { InsightsCommandButton } from 'common/components/controls/insights-command-button';
import { AssessmentStoreData } from 'common/types/store-data/assessment-result-data';
import { VisualizationStoreData } from 'common/types/store-data/visualization-store-data';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import { DetailsRightPanelConfiguration } from 'DetailsView/components/details-view-right-panel';
import { DialogStateSetter } from 'DetailsView/components/start-over-dialog';
import {
    DropdownDirection,
    StartOverDropdown,
    StartOverProps,
} from 'DetailsView/components/start-over-dropdown';
import * as React from 'react';

export type StartOverFactoryDeps = {
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
};

export type StartOverFactoryProps = {
    deps: StartOverFactoryDeps;
    assessmentStoreData: AssessmentStoreData;
    assessmentsProvider: AssessmentsProvider;
    rightPanelConfiguration: DetailsRightPanelConfiguration;
    visualizationStoreData: VisualizationStoreData;
    dropdownDirection: DropdownDirection;
    setDialogState: DialogStateSetter;
};

export function getStartOverComponentForAssessment(props: StartOverFactoryProps): JSX.Element {
    const selectedTest = props.assessmentStoreData.assessmentNavState.selectedTestType;
    const test = props.assessmentsProvider.forType(selectedTest);
    const startOverProps: StartOverProps = {
        testName: test.title,
        rightPanelConfiguration: props.rightPanelConfiguration,
        dropdownDirection: props.dropdownDirection,
        setDialogState: props.setDialogState,
    };

    return <StartOverDropdown {...startOverProps} />;
}

export const startOverAutomationId = 'start-over';

export function getStartOverComponentForFastPass(props: StartOverFactoryProps): JSX.Element {
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
