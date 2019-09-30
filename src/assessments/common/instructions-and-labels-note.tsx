// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import * as React from 'react';

import * as Markup from '../markup';

export const InstructionsAndLabelsNotes = () => (
    <Markup.Emphasis>
        Note: For WCAG 2.1 compliance, both visible instructions and labels must be programmatically related to a widget. For WCAG 2.0
        compliance, only visible instructions must be programmatically related to a widget.
    </Markup.Emphasis>
);
