// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export enum ManualTestStatus {
    PASS,
    UNKNOWN,
    FAIL,
}

export interface ManualTestStatusData {
    [key: string]: TestStepData;
}

export interface TestStepData {
    stepFinalResult: ManualTestStatus;
    isStepScanned: boolean;
}
