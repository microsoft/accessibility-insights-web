// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as react from 'react';

import { link } from './link';
import { ContentCreator } from '../views/content/content-page';
import { GuidanceTitle as gt } from '../views/content/guidance-title';

export const create = ContentCreator(link);
export const React = react;
export const GuidanceTitle = gt;
