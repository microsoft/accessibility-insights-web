// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export type Logger = {
    log: (message?: any, ...optionalParams: any[]) => void;
    error: (message?: any, ...optionalParams: any[]) => void;
};
