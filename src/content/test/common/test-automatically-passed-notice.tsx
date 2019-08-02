// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import * as Markup from 'assessments/markup';
import { NamedSFC } from '../../../common/react/named-sfc';

export const TestAutomaticallyPassedNotice = NamedSFC('TestAutomaticallyPassedNotice', () => {
    return (
        <p>
            <Markup.Emphasis>
                Note: If no matching/failing instances are found, this requirement will automatically be marked as pass.
            </Markup.Emphasis>
        </p>
    );
});
