// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentStore } from 'background/stores/assessment-store';
import { VisualizationConfiguration } from 'common/configs/visualization-configuration';
import { VisualizationConfigurationFactory } from 'common/configs/visualization-configuration-factory';
import { AssessmentCardSelectionMessageCreator } from 'common/message-creators/assessment-card-selection-message-creator';
import { AssessmentCardSelectionMessageCreatorWrapper } from 'common/message-creators/assessment-card-selection-message-creator-wrapper';
import { AssessmentStoreData } from 'common/types/store-data/assessment-result-data';
import { IMock, Mock, Times } from 'typemoq';

describe('AssessmentCardSelectionMessageCreatorWrapper', () => {
    let testSubject: AssessmentCardSelectionMessageCreatorWrapper;
    let assessmentCardSelectionMessageCreatorMock: IMock<AssessmentCardSelectionMessageCreator>;
    let visualizationConfigurationFactoryMock: IMock<VisualizationConfigurationFactory>;
    let assessmentStoreMock: IMock<AssessmentStore>;
    const selectedTestTypeStub = 0;
    const selectedTestKeyStub = 'test-key';
    const visualizationConfigurationStub = {
        key: selectedTestKeyStub,
    } as VisualizationConfiguration;
    const assessmentStoreStateStub = {
        assessmentNavState: { selectedTestType: selectedTestTypeStub },
    } as AssessmentStoreData;
    const eventStub: React.SyntheticEvent = {} as React.SyntheticEvent;

    beforeEach(() => {
        assessmentCardSelectionMessageCreatorMock =
            Mock.ofType<AssessmentCardSelectionMessageCreator>();
        visualizationConfigurationFactoryMock = Mock.ofType<VisualizationConfigurationFactory>();
        visualizationConfigurationFactoryMock
            .setup(vcf => vcf.getConfiguration(selectedTestTypeStub))
            .returns(() => visualizationConfigurationStub)
            .verifiable(Times.once());
        assessmentStoreMock = Mock.ofType(AssessmentStore);
        assessmentStoreMock
            .setup(asm => asm.getState())
            .returns(() => assessmentStoreStateStub)
            .verifiable(Times.once());

        testSubject = new AssessmentCardSelectionMessageCreatorWrapper(
            assessmentCardSelectionMessageCreatorMock.object,
            visualizationConfigurationFactoryMock.object,
            assessmentStoreMock.object,
        );
    });

    afterEach(() => {
        assessmentCardSelectionMessageCreatorMock.verifyAll();
        assessmentStoreMock.verifyAll();
        visualizationConfigurationFactoryMock.verifyAll();
    });

    test('toggleVisualHelper', () => {
        assessmentCardSelectionMessageCreatorMock
            .setup(m => m.toggleVisualHelper(eventStub, selectedTestKeyStub))
            .verifiable(Times.once());

        testSubject.toggleVisualHelper(eventStub);
    });

    test('expandAllRules', () => {
        assessmentCardSelectionMessageCreatorMock
            .setup(m => m.expandAllRules(eventStub, selectedTestKeyStub))
            .verifiable(Times.once());

        testSubject.expandAllRules(eventStub);
    });

    test('collapseAllRules', () => {
        assessmentCardSelectionMessageCreatorMock
            .setup(m => m.collapseAllRules(eventStub, selectedTestKeyStub))
            .verifiable(Times.once());

        testSubject.collapseAllRules(eventStub);
    });

    test('toggleCardSelection', () => {
        const ruleId = 'test-rule-id';
        const resultInstanceUid = 'test-uid';
        assessmentCardSelectionMessageCreatorMock
            .setup(m =>
                m.toggleCardSelection(ruleId, resultInstanceUid, eventStub, selectedTestKeyStub),
            )
            .verifiable(Times.once());

        testSubject.toggleCardSelection(ruleId, resultInstanceUid, eventStub);
    });

    test('toggleRuleExpandCollapse', () => {
        const ruleId = 'test-rule-id';
        assessmentCardSelectionMessageCreatorMock
            .setup(m => m.toggleRuleExpandCollapse(ruleId, eventStub, selectedTestKeyStub))
            .verifiable(Times.once());

        testSubject.toggleRuleExpandCollapse(ruleId, eventStub);
    });
});
