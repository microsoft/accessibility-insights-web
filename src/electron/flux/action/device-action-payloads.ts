// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export interface ConnectingPayload {
    port: number;
}

export interface ConnectionSucceedPayload {
    connectedDevice: string;
}
