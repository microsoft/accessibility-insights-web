// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { Assessment } from 'assessments/types/iassessment';
import { Requirement } from 'assessments/types/requirement';
import { ManualTestStatus, ManualTestStatusData } from 'common/types/store-data/manual-test-status';
import { cloneDeep } from 'lodash';
import * as TelemetryEvents from '../common/extension-telemetry-events';
import { Messages } from '../common/messages';
import { TelemetryDataFactory } from '../common/telemetry-data-factory';
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

    constructor(
        store: AssessmentStore,
        provider: AssessmentsProvider,
        factory: TelemetryDataFactory,
        interpreter: Interpreter,
    ) {
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

    private onAssessmentChange = async (): Promise<void> => {
        this.provider
            .all()
            .some(assessment => this.sendTelemetryIfNewCompletedTestStep(assessment));
        this.updateOldTestStatusState();
    };

    private sendTelemetryIfNewCompletedTestStep(assessment: Assessment): boolean {
        const completedStep = assessment.requirements.find(step =>
            this.isNewCompletedTestStep(assessment, step),
        );
        const storeData = this.store.getState();
        const targetTab = storeData.persistedTabInfo;
        if (completedStep != null && targetTab !== null) {
            const payload: PayloadWithEventName = {
                eventName: TelemetryEvents.CHANGE_OVERALL_REQUIREMENT_STATUS,
                telemetry: this.telemetryFactory.forCompletedTestStep(
                    assessment,
                    storeData,
                    completedStep,
                ),
            };

            this.interpreter.interpret({
                tabId: targetTab.id,
                messageType: Messages.Telemetry.Send,
                payload,
            });
        }
        return completedStep != null;
    }

    private isNewCompletedTestStep(assessment: Assessment, step: Requirement): boolean {
        const newStatus = this.store.getState().assessments[assessment.key].testStepStatus;
        const oldStatus = this.oldTestStates[assessment.key];
        return (
            newStatus[step.key].stepFinalResult !== oldStatus[step.key].stepFinalResult &&
            newStatus[step.key].stepFinalResult !== ManualTestStatus.UNKNOWN
        );
    }

    private updateOldTestStatusState(): void {
        this.provider.all().forEach(assessment => {
            this.oldTestStates[assessment.key] = cloneDeep(
                this.store.getState().assessments[assessment.key].testStepStatus,
            );
        });
    }
}
