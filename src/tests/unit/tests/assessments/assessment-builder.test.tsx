// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as _ from 'lodash';
import * as React from 'react';
import { It, Mock, MockBehavior, Times } from 'typemoq';

import { AssessmentBuilder } from '../../../../assessments/assessment-builder';
import { IAssistedAssessment, IManualAssessment } from '../../../../assessments/types/iassessment';
import { ReportInstanceField } from '../../../../assessments/types/report-instance-field';
import { TestStep } from '../../../../assessments/types/test-step';
import { InstanceIdentifierGenerator } from '../../../../background/instance-identifier-generator';
import { RequirementComparer } from '../../../../common/assessment/requirement-comparer';
import { Messages } from '../../../../common/messages';
import { TelemetryDataFactory } from '../../../../common/telemetry-data-factory';
import { ManualTestStatus } from '../../../../common/types/manual-test-status';
import { IAssessmentScanData, ITestsEnabledState } from '../../../../common/types/store-data/ivisualization-store-data';
import { VisualizationType } from '../../../../common/types/visualization-type';
import { AssessmentInstanceTable } from '../../../../DetailsView/components/assessment-instance-table';
import { AssessmentTestView } from '../../../../DetailsView/components/assessment-test-view';
import { TestStepLink } from '../../../../DetailsView/components/test-step-link';
import { TestViewProps } from '../../../../DetailsView/components/test-view';
import { AnalyzerProvider } from '../../../../injected/analyzers/analyzer-provider';
import { IAnalyzerConfiguration } from '../../../../injected/analyzers/ianalyzer';
import { DecoratedAxeNodeResult, ScannerUtils } from '../../../../injected/scanner-utils';
import { VisualizationInstanceProcessor } from '../../../../injected/visualization-instance-processor';
import { DrawerProvider } from '../../../../injected/visualization/drawer-provider';

