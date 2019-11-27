// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedFC } from 'common/react/named-fc';
import { ReportFooterTextProps } from 'reports/components/report-sections/report-footer-text';
import { ToolLink } from 'reports/components/report-sections/tool-link';

export const getReportFooterText = (serviceTitle: string) =>
    NamedFC<ReportFooterTextProps>('PackageFooterText', ({ axeCoreVersion, browserSpec }) => <>
        This automated checks result was generated using the {serviceTitle}{' '}
        that helps find some of the most common accessibility issues. The scan was
        performed using axe-core {axeCoreVersion} and {browserSpec}. To more deeply
        investigate your accessibility issues please visit{' '}<ToolLink />.
</>);
