// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AsyncAction } from 'common/flux/async-action';

export class DataTransferActions {
    public readonly getCurrentState = new AsyncAction<null>();
    public readonly initiateTransferQuickAssessDataToAssessment = new AsyncAction<null>();
    public readonly finalizeTransferQuickAssessDataToAssessment = new AsyncAction<null>();
}
