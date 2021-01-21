// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Markup from 'assessments/markup';
import * as React from 'react';

import { NamedFC } from '../../../common/react/named-fc';

export const TestAutomaticallyPassedNotice = NamedFC('TestAutomaticallyPassedNotice', () => {
    return (
        <p>
            <Markup.Emphasis>
                Note: If no matching/failing instances are found, this requirement will automatically be marked as pass.
            </Markup.Emphasis>
        </p>
    );
});
