// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import * as React from 'react';

import * as Markup from '../markup';

export const InstructionsAndLabelsNotes = () => (
    <Markup.Emphasis>
        Note: Both WCAG 2.0 and 2.1 require a widget's visible label and instructions (if present)
        to be programmatically determinable. WCAG 2.1 also requires a widget's visible label and
        instructions (if present) to be included in its accessible name and description.
    </Markup.Emphasis>
);
