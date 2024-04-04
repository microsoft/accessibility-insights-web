// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { VisualizationConfiguration } from 'common/configs/visualization-configuration';
import { VisualizationConfigurationFactory } from 'common/configs/visualization-configuration-factory';
import { VisualizationType } from 'common/types/visualization-type';
import { TargetPageStoreData } from 'injected/client-store-listener';
import { DrawingInitiator } from 'injected/drawing-initiator';
import { IsVisualizationEnabledCallback } from 'injected/is-visualization-enabled';
import { SelectorMapHelper } from 'injected/selector-map-helper';
import { SelectorToVisualizationMap } from 'injected/selector-to-visualization-map';
import {
    IsVisualizationNewlyEnabledCallback,
    TargetPageVisualizationUpdater,
} from 'injected/target-page-visualization-updater';
import {
    TestStepVisualizationState,
    VisualizationNeedsUpdateCallback,
} from 'injected/visualization-needs-update';
import { IMock, It, Mock, Times } from 'typemoq';

describe('TargetPageVisualizationUpdater', () => {
    let visualizationConfigurationFactoryMock: IMock<VisualizationConfigurationFactory>;
    let selectorMapHelperMock: IMock<SelectorMapHelper>;
    let drawingInitiatorMock: IMock<DrawingInitiator>;
    let isVisualizationEnabledMock: IMock<IsVisualizationEnabledCallback>;
    let visualizationNeedsUpdateMock: IMock<VisualizationNeedsUpdateCallback>;
    let isVisualizationNewlyEnabledMock: IMock<IsVisualizationNewlyEnabledCallback>;
    let configMock: IMock<VisualizationConfiguration>;
    let testSubject: TargetPageVisualizationUpdater;

    let selectorMapStub: SelectorToVisualizationMap;
    let stepKeyStub: string;
    let storeDataStub: TargetPageStoreData;
    let visualizationTypeStub: VisualizationType | number;
    let configIdStub: string;

    let expectedNewState: TestStepVisualizationState;
    let expectedPreviousState: TestStepVisualizationState | undefined;
    let isVisualizationEnabledResult: boolean;

    beforeEach(() => {
        visualizationConfigurationFactoryMock = Mock.ofType<VisualizationConfigurationFactory>();
        selectorMapHelperMock = Mock.ofType<SelectorMapHelper>();
        drawingInitiatorMock = Mock.ofType<DrawingInitiator>();
        isVisualizationEnabledMock = Mock.ofType<IsVisualizationEnabledCallback>();
        visualizationNeedsUpdateMock = Mock.ofType<VisualizationNeedsUpdateCallback>();
        isVisualizationNewlyEnabledMock = Mock.ofType<IsVisualizationNewlyEnabledCallback>();
        configMock = Mock.ofType<VisualizationConfiguration>();

        selectorMapStub = {};
        stepKeyStub = 'some step key';
        configIdStub = 'some config id';
        storeDataStub = {
            visualizationStoreData: {},
            assessmentStoreData: {},
            tabStoreData: {},
            featureFlagStoreData: {},
            unifiedScanResultStoreData: {},
        } as TargetPageStoreData;
        visualizationTypeStub = -1;

        expectedPreviousState = undefined;
        isVisualizationEnabledResult = true;
        expectedNewState = {
            enabled: isVisualizationEnabledResult,
            selectorMap: selectorMapStub,
        };

        selectorMapHelperMock
            .setup(smhm => smhm.getSelectorMap(visualizationTypeStub, stepKeyStub, storeDataStub))
            .returns(() => selectorMapStub);
        visualizationConfigurationFactoryMock
            .setup(vcfm => vcfm.getConfiguration(visualizationTypeStub))
            .returns(() => configMock.object);
        configMock.setup(cm => cm.getIdentifier(stepKeyStub)).returns(() => configIdStub);
        isVisualizationEnabledMock
            .setup(vnum =>
                vnum(
                    configMock.object,
                    stepKeyStub,
                    storeDataStub.visualizationStoreData,
                    storeDataStub.assessmentStoreData,
                    storeDataStub.tabStoreData,
                ),
            )
            .returns(() => isVisualizationEnabledResult);

        testSubject = new TargetPageVisualizationUpdater(
            visualizationConfigurationFactoryMock.object,
            selectorMapHelperMock.object,
            drawingInitiatorMock.object,
            isVisualizationEnabledMock.object,
            visualizationNeedsUpdateMock.object,
            isVisualizationNewlyEnabledMock.object,
        );
    });

    test('visualization does need not to be updated', async () => {
        expectedNewState.enabled = isVisualizationEnabledResult = true;
        setupVisualizationNeedsUpdateMock(false);

        drawingInitiatorMock
            .setup(dim => dim.disableVisualization(It.isAny(), It.isAny(), It.isAny()))
            .verifiable(Times.never());
        drawingInitiatorMock
            .setup(dim =>
                dim.updateVisualization(It.isAny(), It.isAny(), It.isAny(), It.isAny(), It.isAny()),
            )
            .verifiable(Times.never());

        await testSubject.updateVisualization(visualizationTypeStub, stepKeyStub, storeDataStub);

        drawingInitiatorMock.verifyAll();
        visualizationNeedsUpdateMock.verifyAll();

        await verifyPreviousState(expectedPreviousState);
    });

    test('visualization needs to be enabled', async () => {
        expectedNewState.enabled = isVisualizationEnabledResult = true;
        setupVisualizationNeedsUpdateMock(true);
        setupIsVisualizationNewlyEnabledMock(true);

        const visualizationInstanceProcessorStub = () => null;
        configMock
            .setup(cm => cm.visualizationInstanceProcessor(stepKeyStub))
            .returns(() => visualizationInstanceProcessorStub);
        drawingInitiatorMock
            .setup(dim =>
                dim.enableVisualization(
                    visualizationTypeStub,
                    storeDataStub.featureFlagStoreData,
                    It.isValue(selectorMapStub),
                    configIdStub,
                    visualizationInstanceProcessorStub,
                ),
            )
            .verifiable();

        await testSubject.updateVisualization(visualizationTypeStub, stepKeyStub, storeDataStub);

        drawingInitiatorMock.verifyAll();
        visualizationNeedsUpdateMock.verifyAll();

        await verifyPreviousState(expectedNewState);
    });

    test('visualization needs to be updated', async () => {
        expectedNewState.enabled = isVisualizationEnabledResult = true;
        setupVisualizationNeedsUpdateMock(true);
        setupIsVisualizationNewlyEnabledMock(false);

        const visualizationInstanceProcessorStub = () => null;
        configMock
            .setup(cm => cm.visualizationInstanceProcessor(stepKeyStub))
            .returns(() => visualizationInstanceProcessorStub);
        drawingInitiatorMock
            .setup(dim =>
                dim.updateVisualization(
                    visualizationTypeStub,
                    storeDataStub.featureFlagStoreData,
                    It.isValue(selectorMapStub),
                    configIdStub,
                    visualizationInstanceProcessorStub,
                ),
            )
            .verifiable();

        await testSubject.updateVisualization(visualizationTypeStub, stepKeyStub, storeDataStub);

        drawingInitiatorMock.verifyAll();
        visualizationNeedsUpdateMock.verifyAll();

        await verifyPreviousState(expectedNewState);
    });

    test('visualization needs to be disabled', async () => {
        expectedNewState.enabled = isVisualizationEnabledResult = false;
        setupVisualizationNeedsUpdateMock(true);

        drawingInitiatorMock
            .setup(dim =>
                dim.disableVisualization(
                    visualizationTypeStub,
                    storeDataStub.featureFlagStoreData,
                    configIdStub,
                ),
            )
            .verifiable();

        await testSubject.updateVisualization(visualizationTypeStub, stepKeyStub, storeDataStub);

        drawingInitiatorMock.verifyAll();
        visualizationNeedsUpdateMock.verifyAll();

        await verifyPreviousState(expectedNewState);
    });

    function setupVisualizationNeedsUpdateMock(needsUpdate: boolean): void {
        visualizationNeedsUpdateMock
            .setup(vnum => vnum(expectedNewState, expectedPreviousState))
            .returns(() => needsUpdate);
    }

    function setupIsVisualizationNewlyEnabledMock(isNewlyEnabled: boolean): void {
        isVisualizationNewlyEnabledMock
            .setup(f => f(expectedNewState, expectedPreviousState))
            .returns(() => isNewlyEnabled);
    }

    async function verifyPreviousState(
        expectedPreviousState: TestStepVisualizationState,
    ): Promise<void> {
        visualizationNeedsUpdateMock.reset();
        visualizationNeedsUpdateMock
            .setup(vnum => vnum(It.isAny(), It.isValue(expectedPreviousState)))
            .returns(() => false)
            .verifiable();

        await testSubject.updateVisualization(visualizationTypeStub, stepKeyStub, storeDataStub);

        visualizationNeedsUpdateMock.verifyAll();
    }
});