describe('AssessmentBuilderTest', () => {

    test('Manual', () => {
        const selectedTestStepKey = 'test step key';
        const analyzerProviderMock = Mock.ofType(AnalyzerProvider);
        const drawerProviderMock = Mock.ofType(DrawerProvider);
        const getInstanceIdentifierMock = Mock.ofInstance(() => null);
        const testViewPropsStub = {} as TestViewProps;
        const expectedTestView = <AssessmentTestView {...testViewPropsStub} />;

        const testStep: TestStep = {
            description: <div>description<span>dot should get removed.</span></div>,
            howToTest: <div>how to test</div>,
            isManual: true,
            key: selectedTestStepKey,
            guidanceLinks: [],
            name: 'test step name',
            generateInstanceIdentifier: getInstanceIdentifierMock.object,
            updateVisibility: false,
        };

        const testStep2: TestStep = _.cloneDeep(testStep);
        testStep2.key = 'step2';
        testStep2.generateInstanceIdentifier = null;
        testStep2.updateVisibility = null;

        const baseAssessment: IManualAssessment = {
            key: 'manualAssessmentKey',
            type: -1 as VisualizationType,
            title: 'manual assessment title',
            gettingStarted: <span>getting started</span>,
            steps: [testStep, testStep2],
        };

        const nonDefaultAssessment: IManualAssessment = {
            ...baseAssessment,
            executeAssessmentScanPolicy: () => null,
            steps: [],
        };

        const expectedConfig: IAnalyzerConfiguration = {
            key: testStep.key,
            testType: baseAssessment.type,
            analyzerMessageType: Messages.Assessment.AssessmentScanCompleted,
        };

        analyzerProviderMock
            .setup(a => a.createBaseAnalyzer(It.isValue(expectedConfig)))
            .verifiable(Times.once());

        drawerProviderMock
            .setup(d => d.createNullDrawer())
            .verifiable(Times.once());

        const manual = AssessmentBuilder.Manual(baseAssessment);

        expect(manual.requirementOrder).toBe(RequirementComparer.byOrdinal);

        Object.keys(baseAssessment).forEach(assessmentKey => {
            expect(manual[assessmentKey]).toEqual(baseAssessment[assessmentKey]);
        });

        expect(manual.executeAssessmentScanPolicy).toBeDefined();

        const nonDefaultManual = AssessmentBuilder.Manual(nonDefaultAssessment);

        Object.keys(nonDefaultAssessment).forEach(assessmentKey => {
            expect(nonDefaultManual[assessmentKey]).toEqual(nonDefaultAssessment[assessmentKey]);
        });

        const { comment } = ReportInstanceField.common;
        expect(testStep.reportInstanceFields).toEqual([comment]);

        const config = manual.getVisualizationConfiguration();
        const key = testStep.key;
        const scanData = { enabled: true, stepStatus: { key: true } } as IAssessmentScanData;
        const vizStoreData = { assessments: { manualAssessmentKeyAssessment: scanData } } as any;
        expect(config.getStoreData(vizStoreData)).toEqual(scanData);

        expect(config.analyzerMessageType).toEqual(Messages.Assessment.AssessmentScanCompleted);
        expect(config.getIdentifier(selectedTestStepKey)).toBe(testStep.key);
        expect(config.visualizationInstanceProcessor()).toBe(VisualizationInstanceProcessor.nullProcessor);
        expect(config.getInstanceIdentiferGenerator(selectedTestStepKey)).toBe(getInstanceIdentifierMock.object);
        expect(<div>description<span>dot should get removed</span></div>).toEqual(testStep.renderReportDescription());
        expect(<div>description<span>dot should get removed</span></div>).toEqual(testStep2.renderReportDescription());
        expect(config.getInstanceIdentiferGenerator(testStep2.key)).toEqual(InstanceIdentifierGenerator.defaultHtmlSelectorIdentifier);
        expect(config.getInstanceIdentiferGenerator('non existent key')).toEqual(InstanceIdentifierGenerator.defaultHtmlSelectorIdentifier);
        expect(config.getUpdateVisibility(selectedTestStepKey)).toBe(false);
        expect(config.getUpdateVisibility(testStep2.key)).toBe(true);
        expect(config.getUpdateVisibility('non existent key')).toBe(true);
        expect(config.getTestView(testViewPropsStub)).toEqual(expectedTestView);

        validateInstanceTableSettings(testStep);

        config.getAnalyzer(analyzerProviderMock.object, selectedTestStepKey);
        config.getDrawer(drawerProviderMock.object);
        const expectedData = {
            key: 'value',
        };
        const assessmentData = {
            assessments: {
                [baseAssessment.key]: expectedData,
            },
        };
        expect(config.getAssessmentData(assessmentData as any)).toEqual(expectedData);
        analyzerProviderMock.verifyAll();
        drawerProviderMock.verifyAll();
    });

    test('Assisted', () => {
        const testViewPropsStub = {} as TestViewProps;
        const expectedTestView = <AssessmentTestView {...testViewPropsStub} />;
        const selectedTestStepKey = 'test step key';
        const providerMock = Mock.ofType(AnalyzerProvider);
        const visualizationInstanceProcessorMock = Mock.ofInstance(() => null);
        const getInstanceIdentifierMock = Mock.ofInstance(() => null);
        const drawerProviderMock = Mock.ofType(DrawerProvider);
        const getAnalyzerMock = Mock.ofInstance(provider => { return null; });
        getAnalyzerMock
            .setup(gam => gam(providerMock.object))
            .verifiable(Times.once());
        const getDrawerMock = Mock.ofInstance((provider, ffStoreData?) => null);
        getDrawerMock
            .setup(gdm => gdm(drawerProviderMock.object, undefined))
            .verifiable(Times.once());

        const testStep1: TestStep = {
            description: <div><span>dot should get removed</span>description.</div>,
            howToTest: <div>how to test</div>,
            isManual: true,
            key: selectedTestStepKey,
            guidanceLinks: [],
            name: 'test step name',
            getAnalyzer: getAnalyzerMock.object,
            visualizationInstanceProcessor: visualizationInstanceProcessorMock.object,
            generateInstanceIdentifier: getInstanceIdentifierMock.object,
            getDrawer: getDrawerMock.object,
            switchToTargetTabOnScan: true,
            updateVisibility: false,
        };
        const scannerStub = {
            getAllCompletedInstances: {},
        };
        const telemetryFactoryStub = {
            forAssessmentRequirementScan: {},
        };
        const testStep2: TestStep = _.cloneDeep(testStep1);
        testStep2.key = 'step2';
        const testStep3: TestStep = _.cloneDeep(testStep1);
        testStep3.key = 'step3';
        const testStep4: TestStep = _.cloneDeep(testStep1);
        testStep4.key = 'step4';
        const extraField = { key: 'extra', label: 'extra', getValue: i => 'extra' };
        testStep4.reportInstanceFields = [extraField];
        const testStep5: TestStep = _.cloneDeep(testStep1);
        testStep5.key = 'step5';
        testStep5.getAnalyzer = null;
        testStep5.visualizationInstanceProcessor = null;
        testStep5.getDrawer = null;
        testStep5.switchToTargetTabOnScan = null;
        testStep5.generateInstanceIdentifier = null;
        testStep5.updateVisibility = null;
        testStep5.isManual = false;
        const testStep6: TestStep = _.cloneDeep(testStep1);
        testStep6.key = 'step6';
        const getInstanceStatus6 = () => ManualTestStatus.PASS;
        testStep6.getInstanceStatus = getInstanceStatus6;
        const getInstanceStatusColumns6 = () => [];
        testStep6.getInstanceStatusColumns = getInstanceStatusColumns6;
        const renderInstanceTableHeader6 = () => <div>6</div>;
        testStep6.renderInstanceTableHeader = renderInstanceTableHeader6;
        const renderRequirementDescription6 = () => <span>6</span>;
        testStep6.renderRequirementDescription = renderRequirementDescription6;

        const assistedAssessment: IAssistedAssessment = {
            key: 'manual assessment key',
            type: -1 as VisualizationType,
            title: 'manual assessment title',
            gettingStarted: <span>getting started</span>,
            steps: [testStep1, testStep2, testStep3, testStep4, testStep5, testStep6],
            storeDataKey: 'headingsAssessment',
            visualizationConfiguration: {
                analyzerMessageType: Messages.Assessment.AssessmentScanCompleted,
            },
            requirementOrder: RequirementComparer.byOutcomeAndName,
        };

        const nonDefaultAssessment = {
            ...assistedAssessment,
            executeAssessmentScanPolicy: () => null,
            steps: [],
        };

        const assisted = AssessmentBuilder.Assisted(assistedAssessment);
        const nonDefaultAssisted = AssessmentBuilder.Assisted(nonDefaultAssessment);

        expect(assisted.requirementOrder).toBe(RequirementComparer.byOutcomeAndName);
        expect(nonDefaultAssisted.requirementOrder).toBe(RequirementComparer.byOutcomeAndName);


        const { comment, snippet, path } = ReportInstanceField.common;
        const manualSteps = [testStep1, testStep2, testStep3, testStep3];
        manualSteps.forEach(step => { expect(step.reportInstanceFields).toEqual([comment]); });
        expect(testStep4.reportInstanceFields).toEqual([comment, extraField]);
        expect(testStep5.reportInstanceFields).toEqual([path, snippet]);

        Object.keys(assistedAssessment).forEach(assessmentKey => {
            expect(assisted[assessmentKey]).toEqual(assistedAssessment[assessmentKey]);
        });

        Object.keys(nonDefaultAssessment).forEach(assessmentKey => {
            expect(nonDefaultAssisted[assessmentKey]).toEqual(nonDefaultAssessment[assessmentKey]);
        });

        expect(assisted.executeAssessmentScanPolicy).toBeDefined();

        const config = assisted.getVisualizationConfiguration();
        const key = testStep1.key;
        const scanData = { enabled: true, stepStatus: {} } as IAssessmentScanData;
        scanData.stepStatus[key] = true;
        const vizStoreData = { assessments: { headingsAssessment: scanData }, adhoc: {} } as ITestsEnabledState;

        config.getAnalyzer(providerMock.object, testStep1.key);
        config.getDrawer(drawerProviderMock.object, testStep1.key);

        providerMock
            .setup(pm => pm.createBaseAnalyzer(It.isAny()))
            .verifiable(Times.once());
        drawerProviderMock
            .setup(pm => pm.createNullDrawer())
            .verifiable(Times.once());

        config.getAnalyzer(providerMock.object, testStep5.key);
        config.getDrawer(drawerProviderMock.object, testStep5.key);

        expect(config.getStoreData(vizStoreData)).toEqual(scanData);
        expect(config.analyzerMessageType).toEqual(Messages.Assessment.AssessmentScanCompleted);
        expect(config.resultProcessor(scannerStub as ScannerUtils)).toEqual(scannerStub.getAllCompletedInstances);
        expect(
            config.telemetryProcessor(telemetryFactoryStub as TelemetryDataFactory),
        ).toEqual(telemetryFactoryStub.forAssessmentRequirementScan);
        expect(config.getIdentifier(selectedTestStepKey)).toBe(testStep1.key);
        expect(config.visualizationInstanceProcessor(selectedTestStepKey)).toBe(visualizationInstanceProcessorMock.object);
        expect(config.visualizationInstanceProcessor(testStep5.key)).toBe(VisualizationInstanceProcessor.nullProcessor);
        expect(config.visualizationInstanceProcessor('non existent key')).toBe(VisualizationInstanceProcessor.nullProcessor);
        expect(config.getTestStatus(scanData, testStep1.key)).toBe(true);
        expect(config.getTestStatus(scanData, testStep5.key)).toBe(false);
        expect(config.getSwitchToTargetTabOnScan(testStep1.key)).toBe(true);
        expect(config.getSwitchToTargetTabOnScan(testStep5.key)).toBe(false);
        expect(config.getInstanceIdentiferGenerator(selectedTestStepKey)).toEqual(getInstanceIdentifierMock.object);
        expect(testStep1.renderReportDescription()).toEqual(<div><span>dot should get removed</span>description</div>);
        expect(config.getInstanceIdentiferGenerator(testStep5.key)).toEqual(InstanceIdentifierGenerator.defaultHtmlSelectorIdentifier);
        expect(config.getInstanceIdentiferGenerator('non existent key')).toEqual(InstanceIdentifierGenerator.defaultHtmlSelectorIdentifier);
        expect(config.getUpdateVisibility(selectedTestStepKey)).toBe(false);
        expect(config.getUpdateVisibility(testStep5.key)).toBe(true);
        expect(config.getUpdateVisibility('non existent key')).toBe(true);
        expect(config.getTestView(testViewPropsStub)).toEqual(expectedTestView);

        validateInstanceTableSettings(testStep1);
        validateInstanceTableSettings(testStep5);
        expect(testStep6.getInstanceStatus).toBe(getInstanceStatus6);
        expect(testStep6.getInstanceStatusColumns).toBe(getInstanceStatusColumns6);
        expect(testStep6.renderInstanceTableHeader).toBe(renderInstanceTableHeader6);
        expect(testStep6.renderRequirementDescription).toBe(renderRequirementDescription6);

        const expectedData = {
            key: 'value',
        };
        const assessmentData = {
            assessments: {
                [assistedAssessment.key]: expectedData,
            },
        };

        getAnalyzerMock.verifyAll();
        getDrawerMock.verifyAll();
        providerMock.verifyAll();
        drawerProviderMock.verifyAll();
        expect(config.getAssessmentData(assessmentData as any)).toEqual(expectedData);
    });

    function validateInstanceTableSettings(testStep: TestStep) {
        expect(testStep.getInstanceStatus).toBeDefined();
        expect(testStep.getInstanceStatus({} as DecoratedAxeNodeResult)).toBe(ManualTestStatus.UNKNOWN);

        expect(testStep.getInstanceStatusColumns).toBeDefined();
        const columns = testStep.getInstanceStatusColumns();
        expect(columns).toHaveLength(1);
        expect(columns[0]).toEqual({
            key: 'statusChoiceGroup',
            name: 'Pass / Fail',
            ariaLabel: 'Pass',
            fieldName: 'statusChoiceGroup',
            minWidth: 100,
            maxWidth: 100,
            isResizable: false,
        });

        const tableMock = Mock.ofType(AssessmentInstanceTable, MockBehavior.Strict);
        const headerStub = <div>Header</div>;
        tableMock
            .setup(tm => tm.renderDefaultInstanceTableHeader(It.isValue([])))
            .returns(() => headerStub)
            .verifiable(Times.once());
        expect(testStep.renderInstanceTableHeader).toBeDefined();
        expect(testStep.renderInstanceTableHeader(tableMock.object, [])).toBe(headerStub);
        tableMock.verifyAll();

        const linkMock = Mock.ofType(TestStepLink, MockBehavior.Strict);
        const descriptionStub = <div>descriptionStub</div>;
        linkMock
            .setup(lm => lm.renderRequirementDescriptionWithIndex())
            .returns(() => descriptionStub)
            .verifiable(Times.once());
        expect(testStep.renderRequirementDescription).toBeDefined();
        expect(testStep.renderRequirementDescription(linkMock.object)).toBe(descriptionStub);
        linkMock.verifyAll();
    }
});
