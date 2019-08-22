// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { RuleConfiguration } from '../iruleresults';

const landmarkCheckId: string = 'unique-landmark';

export const landmarkConfiguration: RuleConfiguration = {
    checks: [],
    rule: {
        id: 'main-landmark',
        selector: '[role=main], main',
        any: [landmarkCheckId],
        enabled: false,
    },
};
