// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Target } from 'scanner/iruleresults';
export interface TabStopEvent {
    timestamp: number;
    target: Target;
    html: string;
}
