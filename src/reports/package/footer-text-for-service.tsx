// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { ReportSectionFactory } from 'reports/components/report-sections/report-section-factory';
import { ToolLink } from 'reports/components/report-sections/tool-link';

export const FooterTextForService = (serviceName: string) => {

    const footerText = ({ environmentInfo: { axeCoreVersion, browserSpec } }) =>
        <>
            This automated checks result was generated using the {serviceName}{' '}
            that helps find some of the most common accessibility issues. The scan was
            performed using axe-core {axeCoreVersion} and {browserSpec}. For a complete
            WCAG 2.1 compliance assessment please visit{' '}<ToolLink />.
        </>;

    return footerText as ReportSectionFactory['FooterText'];
};
