// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedFC } from 'common/react/named-fc';
import { serviceTitle, toolName } from 'content/strings/application';
import { SectionProps } from 'reports/components/report-sections/report-section-factory';
import { ToolLink } from 'reports/components/report-sections/tool-link';

export type ReportFooterProps = Pick<SectionProps, 'environmentInfo'>;

export const PackageReportFooter = NamedFC<ReportFooterProps>('ReportFooter', ({ environmentInfo }) => {
    const { browserSpec, axeCoreVersion } = environmentInfo;
    return (
        <div className="report-footer-container">
            <div className="report-footer" role="contentinfo">
                This automated checks result was generated using the {serviceTitle}{' '}
                that helps find some of the most common accessibility issues. The scan was
                performed using axe-core {axeCoreVersion} and {browserSpec}. To investigate your
                accessibility issues more fully please visit{' '}<ToolLink />
                .
            </div>
        </div>
    );
});
