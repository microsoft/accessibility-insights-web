// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as autocomplete from './autocomplete';
import * as cues from './cues';
import * as expectedInput from './expected-input';
import { guidance } from './guidance';
import { infoAndExamples as instructions } from './instructions';
import * as widgetFunction from './widget-function';

export const nativeWidgets = {
    guidance,
    cues,
    instructions,
    expectedInput,
    widgetFunction,
    autocomplete,
};
