// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { VisualizationConfiguration } from 'common/configs/visualization-configuration';
import { VisualizationConfigurationFactory } from 'common/configs/visualization-configuration-factory';
import { VisualizationType } from 'common/types/visualization-type';
import { TargetPageStoreData } from 'injected/client-store-listener';
import { DrawingInitiator } from 'injected/drawing-initiator';
import { AssessmentVisualizationInstance } from 'injected/frameCommunicators/html-element-axe-results-helper';
import { IsVisualizationEnabledCallback } from 'injected/is-visualization-enabled';
import { SelectorMapHelper } from 'injected/selector-map-helper';
import {
    TargetPageVisualizationUpdater,
    VisualizationSelectorMapContainer,
} from 'injected/target-page-visualization-updater';
import { VisualizationNeedsUpdateCallback } from 'injected/visualization-needs-update';
import { IMock, It, Mock, Times } from 'typemoq';
import { DictionaryStringTo } from 'types/common-types';

describe('TargetPageVisualizationUpdater', () => {
    let visualizationConfigurationFactoryMock: IMock<VisualizationConfigurationFactory>;
    let selectorMapHelperMock: IMock<SelectorMapHelper>;
    let drawingInitiatorMock: IMock<DrawingInitiator>;
    let isVisualizationEnabledMock: IMock<IsVisualizationEnabledCallback>;
    let visualizationNeedsUpdateMock: IMock<VisualizationNeedsUpdateCallback>;
    let configMock: IMock<VisualizationConfiguration>;
    let testSubject: TargetPageVisualizationUpdater;

    let selectorMapStub: SelectorToVisualizationMap;
    let stepKeyStub: string;
    let storeDataStub: TargetPageStoreData;
    let newVisualizationEnabledStateStub: boolean;
    let visualizationTypeStub: VisualizationType;
    let configIdStub: string;

    beforeEach(() => {
        visualizationConfigurationFactoryMock = Mock.ofType<VisualizationConfigurationFactory>();
        selectorMapHelperMock = Mock.ofType<SelectorMapHelper>();
        drawingInitiatorMock = Mock.ofType<DrawingInitiator>();
        isVisualizationEnabledMock = Mock.ofType<IsVisualizationEnabledCallback>();
        visualizationNeedsUpdateMock = Mock.ofType<VisualizationNeedsUpdateCallback>();
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

        newVisualizationEnabledStateStub = true;

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
            .returns(() => newVisualizationEnabledStateStub);

        testSubject = new TargetPageVisualizationUpdater(
            visualizationConfigurationFactoryMock.object,
            selectorMapHelperMock.object,
            drawingInitiatorMock.object,
            isVisualizationEnabledMock.object,
            visualizationNeedsUpdateMock.object,
        );
    });

    test('visualization does need not to be updated', () => {
        setupVisualizationNeedsUpdateMock(false);
        drawingInitiatorMock
            .setup(dim => dim.disableVisualization(It.isAny(), It.isAny(), It.isAny()))
            .verifiable(Times.never());
        drawingInitiatorMock
            .setup(dim =>
                dim.enableVisualization(It.isAny(), It.isAny(), It.isAny(), It.isAny(), It.isAny()),
            )
            .verifiable(Times.never());

        testSubject.updateVisualization(visualizationTypeStub, stepKeyStub, storeDataStub);

        drawingInitiatorMock.verifyAll();
        verifyPreviousStates({}, { [visualizationTypeStub]: selectorMapStub });
    });

    test('visualization needs to be enabled', () => {
        const visualizationInstanceProcessorStub = () => null;
        configMock
            .setup(cm => cm.visualizationInstanceProcessor(stepKeyStub))
            .returns(() => visualizationInstanceProcessorStub);
        setupVisualizationNeedsUpdateMock(true);
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

        testSubject.updateVisualization(visualizationTypeStub, stepKeyStub, storeDataStub);

        drawingInitiatorMock.verifyAll();
        verifyPreviousStates(
            { [configIdStub]: newVisualizationEnabledStateStub },
            { [visualizationTypeStub]: selectorMapStub },
        );
    });

    test('visualization needs to be disabled', () => {
        setupVisualizationNeedsUpdateMock(true);
        newVisualizationEnabledStateStub = false;
        drawingInitiatorMock
            .setup(dim =>
                dim.disableVisualization(
                    visualizationTypeStub,
                    storeDataStub.featureFlagStoreData,
                    configIdStub,
                ),
            )
            .verifiable();

        testSubject.updateVisualization(visualizationTypeStub, stepKeyStub, storeDataStub);

        drawingInitiatorMock.verifyAll();
        verifyPreviousStates(
            { [configIdStub]: newVisualizationEnabledStateStub },
            { [visualizationTypeStub]: selectorMapStub },
        );
    });

    function setupVisualizationNeedsUpdateMock(needsUpdate: boolean): void {
        visualizationNeedsUpdateMock
            .setup(vnum =>
                vnum(
                    visualizationTypeStub,
                    configIdStub,
                    newVisualizationEnabledStateStub,
                    selectorMapStub,
                    It.isValue({}),
                    It.isValue({}),
                ),
            )
            .returns(() => needsUpdate);
    }

    function verifyPreviousStates(
        expectedVisualizationStates: DictionaryStringTo<boolean>,
        expectedSelectorMapStates: VisualizationSelectorMapContainer,
    ): void {
        visualizationNeedsUpdateMock.reset();
        visualizationNeedsUpdateMock
            .setup(vnum =>
                vnum(
                    visualizationTypeStub,
                    configIdStub,
                    newVisualizationEnabledStateStub,
                    selectorMapStub,
                    It.isValue(expectedVisualizationStates),
                    It.isValue(expectedSelectorMapStates),
                ),
            )
            .returns(() => false)
            .verifiable();

        testSubject.updateVisualization(visualizationTypeStub, stepKeyStub, storeDataStub);

        visualizationNeedsUpdateMock.verifyAll();
    }
});
