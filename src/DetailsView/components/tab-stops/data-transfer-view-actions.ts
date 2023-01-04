// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AsyncAction } from 'common/flux/async-action';

export class DataTransferViewActions {
    public readonly showQuickAssessToAssessmentConfirmDialog = new AsyncAction<void>();
    public readonly hideQuickAssessToAssessmentConfirmDialog = new AsyncAction<void>();
}
