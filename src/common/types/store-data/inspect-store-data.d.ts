// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InspectMode } from '../../../background/inspect-modes';

// tslint:disable-next-line:interface-name
export interface IInspectStoreData {
    inspectMode: InspectMode;
    hoveredOverSelector: string[];
}
