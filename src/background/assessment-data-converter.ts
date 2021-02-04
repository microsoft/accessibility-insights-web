// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ManualTestStatus } from 'common/types/manual-test-status';
import {
    AssessmentInstancesMap,
    GeneratedAssessmentInstance,
    ManualTestStepResult,
    TestStepResult,
    UserCapturedInstance,
} from 'common/types/store-data/assessment-result-data';
import { TabStopEvent } from 'common/types/tab-stop-event';
import { DecoratedAxeNodeResult, HtmlElementAxeResults } from 'injected/scanner-utils';
import { PartialTabOrderPropertyBag } from 'injected/tab-order-property-bag';
import { forOwn, isEmpty } from 'lodash';
import { DictionaryStringTo } from 'types/common-types';
import { UniquelyIdentifiableInstances } from './instance-identifier-generator';

export class AssessmentDataConverter {
    private generateUID: () => string;

    constructor(generateUID: () => string) {
        this.generateUID = generateUID;
    }

    public generateAssessmentInstancesMap(
        previouslyGeneratedInstances: AssessmentInstancesMap,
        selectorMap: DictionaryStringTo<HtmlElementAxeResults>,
        stepName: string,
        generateInstanceIdentifier: (instance: UniquelyIdentifiableInstances) => string,
        getInstanceStatus: (result: DecoratedAxeNodeResult) => ManualTestStatus,
        isVisualizationSupported: (result: DecoratedAxeNodeResult) => boolean,
    ): AssessmentInstancesMap {
        let instancesMap: AssessmentInstancesMap = {};

        if (previouslyGeneratedInstances != null) {
            instancesMap = previouslyGeneratedInstances;
        }

        forOwn(selectorMap, elementAxeResult => {
            const rule = Object.keys(elementAxeResult.ruleResults).pop();
            if (rule) {
                const ruleResult = elementAxeResult.ruleResults[rule];
                const identifier = generateInstanceIdentifier({
                    target: elementAxeResult.target,
                    html: ruleResult.html,
                });
                const matchingInstance = instancesMap[identifier];
                instancesMap[identifier] = this.getInitialAssessmentInstance(
                    matchingInstance,
                    elementAxeResult,
                    stepName,
                    ruleResult,
                    getInstanceStatus,
                    isVisualizationSupported,
                );
            }
        });

        return instancesMap;
    }

    public generateAssessmentInstancesMapForEvents(
        previouslyGeneratedInstances: AssessmentInstancesMap,
        events: TabStopEvent[],
        stepName: string,
        generateInstanceIdentifier: (instance: UniquelyIdentifiableInstances) => string,
    ): AssessmentInstancesMap {
        let instancesMap: AssessmentInstancesMap = {};

        if (previouslyGeneratedInstances != null) {
            instancesMap = previouslyGeneratedInstances;
        }

        events.forEach(event => {
            const identifier = generateInstanceIdentifier(event);
            const matchingInstance = instancesMap[identifier];
            instancesMap[identifier] = this.getInitialAssessmentFromEvent(
                matchingInstance,
                event,
                stepName,
                event.target.join(';'),
            );
        });

        return instancesMap;
    }

    public getNewManualTestStepResult(step: string): ManualTestStepResult {
        return {
            status: ManualTestStatus.UNKNOWN,
            id: step,
            instances: [],
        };
    }

    private getInitialAssessmentInstance(
        currentInstance: GeneratedAssessmentInstance,
        elementAxeResult: HtmlElementAxeResults,
        testStep: string,
        ruleResult: DecoratedAxeNodeResult,
        getInstanceStatus: (result: DecoratedAxeNodeResult) => ManualTestStatus,
        isVisualizationSupported: (result: DecoratedAxeNodeResult) => boolean,
    ): GeneratedAssessmentInstance {
        const target: string[] = elementAxeResult.target;
        let testStepResults = {};
        let html: string = null;
        let propertyBag = null;

        if (currentInstance != null) {
            testStepResults = currentInstance.testStepResults;
            html = currentInstance.html;
            propertyBag = currentInstance.propertyBag;
        }

        testStepResults[testStep] = this.getTestStepResults(
            ruleResult,
            elementAxeResult,
            getInstanceStatus,
            isVisualizationSupported,
        );

        let actualPropertyBag = {
            ...this.getPropertyBagFromAnyChecks(ruleResult),
            ...propertyBag,
        };
        actualPropertyBag = isEmpty(actualPropertyBag) ? null : actualPropertyBag;

        return {
            target: target,
            html: html || ruleResult.html,
            testStepResults: testStepResults,
            propertyBag: actualPropertyBag,
        };
    }

    private getInitialAssessmentFromEvent(
        matchingInstance: GeneratedAssessmentInstance,
        event: TabStopEvent,
        testStep: string,
        selector: string,
    ): GeneratedAssessmentInstance {
        let testStepResults = {};
        const target: string[] = event.target;
        const html: string = event.html;
        let propertyBag: PartialTabOrderPropertyBag = { timestamp: event.timestamp };

        if (matchingInstance != null) {
            testStepResults = matchingInstance.testStepResults;
            propertyBag = matchingInstance.propertyBag as PartialTabOrderPropertyBag;
        }

        testStepResults[testStep] = this.getGenericTestStepResultForEvent();

        return {
            target: target,
            html: html,
            testStepResults: testStepResults,
            propertyBag: propertyBag,
            selector: selector,
        };
    }

    private getGenericTestStepResultForEvent(): TestStepResult {
        return {
            id: this.generateUID(),
            status: ManualTestStatus.UNKNOWN,
            isCapturedByUser: false,
            failureSummary: null,
            isVisualizationSupported: true,
            isVisualizationEnabled: true,
            isVisible: true,
        };
    }

    private getTestStepResults<T>(
        ruleResult: DecoratedAxeNodeResult,
        elementAxeResult: HtmlElementAxeResults,
        getInstanceStatus: (result: DecoratedAxeNodeResult) => ManualTestStatus,
        isVisualizationSupported: (result: DecoratedAxeNodeResult) => boolean,
    ): TestStepResult {
        return {
            id: ruleResult.id,
            status: getInstanceStatus(ruleResult),
            isCapturedByUser: false,
            failureSummary: ruleResult.failureSummary,
            isVisualizationSupported: isVisualizationSupported(ruleResult),
            isVisualizationEnabled: false,
            isVisible: true,
        };
    }

    private getPropertyBagFromAnyChecks(ruleResult: DecoratedAxeNodeResult): any {
        return this.getPropertyBagFrom(ruleResult, 'any');
    }

    private getPropertyBagFrom(ruleResult: DecoratedAxeNodeResult, checkName: ChecksType): any {
        if (
            ruleResult[checkName] &&
            !isEmpty(ruleResult[checkName]) &&
            ruleResult[checkName][0].data
        ) {
            return ruleResult[checkName][0].data;
        }

        return null;
    }

    public generateFailureInstance(
        description: string,
        path: string,
        snippet: string,
    ): UserCapturedInstance {
        const instance: UserCapturedInstance = {
            id: this.generateUID(),
            description,
            selector: path,
            html: snippet,
        };
        return instance;
    }
}

type ChecksType = 'any' | 'all';
