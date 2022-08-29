// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    AssessmentInstancesMap,
    InstanceIdToInstanceDataMap,
    TestStepResult,
} from 'common/types/store-data/assessment-result-data';
import { ManualTestStatus } from 'common/types/store-data/manual-test-status';
import { isEmpty, size } from 'lodash';
import * as React from 'react';
import styles from './assessment-default-message-generator.scss';

export type IMessageGenerator = (
    instancesMap: AssessmentInstancesMap,
    selectedTestStep: string,
) => DefaultMessageInterface;
export type IGetMessageGenerator = (
    generator: AssessmentDefaultMessageGenerator,
) => IMessageGenerator;
export type DefaultMessageInterface = {
    message: JSX.Element;
    instanceCount: number;
} | null;

function failingInstances(result: TestStepResult): boolean {
    return result.status !== ManualTestStatus.PASS;
}

function passingInstances(result: TestStepResult): boolean {
    return result.status === ManualTestStatus.PASS;
}

function getRelevantTestStepResults(
    instancesMap: InstanceIdToInstanceDataMap,
    selectedTestStep: string,
): TestStepResult[] {
    const getSelectedTestStepResult: (instance: string) => TestStepResult = (instance: string) => {
        return instancesMap[instance].testStepResults[selectedTestStep];
    };

    return Object.keys(instancesMap)
        .map(getSelectedTestStepResult)
        .filter(ob => ob);
}

export class AssessmentDefaultMessageGenerator {
    public getNoFailingInstanceMessage: IMessageGenerator = (
        instancesMap: InstanceIdToInstanceDataMap,
        selectedTestStep: string,
    ): DefaultMessageInterface => {
        if (isEmpty(instancesMap)) {
            return this.getNoMatchingInstancesResult();
        }

        const relevantTestStepResults = getRelevantTestStepResults(instancesMap, selectedTestStep);

        const passingInstanceKeys = relevantTestStepResults.filter(passingInstances);
        const failingInstanceKeys = relevantTestStepResults.filter(failingInstances);

        if (isEmpty(failingInstanceKeys) && !isEmpty(relevantTestStepResults)) {
            return this.getNoFailingInstanceResult(passingInstanceKeys);
        }

        return this.checkRelevantTestSteps(instancesMap, selectedTestStep);
    };

    public getNoMatchingInstanceMessage: IMessageGenerator = (
        instancesMap: InstanceIdToInstanceDataMap,
        selectedTestStep: string,
    ): DefaultMessageInterface => {
        if (isEmpty(instancesMap)) {
            return this.getNoMatchingInstancesResult();
        }

        return this.checkRelevantTestSteps(instancesMap, selectedTestStep);
    };

    private getNoMatchingInstancesResult(): DefaultMessageInterface {
        return {
            message: <div className={styles.noFailureView}>No matching instances</div>,
            instanceCount: 0,
        };
    }

    private getNoFailingInstanceResult(
        passingInstanceKeys: TestStepResult[],
    ): DefaultMessageInterface {
        return {
            message: <div className={styles.noFailureView}>No failing instances</div>,
            instanceCount: size(passingInstanceKeys),
        };
    }

    private checkRelevantTestSteps(
        instancesMap: InstanceIdToInstanceDataMap,
        selectedTestStep: string,
    ): DefaultMessageInterface {
        const relevantTestStepResults = getRelevantTestStepResults(instancesMap, selectedTestStep);
        if (isEmpty(relevantTestStepResults)) {
            return this.getNoMatchingInstancesResult();
        }
        return null;
    }
}
