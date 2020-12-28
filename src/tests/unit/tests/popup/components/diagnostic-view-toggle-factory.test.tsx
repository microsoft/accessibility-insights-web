// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CommandStore } from 'background/stores/global/command-store';
import { FeatureFlagStore } from 'background/stores/global/feature-flag-store';
import { VisualizationStore } from 'background/stores/visualization-store';
import { TestMode } from 'common/configs/test-mode';
import { VisualizationConfiguration } from 'common/configs/visualization-configuration';
import { VisualizationConfigurationFactory } from 'common/configs/visualization-configuration-factory';
import { TelemetryEventSource } from 'common/extension-telemetry-events';
import { VisualizationType } from 'common/types/visualization-type';
import { PopupActionMessageCreator } from 'popup/actions/popup-action-message-creator';
import { DiagnosticViewToggle } from 'popup/components/diagnostic-view-toggle';
import { DiagnosticViewToggleFactory } from 'popup/components/diagnostic-view-toggle-factory';
import { DiagnosticViewClickHandler } from 'popup/handlers/diagnostic-view-toggle-click-handler';
import * as React from 'react';
import { Mock, MockBehavior } from 'typemoq';
import { ContentLinkDeps } from 'views/content/content-link';
import { ShortcutCommandsTestData } from '../../../common/sample-test-data';
import { VisualizationStoreDataBuilder } from '../../../common/visualization-store-data-builder';

describe('DiagnosticViewToggleFactoryTest', () => {
    const firstVisualizationTypeStub = -1;
    const secondVisualizationTypeStub = -2;
    const thirdAlwaysDisabledVisualizationTypeStub = -3;
    const testVisualizationTypes: VisualizationType[] = [
        firstVisualizationTypeStub,
        secondVisualizationTypeStub,
        thirdAlwaysDisabledVisualizationTypeStub,
    ];

    const featureFlagStub: string = 'test_heading_feature_flag';
    const firstVisualizationConfiguration: VisualizationConfiguration = {
        testMode: TestMode.Adhoc,
        featureFlagToEnable: featureFlagStub,
        launchPanelDisplayOrder: 2,
        adhocToolsPanelDisplayOrder: 1,
    } as VisualizationConfiguration;
    const secondVisualizationConfiguration: VisualizationConfiguration = {
        testMode: TestMode.Adhoc,
        featureFlagToEnable: null,
        launchPanelDisplayOrder: 1,
        adhocToolsPanelDisplayOrder: 2,
    } as VisualizationConfiguration;
    const alwaysDisabledConfiguration: VisualizationConfiguration = {
        testMode: null,
        featureFlagToEnable: null,
        launchPanelDisplayOrder: 1,
        adhocToolsPanelDisplayOrder: 2,
    } as VisualizationConfiguration;

    const visualizationStoreData = new VisualizationStoreDataBuilder().build();
    const domMock = {} as any;
    const deps = {} as ContentLinkDeps;
    const featureFlags = {
        [featureFlagStub]: true,
    };

    let visualizationConfigurationFactoryMock = Mock.ofType<VisualizationConfigurationFactory>();
    let visualizationStoreMock = Mock.ofType(VisualizationStore, MockBehavior.Strict);
    let featureFlagStoreMock = Mock.ofType(FeatureFlagStore);
    let commandStoreMock = Mock.ofType(CommandStore, MockBehavior.Strict);
    let actionMessageCreator = Mock.ofType(PopupActionMessageCreator);
    let clickHandler = Mock.ofType(DiagnosticViewClickHandler);

    beforeEach(() => {
        visualizationConfigurationFactoryMock = Mock.ofType<VisualizationConfigurationFactory>();
        visualizationStoreMock = Mock.ofType(VisualizationStore, MockBehavior.Strict);
        featureFlagStoreMock = Mock.ofType(FeatureFlagStore);
        commandStoreMock = Mock.ofType(CommandStore, MockBehavior.Strict);
        actionMessageCreator = Mock.ofType(PopupActionMessageCreator);
        clickHandler = Mock.ofType(DiagnosticViewClickHandler);
        visualizationConfigurationFactoryMock
            .setup(vcf => vcf.getConfiguration(firstVisualizationTypeStub))
            .returns(() => firstVisualizationConfiguration);

        visualizationConfigurationFactoryMock
            .setup(vcf => vcf.getConfiguration(secondVisualizationTypeStub))
            .returns(() => secondVisualizationConfiguration);

        visualizationConfigurationFactoryMock
            .setup(vcf => vcf.getConfiguration(thirdAlwaysDisabledVisualizationTypeStub))
            .returns(() => alwaysDisabledConfiguration);

        visualizationStoreMock.setup(vs => vs.getState()).returns(() => visualizationStoreData);

        featureFlagStoreMock
            .setup(ff => ff.getState())
            .returns(() => {
                return featureFlags;
            });

        commandStoreMock
            .setup(cs => cs.getState())
            .returns(() => {
                return {
                    commands: ShortcutCommandsTestData,
                };
            });
    });

    test('create toggles for ad hoc tools panel', () => {
        const testObject = new DiagnosticViewToggleFactory(
            deps,
            domMock,
            testVisualizationTypes,
            visualizationConfigurationFactoryMock.object,
            visualizationStoreMock.object,
            featureFlagStoreMock.object,
            commandStoreMock.object,
            actionMessageCreator.object,
            clickHandler.object,
        );

        const source = TelemetryEventSource.AdHocTools;

        const result = testObject.createTogglesForAdHocToolsPanel();

        const expected: JSX.Element[] = [
            <DiagnosticViewToggle
                deps={deps}
                featureFlags={featureFlags}
                dom={domMock}
                visualizationType={firstVisualizationTypeStub}
                key="diagnostic_view_toggle_-1"
                shortcutCommands={ShortcutCommandsTestData}
                visualizationConfigurationFactory={visualizationConfigurationFactoryMock.object}
                actionMessageCreator={actionMessageCreator.object}
                clickHandler={clickHandler.object}
                visualizationStoreData={visualizationStoreData}
                telemetrySource={source}
            />,
            <DiagnosticViewToggle
                deps={deps}
                featureFlags={featureFlags}
                dom={domMock}
                visualizationType={secondVisualizationTypeStub}
                key="diagnostic_view_toggle_-2"
                shortcutCommands={ShortcutCommandsTestData}
                visualizationConfigurationFactory={visualizationConfigurationFactoryMock.object}
                actionMessageCreator={actionMessageCreator.object}
                clickHandler={clickHandler.object}
                visualizationStoreData={visualizationStoreData}
                telemetrySource={source}
            />,
        ];

        expect(result).toEqual(expected);
    });
});
