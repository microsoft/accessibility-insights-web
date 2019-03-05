// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TelemetryEventSource } from '../../common/telemetry-events';
import { DetailsViewPivotType } from '../../common/types/details-view-pivot-type';
import { VisualizationType } from '../../common/types/visualization-type';
import { productName } from '../../content/strings/application';
import { PopupActionMessageCreator } from './actions/popup-action-message-creator';
import { LaunchPadRowConfiguration } from './components/launch-pad';
import { PopupView } from './components/popup-view';
import { PopupViewControllerHandler } from './handlers/popup-view-controller-handler';

export class LaunchPadRowConfigurationFactory {
    private readonly source: TelemetryEventSource = TelemetryEventSource.LaunchPad;

    public createRowConfigs(
        component: PopupView,
        actionMessageCreator: PopupActionMessageCreator,
        handler: PopupViewControllerHandler,
        isNewAssessmentExperienceEnabled: boolean,
    ) {
        const fastPassRowConfig = {
            iconName: 'Rocket',
            title: 'FastPass',
            description: 'Run two tests to find the most common accessibility issues in less than 5 minutes.',
            onClickTitle: event =>
                actionMessageCreator.openDetailsView(
                    event,
                    VisualizationType.Issues,
                    TelemetryEventSource.LaunchPadFastPass,
                    DetailsViewPivotType.fastPass,
                ),
        };
        const allTestRowConfig = {
            iconName: 'testBeaker',
            title: 'All available tests',
            description: 'Walk through a guided process for assessing accessibility compliance.',
            onClickTitle: event =>
                actionMessageCreator.openDetailsView(
                    event,
                    VisualizationType.Issues,
                    TelemetryEventSource.LaunchPadAllTests,
                    DetailsViewPivotType.allTest,
                ),
        };
        const adhocRowConfig = {
            iconName: 'Medical',
            title: 'Ad hoc tools',
            description: 'Get quick access to visualizations that help you identify accessibility issues.',
            onClickTitle: () => handler.openAdhocToolsPanel(component),
        };
        const assessmentRowConfig = {
            iconName: 'testBeaker',
            title: 'Assessment',
            description: 'Walk through a guided process for assessing accessibility compliance.',
            onClickTitle: event =>
                actionMessageCreator.openDetailsView(
                    event,
                    null,
                    TelemetryEventSource.LaunchPadAssessment,
                    DetailsViewPivotType.assessment,
                ),
        };
        const configForAssessmentDisabled: LaunchPadRowConfiguration[] = [fastPassRowConfig, allTestRowConfig, adhocRowConfig];

        const configForAssessmentEnabled: LaunchPadRowConfiguration[] = [fastPassRowConfig, assessmentRowConfig, adhocRowConfig];

        return isNewAssessmentExperienceEnabled ? configForAssessmentEnabled : configForAssessmentDisabled;
    }
}
