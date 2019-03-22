// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import * as React from 'react';
import * as Markup from '../markup';

const TestAutomaticallyPassedNotice = (
    <p>
        <Markup.Emphasis>
            Note: If no matching/failing instances are found, this requirement will automatically be marked as pass.
        </Markup.Emphasis>
    </p>
);

export default TestAutomaticallyPassedNotice;
