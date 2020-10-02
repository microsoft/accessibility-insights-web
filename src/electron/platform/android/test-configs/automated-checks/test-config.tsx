// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { HeaderSection } from 'electron/views/automated-checks/components/header-section';
import * as React from 'react';
import { TestConfig } from '../../../../types/test-config';

export const automatedChecksTestConfig: TestConfig = {
    key: 'automated-checks',
    title: 'Automated checks',
    description: <HeaderSection />,
};
