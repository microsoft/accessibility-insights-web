// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { title } from 'content/strings/application';
import * as React from 'react';

import * as bundledStyles from '../../DetailsView/bundled-details-view-styles';
import * as reportStyles from '../automated-checks-report.styles';

export const ReportHead = NamedFC('ReportHead', () => {
    // tslint:disable: react-no-dangerous-html
    return (
        <head>
            <meta charSet="UTF-8" />
            <title>{title} automated checks result</title>
            <style dangerouslySetInnerHTML={{ __html: reportStyles.styleSheet }} />
            <style dangerouslySetInnerHTML={{ __html: bundledStyles.styleSheet }} />
        </head>
    );
});
