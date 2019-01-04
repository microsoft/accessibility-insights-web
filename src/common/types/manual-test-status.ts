// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export enum ManualTestStatus {
    PASS,
    UNKNOWN,
    FAIL,
}

export interface IManualTestStatus {
    [key: string]: ITestStepData;
}

export interface ITestStepData {
    stepFinalResult: ManualTestStatus;
    isStepScanned: boolean;
}
