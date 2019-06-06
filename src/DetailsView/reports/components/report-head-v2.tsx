// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedSFC } from '../../../common/react/named-sfc';
import { title } from '../../../content/strings/application';
import * as reportStyles from '../automated-checks-report.styles';

export const ReportHeadV2 = NamedSFC('ReportHead', () => {
    return (
        <head>
            <title>{title} automated checks result</title>
            <style dangerouslySetInnerHTML={{ __html: reportStyles.styleSheet }} />
        </head>
    );
});
