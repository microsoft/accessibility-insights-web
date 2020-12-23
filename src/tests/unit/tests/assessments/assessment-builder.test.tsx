// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentBuilder } from 'assessments/assessment-builder';
import { AssistedAssessment, ManualAssessment } from 'assessments/types/iassessment';
import { ReportInstanceField } from 'assessments/types/report-instance-field';
import { Requirement } from 'assessments/types/requirement';
import { AssessmentToggleActionPayload } from 'background/actions/action-payloads';
import { createInitialAssessmentTestData } from 'background/create-initial-assessment-test-data';
import { InstanceIdentifierGenerator } from 'background/instance-identifier-generator';
import { cloneDeep } from 'lodash';
import * as React from 'react';
import { It, Mock, Times } from 'typemoq';
import { RequirementComparer } from '../../../../common/assessment/requirement-comparer';
import { Messages } from '../../../../common/messages';
import { TelemetryDataFactory } from '../../../../common/telemetry-data-factory';
import { ManualTestStatus } from '../../../../common/types/manual-test-status';
import {
    AssessmentScanData,
    TestsEnabledState,
} from '../../../../common/types/store-data/visualization-store-data';
import { VisualizationType } from '../../../../common/types/visualization-type';
import { AnalyzerConfiguration } from '../../../../injected/analyzers/analyzer';
import { AnalyzerProvider } from '../../../../injected/analyzers/analyzer-provider';
import { DecoratedAxeNodeResult } from '../../../../injected/scanner-utils';
import { VisualizationInstanceProcessor } from '../../../../injected/visualization-instance-processor';
import { DrawerProvider } from '../../../../injected/visualization/drawer-provider';

