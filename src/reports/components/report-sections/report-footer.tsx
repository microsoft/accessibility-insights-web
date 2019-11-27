// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedFC } from 'common/react/named-fc';
import { toolName } from 'content/strings/application';
import { ToolLink } from 'reports/components/report-sections/tool-link';
import { SectionProps } from './report-section-factory';

export type ReportFooterProps = Pick<SectionProps, 'environmentInfo'>;

export const ReportFooter = NamedFC<ReportFooterProps>('ReportFooter', ({ environmentInfo }) => {
    const { extensionVersion, browserSpec, axeCoreVersion } = environmentInfo;
    return (
        <div className="report-footer-container">
            <div className="report-footer" role="contentinfo">
                This automated checks result was generated using {`${toolName} ${extensionVersion} (Axe ${axeCoreVersion})`}, a tool that
                helps debug and find accessibility issues earlier on {browserSpec}. Get more information & download this tool at{' '}
                <ToolLink />.
            </div>
        </div>
    );
});
