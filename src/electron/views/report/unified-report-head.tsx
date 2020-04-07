// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { androidAppTitle } from 'content/strings/application';
import * as React from 'react';
import * as reportStyles from 'reports/automated-checks-report.styles';

import * as bundledStyles from '../bundled-renderer-styles';

export const UnifiedReportHead = NamedFC('UnifiedReportHead', () => {
    // tslint:disable: react-no-dangerous-html
    return (
        <head>
            <meta charSet="UTF-8" />
            <title>{androidAppTitle} - Report</title>
            <style dangerouslySetInnerHTML={{ __html: reportStyles.styleSheet }} />
            <style dangerouslySetInnerHTML={{ __html: bundledStyles.styleSheet }} />
        </head>
    );
});
