// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Mock, Times } from 'typemoq';

import { TelemetryEventSource } from '../../../../common/extension-telemetry-events';
import { DetailsViewPivotType } from '../../../../common/types/details-view-pivot-type';
import { VisualizationType } from '../../../../common/types/visualization-type';
import { PopupActionMessageCreator } from '../../../../popup/actions/popup-action-message-creator';
import { LaunchPadRowConfiguration } from '../../../../popup/components/launch-pad';
import { PopupViewControllerHandler } from '../../../../popup/handlers/popup-view-controller-handler';
import { LaunchPadRowConfigurationFactory } from '../../../../popup/launch-pad-row-configuration-factory';

describe('LaunchPadRowConfigurationFactoryTests', () => {
    test('createRowConfigs: verify string properties', () => {
        const componentStub = {};
        const handlerMock = Mock.ofType(PopupViewControllerHandler);
        const actionMessageCreatorMock = Mock.ofType(PopupActionMessageCreator);
        const testSubject = new LaunchPadRowConfigurationFactory();
        const fastPassRowConfig = {
            iconName: 'Rocket',
            title: 'FastPass',
            description:
                'Run three tests to find the most common accessibility issues in less than 5 minutes.',
            onClickTitle: null,
        };
        const adhocRowConfig = {
            iconName: 'Medical',
            title: 'Ad hoc tools',
            description:
                'Get quick access to visualizations that help you identify accessibility issues.',
            onClickTitle: null,
        };
        const assessmentRowConfig = {
            iconName: 'testBeaker',
            title: 'Assessment',
            description: 'Walk through a guided process for assessing accessibility compliance.',
            onClickTitle: null,
        };

        const expectedConfig: LaunchPadRowConfiguration[] = [
            fastPassRowConfig,
            assessmentRowConfig,
            adhocRowConfig,
        ];

        const configs = testSubject.createRowConfigs(
            componentStub as any,
            actionMessageCreatorMock.object,
            handlerMock.object,
        );

        compareStaticProperties(expectedConfig, configs);
    });

    test('createRowConfigs: onClick title', () => {
        const componentStub = {};
        const handlerMock = Mock.ofType(PopupViewControllerHandler);
        const actionMessageCreatorMock = Mock.ofType(PopupActionMessageCreator);
        const testSubject = new LaunchPadRowConfigurationFactory();

        actionMessageCreatorMock
            .setup(a =>
                a.openDetailsView(
                    null,
                    VisualizationType.Issues,
                    TelemetryEventSource.LaunchPadFastPass,
                    DetailsViewPivotType.fastPass,
                ),
            )
            .verifiable(Times.once());

        actionMessageCreatorMock
            .setup(a =>
                a.openDetailsView(
                    null,
                    null,
                    TelemetryEventSource.LaunchPadAssessment,
                    DetailsViewPivotType.assessment,
                ),
            )
            .verifiable(Times.once());

        handlerMock
            .setup(h => h.openAdhocToolsPanel(componentStub as any))
            .verifiable(Times.once());

        const configs = testSubject.createRowConfigs(
            componentStub as any,
            actionMessageCreatorMock.object,
            handlerMock.object,
        );

        configs[0].onClickTitle(null);
        configs[1].onClickTitle(null);
        configs[2].onClickTitle();

        actionMessageCreatorMock.verifyAll();
        handlerMock.verifyAll();
    });

    function compareStaticProperties(
        expected: LaunchPadRowConfiguration[],
        actual: LaunchPadRowConfiguration[],
    ): void {
        expect(actual.length).toEqual(expected.length);

        expected.forEach((config: LaunchPadRowConfiguration, index: number) => {
            expect(actual[index].iconName).toEqual(config.iconName);
            expect(actual[index].title).toEqual(config.title);
            expect(actual[index].description).toEqual(config.description);
        });
    }
});
