// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import Helmet from 'react-helmet';
import { productName } from '../../content/strings/application';
import { NamedSFC } from '../../common/react/named-sfc';

export type GuidanceTitleProps = {
    name: string;
};

export const GuidanceTitle = NamedSFC<GuidanceTitleProps>('GuidanceTitle', ({name}) => <>
    <Helmet>
        <title>Guidance for {name} - {productName}</title>
    </Helmet>
    <h1>{name}</h1>
</>);
