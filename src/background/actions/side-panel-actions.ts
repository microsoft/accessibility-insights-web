// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Action } from 'common/flux/action';

export type SidePanel = 'Settings' | 'PreviewFeatures' | 'Scoping' | 'FailureInstance' | 'Content';

export class SidePanelActions {
    public readonly openPanel = new Action<SidePanel>();
    public readonly closePanel = new Action<void>();
}
