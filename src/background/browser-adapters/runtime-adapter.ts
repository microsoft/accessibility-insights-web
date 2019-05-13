// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export type RuntimeAdapter = {
    getRuntimeId(): string;
    getRuntimeLastError(): chrome.runtime.LastError;
};
