// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as react from 'react';

import { ContentCreator } from 'views/content/content-page';
import { GuidanceTitle as gt } from 'views/content/guidance-title';
import { link } from './link';

interface ContentPageConfiguration {
    pageTitle: string;
}

export const create = ContentCreator(link);
export const createWithTitle = (config: ContentPageConfiguration, props) => {
    const component = create(props);
    component.pageTitle = config.pageTitle;
    return component;
};
export const React = react;
export const GuidanceTitle = gt;
