// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import * as React from 'react';
import { TestConfig } from '../../../../types/test-config';

export const needsReviewTestConfig: TestConfig = {
    key: 'needs-review',
    title: 'Needs review',
    description: (
        <>
            Sometimes automated checks identify <i>possible</i> accessibility problems that need to
            be reviewed and verified by a human.
        </>
    ),
};
