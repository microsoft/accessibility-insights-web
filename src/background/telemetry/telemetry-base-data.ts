// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export interface TelemetryBaseData {
    name: string;
    properties: {
        [name: string]: string;
    };
}
