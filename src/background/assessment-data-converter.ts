// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as _ from 'lodash/index';

import { ManualTestStatus } from '../common/types/manual-test-status';
import { IPartialTabOrderPropertyBag } from '../injected/tab-order-property-bag';
import { ITabStopEvent } from '../injected/tab-stops-listener';
import {
    IAssessmentInstancesMap,
    IGeneratedAssessmentInstance,
    IManualTestStepResult,
    ITestStepResult,
    IUserCapturedInstance,
} from './../common/types/store-data/iassessment-result-data.d';
import { DecoratedAxeNodeResult, IHtmlElementAxeResults } from './../injected/scanner-utils';
import { IUniquelyIdentifiableInstances } from './instance-identifier-generator';

export class AssessmentDataConverter {
    private generateUID: () => string;

    constructor(generateUID: () => string) {
        this.generateUID = generateUID;
    }

    public generateAssessmentInstancesMap(
        previouslyGeneratedInstances: IAssessmentInstancesMap,
        selectorMap: DictionaryStringTo<IHtmlElementAxeResults>,
        stepName: string,
        generateInstanceIdentifier: (instance: IUniquelyIdentifiableInstances) => string,
        getInstanceStatus: (result: DecoratedAxeNodeResult) => ManualTestStatus,
    ): IAssessmentInstancesMap {
        let instancesMap: IAssessmentInstancesMap = {};

        if (previouslyGeneratedInstances != null) {
            instancesMap = previouslyGeneratedInstances;
        }

        _.forOwn(selectorMap, elementAxeResult => {
            const rule = Object.keys(elementAxeResult.ruleResults).pop();
            if (rule) {
                const ruleResult = elementAxeResult.ruleResults[rule];
                const identifier = generateInstanceIdentifier({ target: elementAxeResult.target, html: ruleResult.html });
                const matchingInstance = instancesMap[identifier];
                instancesMap[identifier] = this.getInitialAssessmentInstance(
                    matchingInstance,
                    elementAxeResult,
                    stepName,
                    ruleResult,
                    getInstanceStatus,
                );
            }
        });

        return instancesMap;
    }

    public generateAssessmentInstancesMapForEvents(
        previouslyGeneratedInstances: IAssessmentInstancesMap,
        events: ITabStopEvent[],
        stepName: string,
        generateInstanceIdentifier: (instance: IUniquelyIdentifiableInstances) => string,
    ): IAssessmentInstancesMap {
        let instancesMap: IAssessmentInstancesMap = {};

        if (previouslyGeneratedInstances != null) {
            instancesMap = previouslyGeneratedInstances;
        }

        events.forEach(event => {
            const identifier = generateInstanceIdentifier(event);
            const matchingInstance = instancesMap[identifier];
            instancesMap[identifier] = this.getInitialAssessmentFromEvent(matchingInstance, event, stepName, event.target.join(';'));
        });

        return instancesMap;
    }

    public getNewManualTestStepResult(step: string): IManualTestStepResult {
        return {
            status: ManualTestStatus.UNKNOWN,
            id: step,
            instances: [],
        };
    }

    private getInitialAssessmentInstance(
        currentInstance: IGeneratedAssessmentInstance,
        elementAxeResult: IHtmlElementAxeResults,
        testStep: string,
        ruleResult: DecoratedAxeNodeResult,
        getInstanceStatus: (result: DecoratedAxeNodeResult) => ManualTestStatus,
    ): IGeneratedAssessmentInstance {
        const target: string[] = elementAxeResult.target;
        let testStepResults = {};
        let html: string = null;
        let propertyBag = null;

        if (currentInstance != null) {
            testStepResults = currentInstance.testStepResults;
            html = currentInstance.html;
            propertyBag = currentInstance.propertyBag;
        }

        testStepResults[testStep] = this.getTestStepResults(ruleResult, elementAxeResult, getInstanceStatus);

        let actualPropertyBag = {
            ...this.getPropertyBagFromAnyChecks(ruleResult),
            ...propertyBag,
        };
        actualPropertyBag = _.isEmpty(actualPropertyBag) ? null : actualPropertyBag;

        return {
            target: target,
            html: html || ruleResult.html,
            testStepResults: testStepResults,
            propertyBag: actualPropertyBag,
        };
    }

    private getInitialAssessmentFromEvent(
        matchingInstance: IGeneratedAssessmentInstance,
        event: ITabStopEvent,
        testStep: string,
        selector: string,
    ): IGeneratedAssessmentInstance {
        let testStepResults = {};
        const target: string[] = event.target;
        const html: string = event.html;
        let propertyBag: IPartialTabOrderPropertyBag = { timestamp: event.timestamp };

        if (matchingInstance != null) {
            testStepResults = matchingInstance.testStepResults;
            propertyBag = matchingInstance.propertyBag as IPartialTabOrderPropertyBag;
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

    private getGenericTestStepResultForEvent(): ITestStepResult {
        return {
            id: this.generateUID(),
            status: ManualTestStatus.UNKNOWN,
            isCapturedByUser: false,
            failureSummary: null,
            isVisualizationEnabled: true,
            isVisible: true,
        };
    }

    private getTestStepResults<T>(
        ruleResult: DecoratedAxeNodeResult,
        elementAxeResult: IHtmlElementAxeResults,
        getInstanceStatus: (result: DecoratedAxeNodeResult) => ManualTestStatus,
    ): ITestStepResult {
        return {
            id: ruleResult.id,
            status: getInstanceStatus(ruleResult),
            isCapturedByUser: false,
            failureSummary: ruleResult.failureSummary,
            isVisualizationEnabled: false,
            isVisible: elementAxeResult.isVisible,
        };
    }

    private getPropertyBagFromAnyChecks(ruleResult: DecoratedAxeNodeResult): any {
        return this.getPropertyBagFrom(ruleResult, 'any');
    }

    private getPropertyBagFrom(ruleResult: DecoratedAxeNodeResult, checkName: ChecksType) {
        if (ruleResult[checkName] && !_.isEmpty(ruleResult[checkName]) && ruleResult[checkName][0].data) {
            return ruleResult[checkName][0].data;
        }

        return null;
    }

    public generateFailureInstance(description: string): IUserCapturedInstance {
        return {
            id: this.generateUID(),
            description: description,
        };
    }
}

type ChecksType = 'any' | 'all';
