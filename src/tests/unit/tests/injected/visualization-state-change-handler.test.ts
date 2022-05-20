// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { Requirement } from 'assessments/types/requirement';
import { VisualizationType } from 'common/types/visualization-type';
import { TargetPageStoreData } from 'injected/client-store-listener';
import { UpdateVisualization } from 'injected/target-page-visualization-updater';
import { VisualizationStateChangeHandler } from 'injected/visualization-state-change-handler';
import { forOwn } from 'lodash';
import { IMock, Mock } from 'typemoq';

describe('VisualizationStateChangeHandler', () => {
    let assessmentProviderMock: IMock<AssessmentsProvider>;
    let visualizationUpdaterMock: IMock<UpdateVisualization>;
    let storeDataStub: TargetPageStoreData;
    let testSubject: VisualizationStateChangeHandler;
    let visualizations: VisualizationType[];

    beforeEach(() => {
        assessmentProviderMock = Mock.ofType<AssessmentsProvider>();
        visualizationUpdaterMock = Mock.ofType<UpdateVisualization>();
        storeDataStub = { assessmentStoreData: {} } as TargetPageStoreData;
        visualizations = [-1, -2];
        testSubject = new VisualizationStateChangeHandler(
            visualizations,
            visualizationUpdaterMock.object,
            assessmentProviderMock.object,
        );
    });

    test('non-assessment visualizations', async () => {
        visualizations.forEach(visualizationType => {
            assessmentProviderMock
                .setup(apm => apm.isValidType(visualizationType))
                .returns(() => false);
            visualizationUpdaterMock
                .setup(vum => vum(visualizationType, null, storeDataStub))
                .verifiable();
        });
        await testSubject.updateVisualizationsWithStoreData(storeDataStub);

        visualizationUpdaterMock.verifyAll();
    });

    test('assessment visualizations', async () => {
        const requirementOneStub = {
            key: 'some key',
        } as Requirement;
        const requirementTwoStub = {
            key: 'some other key',
        } as Requirement;
        const stepMapStub = {
            step1: requirementOneStub,
            step2: requirementTwoStub,
        };

        visualizations.forEach(visualizationType => {
            assessmentProviderMock
                .setup(apm => apm.isValidType(visualizationType))
                .returns(() => true);
            assessmentProviderMock
                .setup(apm => apm.getStepMap(visualizationType))
                .returns(() => stepMapStub);
            forOwn(stepMapStub, step => {
                visualizationUpdaterMock
                    .setup(vum => vum(visualizationType, step.key, storeDataStub))
                    .verifiable();
            });
        });

        await testSubject.updateVisualizationsWithStoreData(storeDataStub);

        visualizationUpdaterMock.verifyAll();
    });
});
