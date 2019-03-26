// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';
import * as _ from 'lodash';

import { Assessment } from '../assessments/types/iassessment';
import { AssessmentsProvider } from '../assessments/types/iassessments-provider';
import { TestStep } from '../assessments/types/test-step';
import { Messages } from '../common/messages';
import { TelemetryDataFactory } from '../common/telemetry-data-factory';
import { RequirementStatusTelemetryData } from '../common/telemetry-events';
import * as TelemetryEvents from '../common/telemetry-events';
import { ManualTestStatus, ManualTestStatusData } from '../common/types/manual-test-status';
import { IAssessmentData } from '../common/types/store-data/iassessment-result-data';
import { DictionaryStringTo } from '../types/common-types';
import { PayloadWithEventName } from './actions/action-payloads';
import { Interpreter } from './interpreter';
import { AssessmentStore } from './stores/assessment-store';

export class CompletedTestStepTelemetryCreator {
    private store: AssessmentStore;
    private provider: AssessmentsProvider;
    private telemetryFactory: TelemetryDataFactory;
    private interpreter: Interpreter;
    private oldTestStates: DictionaryStringTo<ManualTestStatusData>;

    constructor(store: AssessmentStore, provider: AssessmentsProvider, factory: TelemetryDataFactory, interpreter: Interpreter) {
        this.store = store;
        this.provider = provider;
        this.telemetryFactory = factory;
        this.interpreter = interpreter;
        this.oldTestStates = {};
    }

    public initialize(): void {
        this.updateOldTestStatusState();
        this.store.addChangedListener(this.onAssessmentChange);
    }

    @autobind
    private onAssessmentChange(): void {
        this.provider.all().some(assessment => this.sendTelemetryIfNewCompletedTestStep(assessment));
        this.updateOldTestStatusState();
    }

    private sendTelemetryIfNewCompletedTestStep(assessment: Assessment): boolean {
        const completedStep = assessment.steps.find(step => this.isNewCompletedTestStep(assessment, step));
        const targetTab = this.store.getState().persistedTabInfo;
        if (completedStep != undefined && targetTab !== null) {
            const payload: PayloadWithEventName = {
                eventName: TelemetryEvents.CHANGE_OVERALL_REQUIREMENT_STATUS,
                telemetry: this.createTelemetryInfo(assessment, completedStep),
            };

            this.interpreter.interpret({
                tabId: targetTab.id,
                type: Messages.Telemetry.Send,
                payload,
            });
        }
        return completedStep != undefined;
    }

    private isNewCompletedTestStep(assessment: Assessment, step: TestStep): boolean {
        const newStatus = this.store.getState().assessments[assessment.key].testStepStatus;
        const oldStatus = this.oldTestStates[assessment.key];
        return (
            newStatus[step.key].stepFinalResult !== oldStatus[step.key].stepFinalResult &&
            newStatus[step.key].stepFinalResult !== ManualTestStatus.UNKNOWN
        );
    }

    private createTelemetryInfo(assessment: Assessment, step: TestStep): RequirementStatusTelemetryData {
        const assessmentData = assessment.getVisualizationConfiguration().getAssessmentData(this.store.getState());
        const numInstances = this.getNumInstances(step, assessmentData);
        const newStatus = this.store.getState().assessments[assessment.key].testStepStatus;
        return this.telemetryFactory.forRequirementStatus(
            assessment.type,
            step.key,
            newStatus[step.key].stepFinalResult === ManualTestStatus.PASS,
            numInstances,
        );
    }

    private getNumInstances(step: TestStep, assessmentData: IAssessmentData): number {
        let numInstances = 0;
        if (!step.isManual) {
            numInstances = _.filter(Object.keys(assessmentData.generatedAssessmentInstancesMap), key => {
                return step.key in assessmentData.generatedAssessmentInstancesMap[key].testStepResults;
            }).length;
        } else if (step.key in assessmentData.manualTestStepResultMap) {
            numInstances = assessmentData.manualTestStepResultMap[step.key].instances.length;
        }
        return numInstances;
    }

    private updateOldTestStatusState(): void {
        this.provider.all().forEach(assessment => {
            this.oldTestStates[assessment.key] = _.cloneDeep(this.store.getState().assessments[assessment.key].testStepStatus);
        });
    }
}
