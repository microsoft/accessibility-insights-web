// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as react from 'react';

import { ContentCreator } from '../views/content/content-page';
import { link } from './link';
import { Helmet } from 'react-helmet';
import { productName } from './strings/application';

export function guidanceTitle(name: string) : JSX.Element {
    return (
        <Helmet>
            <title>Guidance for {name} - {productName}</title>
        </Helmet>
    );
}

export const create = ContentCreator(link);
export const React = react;
