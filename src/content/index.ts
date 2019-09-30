// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ContentPage } from 'views/content/content-page';
import { adhoc } from './adhoc';
import { rules } from './rules';
import * as strings from './strings';
import { test } from './test';

const content = {
    test,
    adhoc,
    rules,
};

export const contentPages = ContentPage.provider(content);
export { strings };
