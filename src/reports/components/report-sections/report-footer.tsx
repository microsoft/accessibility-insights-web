// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { EnvironmentInfo } from 'common/environment-info-provider';
import { NamedFC } from 'common/react/named-fc';
import { toolName } from 'content/strings/application';
import { ToolLink } from 'reports/components/report-sections/tool-link';
import { SectionProps } from './report-section-factory';

export type ReportFooterText = React.FC<EnvironmentInfo>;

export type ReportFooterTextProps = EnvironmentInfo;
const DefaultFooterText: ReportFooterText = NamedFC<ReportFooterTextProps>(
    'DefaultFooterText',
    ({ axeCoreVersion, browserSpec, extensionVersion }) => (
        <>
            This automated checks result was generated using {`${toolName} ${extensionVersion} (Axe ${axeCoreVersion})`}, a tool that helps
            debug and find accessibility issues earlier on {browserSpec}. Get more information & download this tool at <ToolLink />.
        </>
    ),
);

export type ReportFooterProps = {
    footerText?: ReportFooterText;
} & Pick<SectionProps, 'environmentInfo'>;

export const ReportFooter = NamedFC<ReportFooterProps>('ReportFooter', ({ environmentInfo, footerText }) => {
    const Text = footerText || DefaultFooterText;
    return (
        <div className="report-footer-container">
            <div className="report-footer" role="contentinfo">
                <Text {...environmentInfo} />
            </div>
        </div>
    );
});
