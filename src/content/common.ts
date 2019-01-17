// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as react from 'react';

import { ContentCreator } from '../views/content/content-page';
import { link } from './link';
import * as guidance from './test/guidance-title';

export const create = ContentCreator(link);
export const React = react;
export const GuidanceTitle = guidance.GuidanceTitle;
