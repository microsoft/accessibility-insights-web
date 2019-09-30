// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as errorIdentification from './error-identification';
import * as errorPrevention from './error-prevention';
import * as errorSuggestion from './error-suggestion';
import { guidance } from './guidance';
import * as statusMessages from './status-messages';

export const errors = {
    guidance,
    errorIdentification,
    errorSuggestion,
    errorPrevention,
    statusMessages,
};
