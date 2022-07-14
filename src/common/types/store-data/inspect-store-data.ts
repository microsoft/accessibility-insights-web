// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InspectMode } from 'common/types/store-data/inspect-modes';

export interface InspectStoreData {
    inspectMode: InspectMode;
    hoveredOverSelector: string[] | null;
}
