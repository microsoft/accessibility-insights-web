// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { adhoc } from './adhoc';
import { rules } from './rules';
import { ContentPage } from '../views/content/content-page';
import { test } from './test';
import * as strings from './strings';

const content = {
    test,
    adhoc,
    rules,
};

export const contentPages = ContentPage.provider(content);
export { strings };
