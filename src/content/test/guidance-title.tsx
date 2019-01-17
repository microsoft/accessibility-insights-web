// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { React } from '../common';
import Helmet from 'react-helmet';
import { productName } from '../strings/application';

export const GuidanceTitle = (name: string) => <>
    <Helmet>
        <title>Guidance for {name} - {productName}</title>
    </Helmet>
</>;
