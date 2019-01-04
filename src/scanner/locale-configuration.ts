// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Axe from 'axe-core';
import { uniqueLandmarkRuleContent } from './unique-landmark';

export const localeConfiguration: Axe.Locale = {
    rules: {
        ...uniqueLandmarkRuleContent,
    },
};
