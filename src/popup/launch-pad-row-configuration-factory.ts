// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TelemetryEventSource } from '../common/extension-telemetry-events';
import { DetailsViewPivotType } from '../common/types/details-view-pivot-type';
import { VisualizationType } from '../common/types/visualization-type';
import { PopupActionMessageCreator } from './actions/popup-action-message-creator';
import { LaunchPadRowConfiguration } from './components/launch-pad';
import { PopupView } from './components/popup-view';
import { PopupViewControllerHandler } from './handlers/popup-view-controller-handler';

export class LaunchPadRowConfigurationFactory {
    public createRowConfigs(
        component: PopupView,
        actionMessageCreator: PopupActionMessageCreator,
        handler: PopupViewControllerHandler,
    ): LaunchPadRowConfiguration[] {
        const fastPassRowConfig = {
            iconName: 'Rocket',
            title: 'FastPass',
            description:
                'Run three tests to find the most common accessibility issues in less than 5 minutes.',
            onClickTitle: event =>
                actionMessageCreator.openDetailsView(
                    event,
                    VisualizationType.Issues,
                    TelemetryEventSource.LaunchPadFastPass,
                    DetailsViewPivotType.fastPass,
                ),
        };
        const adhocRowConfig = {
            iconName: 'Medical',
            title: 'Ad hoc tools',
            description:
                'Get quick access to visualizations that help you identify accessibility issues.',
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

        return [fastPassRowConfig, assessmentRowConfig, adhocRowConfig];
    }
}
