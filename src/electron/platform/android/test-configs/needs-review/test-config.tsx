// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NeedsReviewInstancesSection } from 'common/components/cards/needs-review-instances-section';
import { TestConfig } from 'electron/types/test-config';

export const needsReviewTestConfig: TestConfig = {
    key: 'needs-review',
    contentPageInfo: {
        title: 'Needs review',
        description: (
            <>
                Sometimes automated checks identify <i>possible</i> accessibility problems that need
                to be reviewed and verified by a human.
            </>
        ),
        instancesSectionComponent: NeedsReviewInstancesSection,
    },
};
