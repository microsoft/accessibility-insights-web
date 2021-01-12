// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { FailedInstancesSection } from 'common/components/cards/failed-instances-section';
import { TestConfig } from 'electron/types/test-config';
import * as React from 'react';
import { automatedChecksResultsFilter } from './results-filter';

export const automatedChecksTestConfig: TestConfig = {
    key: 'automated-checks',
    contentPageInfo: {
        title: 'Automated checks',
        description: (
            <>
                Automated checks can detect some common accessibility problems such as missing or
                invalid properties. But most accessibility problems can only be discovered through
                manual testing.
            </>
        ),
        instancesSectionComponent: FailedInstancesSection,
        resultsFilter: automatedChecksResultsFilter,
        allowsExportReport: true,
    },
};
