// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export enum ManualTestStatus {
    PASS,
    UNKNOWN,
    FAIL,
}

// tslint:disable-next-line:interface-name
export interface IManualTestStatus {
    [key: string]: ITestStepData;
}

// tslint:disable-next-line:interface-name
export interface ITestStepData {
    stepFinalResult: ManualTestStatus;
    isStepScanned: boolean;
}
