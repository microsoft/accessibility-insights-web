// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export interface DevToolStoreData {
    isOpen: boolean;
    inspectElement: string[] | null;
    frameUrl: string | null;
    inspectElementRequestId: number;
}
