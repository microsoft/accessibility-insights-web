// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InspectMode } from 'background/inspect-modes';

export interface InspectStoreData {
    inspectMode: InspectMode;
    hoveredOverSelector: string[] | null;
}