describe('AssessmentBuilderTest', () => {
    test('Manual', () => {
        const selectedRequirementKey = 'requirement key';
        const analyzerProviderMock = Mock.ofType(AnalyzerProvider);
        const drawerProviderMock = Mock.ofType(DrawerProvider);
        const getInstanceIdentifierMock = Mock.ofInstance(() => null);

        const requirement: Requirement = {
            description: (
                <div>
                    description<span>dot should get removed.</span>
                </div>
            ),
            howToTest: <div>how to test</div>,
            isManual: true,
            key: selectedRequirementKey,
            guidanceLinks: [],
            name: 'requirement name',
            generateInstanceIdentifier: getInstanceIdentifierMock.object,
        };

        const requirement2: Requirement = cloneDeep(requirement);
        requirement2.key = 'requirement2';
        requirement2.generateInstanceIdentifier = null;

        const baseAssessment: ManualAssessment = {
            key: 'manualAssessmentKey',
            visualizationType: -1 as VisualizationType,
            title: 'manual assessment title',
            gettingStarted: <span>getting started</span>,
            requirements: [requirement, requirement2],
        };

        const nonDefaultAssessment: ManualAssessment = {
            ...baseAssessment,
            requirements: [],
        };

        const expectedConfig: AnalyzerConfiguration = {
            key: requirement.key,
            testType: baseAssessment.visualizationType,
            analyzerMessageType: Messages.Assessment.AssessmentScanCompleted,
        };

        analyzerProviderMock
            .setup(a => a.createBaseAnalyzer(It.isValue(expectedConfig)))
            .verifiable(Times.once());

        drawerProviderMock.setup(d => d.createNullDrawer()).verifiable(Times.once());

        const manual = AssessmentBuilder.Manual(baseAssessment);

        expect(manual.requirementOrder).toBe(RequirementComparer.byOrdinal);
        expect(manual.initialDataCreator).toBe(createInitialAssessmentTestData);

        Object.keys(baseAssessment).forEach(assessmentKey => {
            expect(manual[assessmentKey]).toEqual(baseAssessment[assessmentKey]);
        });

        const nonDefaultManual = AssessmentBuilder.Manual(nonDefaultAssessment);

        Object.keys(nonDefaultAssessment).forEach(assessmentKey => {
            expect(nonDefaultManual[assessmentKey]).toEqual(nonDefaultAssessment[assessmentKey]);
        });

        const { comment, manualPath, manualSnippet } = ReportInstanceField.common;
        expect(requirement.reportInstanceFields).toEqual([comment, manualPath, manualSnippet]);

        const config = manual.getVisualizationConfiguration();
        const scanData = { enabled: true, stepStatus: { key: true } } as AssessmentScanData;
        const vizStoreData = { assessments: { manualAssessmentKeyAssessment: scanData } } as any;
        expect(config.getStoreData(vizStoreData)).toEqual(scanData);

        const testRequirement = 'testRequirement';
        config.enableTest(vizStoreData, {
            requirement: testRequirement,
        } as AssessmentToggleActionPayload);
        expect(vizStoreData.assessments.manualAssessmentKeyAssessment.enabled).toBe(true);
        expect(
            vizStoreData.assessments.manualAssessmentKeyAssessment.stepStatus[testRequirement],
        ).toBe(true);

        expect(config.getIdentifier(selectedRequirementKey)).toBe(requirement.key);
        expect(config.visualizationInstanceProcessor()).toBe(
            VisualizationInstanceProcessor.nullProcessor,
        );
        expect(config.getInstanceIdentiferGenerator(selectedRequirementKey)).toBe(
            getInstanceIdentifierMock.object,
        );
        expect(
            <div>
                description<span>dot should get removed</span>
            </div>,
        ).toEqual(requirement.renderReportDescription());
        expect(
            <div>
                description<span>dot should get removed</span>
            </div>,
        ).toEqual(requirement2.renderReportDescription());
        expect(config.getInstanceIdentiferGenerator(requirement2.key)).toEqual(
            InstanceIdentifierGenerator.defaultHtmlSelectorIdentifier,
        );
        expect(config.getInstanceIdentiferGenerator('non existent key')).toEqual(
            InstanceIdentifierGenerator.defaultHtmlSelectorIdentifier,
        );
        expect(config.testViewType).toBe('Assessment');

        validateInstanceTableSettings(requirement);

        config.getAnalyzer(analyzerProviderMock.object, selectedRequirementKey);
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
        const selectedRequirementKey = 'requirement key';
        const providerMock = Mock.ofType(AnalyzerProvider);
        const visualizationInstanceProcessorMock = Mock.ofInstance(() => null);
        const getInstanceIdentifierMock = Mock.ofInstance(() => null);
        const drawerProviderMock = Mock.ofType(DrawerProvider);
        const getAnalyzerMock = Mock.ofInstance(provider => {
            return null;
        });
        getAnalyzerMock.setup(gam => gam(providerMock.object)).verifiable(Times.once());
        const getDrawerMock = Mock.ofInstance((provider, ffStoreData?) => null);
        getDrawerMock
            .setup(gdm => gdm(drawerProviderMock.object, undefined))
            .verifiable(Times.once());

        const requirement1: Requirement = {
            description: (
                <div>
                    <span>dot should get removed</span>description.
                </div>
            ),
            howToTest: <div>how to test</div>,
            isManual: true,
            key: selectedRequirementKey,
            guidanceLinks: [],
            name: 'requirement name',
            getAnalyzer: getAnalyzerMock.object,
            visualizationInstanceProcessor: visualizationInstanceProcessorMock.object,
            generateInstanceIdentifier: getInstanceIdentifierMock.object,
            getDrawer: getDrawerMock.object,
            switchToTargetTabOnScan: true,
        };
        const telemetryFactoryStub = {
            forAssessmentRequirementScan: {},
        };
        const requirement2: Requirement = cloneDeep(requirement1);
        requirement2.key = 'requirement2';
        const requirement3: Requirement = cloneDeep(requirement1);
        requirement3.key = 'requirement3';
        const requirement4: Requirement = cloneDeep(requirement1);
        requirement4.key = 'requirement4';
        const extraField = { key: 'extra', label: 'extra', getValue: i => 'extra' };
        requirement4.reportInstanceFields = [extraField];
        const requirement5: Requirement = cloneDeep(requirement1);
        requirement5.key = 'requirement5';
        requirement5.getAnalyzer = null;
        requirement5.visualizationInstanceProcessor = null;
        requirement5.getDrawer = null;
        requirement5.switchToTargetTabOnScan = null;
        requirement5.generateInstanceIdentifier = null;
        requirement5.isManual = false;
        const requirement6: Requirement = cloneDeep(requirement1);
        requirement6.key = 'requirement6';
        const getInstanceStatus6 = () => ManualTestStatus.PASS;
        requirement6.getInstanceStatus = getInstanceStatus6;
        const getInstanceStatusColumns6 = () => [];
        requirement6.getInstanceStatusColumns = getInstanceStatusColumns6;
        const instanceTableHeaderType6 = 'none';
        requirement6.instanceTableHeaderType = instanceTableHeaderType6;

        const assistedAssessment: AssistedAssessment = {
            key: 'manual assessment key',
            visualizationType: -1 as VisualizationType,
            title: 'manual assessment title',
            gettingStarted: <span>getting started</span>,
            requirements: [
                requirement1,
                requirement2,
                requirement3,
                requirement4,
                requirement5,
                requirement6,
            ],
            storeDataKey: 'headingsAssessment',
            visualizationConfiguration: {},
            requirementOrder: RequirementComparer.byOutcomeAndName,
        };

        const nonDefaultAssessment: AssistedAssessment = {
            ...assistedAssessment,
            requirements: [],
        };

        const assisted = AssessmentBuilder.Assisted(assistedAssessment);
        const nonDefaultAssisted = AssessmentBuilder.Assisted(nonDefaultAssessment);

        expect(assisted.requirementOrder).toBe(RequirementComparer.byOutcomeAndName);
        expect(nonDefaultAssisted.requirementOrder).toBe(RequirementComparer.byOutcomeAndName);

        const { comment, snippet, path, manualSnippet, manualPath } = ReportInstanceField.common;
        const manualRequirement = [requirement1, requirement2, requirement3, requirement3];
        manualRequirement.forEach(requirement => {
            expect(requirement.reportInstanceFields).toEqual([comment, manualPath, manualSnippet]);
        });
        expect(requirement4.reportInstanceFields).toEqual([
            comment,
            manualPath,
            manualSnippet,
            extraField,
        ]);
        expect(requirement5.reportInstanceFields).toEqual([path, snippet]);

        Object.keys(assistedAssessment).forEach(assessmentKey => {
            expect(assisted[assessmentKey]).toEqual(assistedAssessment[assessmentKey]);
        });

        Object.keys(nonDefaultAssessment).forEach(assessmentKey => {
            expect(nonDefaultAssisted[assessmentKey]).toEqual(nonDefaultAssessment[assessmentKey]);
        });

        const config = assisted.getVisualizationConfiguration();
        const key = requirement1.key;
        const scanData = { enabled: true, stepStatus: {} } as AssessmentScanData;
        scanData.stepStatus[key] = true;
        const vizStoreData = {
            assessments: { headingsAssessment: scanData },
            adhoc: {},
        } as TestsEnabledState;

        config.getAnalyzer(providerMock.object, requirement1.key);
        config.getDrawer(drawerProviderMock.object, requirement1.key);

        providerMock.setup(pm => pm.createBaseAnalyzer(It.isAny())).verifiable(Times.once());
        drawerProviderMock.setup(pm => pm.createNullDrawer()).verifiable(Times.once());

        config.getAnalyzer(providerMock.object, requirement5.key);
        config.getDrawer(drawerProviderMock.object, requirement5.key);

        const testRequirement = 'testRequirement';
        config.enableTest(vizStoreData, {
            requirement: testRequirement,
        } as AssessmentToggleActionPayload);
        expect(vizStoreData.assessments.headingsAssessment.enabled).toBe(true);
        expect(vizStoreData.assessments.headingsAssessment.stepStatus[testRequirement]).toBe(true);

        expect(config.getStoreData(vizStoreData)).toEqual(scanData);
        expect(config.telemetryProcessor(telemetryFactoryStub as TelemetryDataFactory)).toEqual(
            telemetryFactoryStub.forAssessmentRequirementScan,
        );
        expect(config.getIdentifier(selectedRequirementKey)).toBe(requirement1.key);
        expect(config.visualizationInstanceProcessor(selectedRequirementKey)).toBe(
            visualizationInstanceProcessorMock.object,
        );
        expect(config.visualizationInstanceProcessor(requirement5.key)).toBe(
            VisualizationInstanceProcessor.nullProcessor,
        );
        expect(config.visualizationInstanceProcessor('non existent key')).toBe(
            VisualizationInstanceProcessor.nullProcessor,
        );
        expect(config.getTestStatus(scanData, requirement1.key)).toBe(true);
        expect(config.getTestStatus(scanData, requirement5.key)).toBe(false);
        expect(config.getSwitchToTargetTabOnScan(requirement1.key)).toBe(true);
        expect(config.getSwitchToTargetTabOnScan(requirement5.key)).toBe(false);
        expect(config.getInstanceIdentiferGenerator(selectedRequirementKey)).toEqual(
            getInstanceIdentifierMock.object,
        );
        expect(requirement1.renderReportDescription()).toEqual(
            <div>
                <span>dot should get removed</span>description
            </div>,
        );
        expect(config.getInstanceIdentiferGenerator(requirement5.key)).toEqual(
            InstanceIdentifierGenerator.defaultHtmlSelectorIdentifier,
        );
        expect(config.getInstanceIdentiferGenerator('non existent key')).toEqual(
            InstanceIdentifierGenerator.defaultHtmlSelectorIdentifier,
        );
        expect(config.testViewType).toBe('Assessment');

        validateInstanceTableSettings(requirement1);
        validateInstanceTableSettings(requirement5);
        expect(requirement6.getInstanceStatus).toBe(getInstanceStatus6);
        expect(requirement6.getInstanceStatusColumns).toBe(getInstanceStatusColumns6);
        expect(requirement6.instanceTableHeaderType).toBe(instanceTableHeaderType6);

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

    function validateInstanceTableSettings(requirement: Requirement): void {
        expect(requirement.getInstanceStatus).toBeDefined();
        expect(requirement.getInstanceStatus({} as DecoratedAxeNodeResult)).toBe(
            ManualTestStatus.UNKNOWN,
        );

        expect(requirement.getInstanceStatusColumns).toBeDefined();
        const columns = requirement.getInstanceStatusColumns();
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

        expect(requirement.instanceTableHeaderType).toBe('default');
    }
});
