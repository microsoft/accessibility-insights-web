// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as react from 'react';

import { ContentCreator } from 'views/content/content-page';
import { GuidanceTitle as gt } from 'views/content/guidance-title';
import { link } from './link';

export const create = ContentCreator(link);
export const React = react;
export const GuidanceTitle = gt;
