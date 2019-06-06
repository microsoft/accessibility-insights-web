// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export interface DevToolState {
    isOpen: boolean;
    inspectElement?: string[];
    frameUrl?: string;
    inspectElementRequestId: number;
}
