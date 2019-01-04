// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { AssessmentDefaultMessageGenerator } from '../../assessments/assessment-default-message-generator';
import { IAssessmentsProvider } from '../../assessments/types/iassessments-provider';
import { AssessmentTestResult } from '../../common/assessment/assessment-test-result';
import { IVisualizationConfiguration } from '../../common/configs/visualization-configuration-factory';
import { NamedSFC } from '../../common/react/named-sfc';
import { IAssessmentStoreData } from '../../common/types/store-data/iassessment-result-data';
import { ITabStoreData } from '../../common/types/store-data/itab-store-data';
import { IVisualizationStoreData } from '../../common/types/store-data/ivisualization-store-data';
import { AssessmentInstanceTableHandler } from '../handlers/assessment-instance-table-handler';
import { AssessmentView, AssessmentViewDeps } from './assessment-view';

export type AssessmentTestViewDeps = AssessmentViewDeps & {
    assessmentsProvider: IAssessmentsProvider;
    assessmentDefaultMessageGenerator: AssessmentDefaultMessageGenerator;
};

export interface IAssessmentTestViewProps {
    deps: AssessmentTestViewDeps;
    tabStoreData: ITabStoreData;
    assessmentStoreData: IAssessmentStoreData;
    visualizationStoreData: IVisualizationStoreData;
    assessmentInstanceTableHandler: AssessmentInstanceTableHandler;
    configuration: IVisualizationConfiguration;
}

export const AssessmentTestView = NamedSFC<IAssessmentTestViewProps>('AssessmentTestView', ({ deps, ...props }) => {
    const isScanning: boolean = props.visualizationStoreData.scanning !== null;
    const scanData = props.configuration.getStoreData(props.visualizationStoreData.tests);
    const assessmentData = props.configuration.getAssessmentData(props.assessmentStoreData);
    const prevTarget = props.assessmentStoreData.targetTab;
    const isEnabled = props.configuration.getTestStatus(
        scanData,
        props.assessmentStoreData.assessmentNavState.selectedTestStep,
    );
    const currentTarget = {
        id: props.tabStoreData.id,
        url: props.tabStoreData.url,
        title: props.tabStoreData.title,
    };
    const assessmentTestResult = new AssessmentTestResult(
        deps.assessmentsProvider,
        props.assessmentStoreData.assessmentNavState.selectedTestType,
        assessmentData,
    );
    return (<AssessmentView
        deps={deps}
        isScanning={isScanning}
        isEnabled={isEnabled}
        assessmentNavState={props.assessmentStoreData.assessmentNavState}
        assessmentInstanceTableHandler={props.assessmentInstanceTableHandler}
        assessmentProvider={deps.assessmentsProvider}
        assessmentData={assessmentData}
        currentTarget={currentTarget}
        prevTarget={prevTarget}
        assessmentDefaultMessageGenerator={deps.assessmentDefaultMessageGenerator}
        assessmentTestResult={assessmentTestResult}
    />);
});
