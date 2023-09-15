// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Mock, Times } from 'typemoq';

import { TelemetryEventSource } from '../../../../common/extension-telemetry-events';
import { DetailsViewPivotType } from '../../../../common/types/store-data/details-view-pivot-type';
import { VisualizationType } from '../../../../common/types/visualization-type';
import { PopupActionMessageCreator } from '../../../../popup/actions/popup-action-message-creator';
import { LaunchPadRowConfiguration } from '../../../../popup/components/launch-pad';
import { PopupViewControllerHandler } from '../../../../popup/handlers/popup-view-controller-handler';
import { LaunchPadRowConfigurationFactory } from '../../../../popup/launch-pad-row-configuration-factory';

describe('LaunchPadRowConfigurationFactoryTests', () => {
    let componentStub = {};
    let handlerMock = Mock.ofType(PopupViewControllerHandler);
    let actionMessageCreatorMock = Mock.ofType(PopupActionMessageCreator);
    let testSubject: LaunchPadRowConfigurationFactory;
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

    const quickAssessRowConfig = {
        iconName: 'SiteScan',
        title: 'Quick Assess',
        description: 'Run 10 assisted checks to find more accessibility issues in 30 minutes.',
        onClickTitle: null,
    };

    beforeEach(() => {
        componentStub = {};
        handlerMock = Mock.ofType(PopupViewControllerHandler);
        actionMessageCreatorMock = Mock.ofType(PopupActionMessageCreator);
        testSubject = new LaunchPadRowConfigurationFactory();
    });

    it('createRowConfigs: verify string properties', () => {
        const expectedConfig: LaunchPadRowConfiguration[] = [
            fastPassRowConfig,
            quickAssessRowConfig,
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

    it('createRowConfigs: onClick title', () => {
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

        actionMessageCreatorMock
            .setup(a =>
                a.openDetailsView(
                    null,
                    null,
                    TelemetryEventSource.LaunchPadQuickAssess,
                    DetailsViewPivotType.quickAssess,
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

        configs.forEach((config, index) => {
            if (index === configs.length - 1) {
                config.onClickTitle();
            } else {
                config.onClickTitle(null);
            }
        });

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
