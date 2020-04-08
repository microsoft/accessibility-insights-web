// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { EnvironmentInfoProvider } from 'common/environment-info-provider';
import { ReportSectionFactory } from 'reports/components/report-sections/report-section-factory';
import { ToolLink } from 'reports/components/report-sections/tool-link';
import { NamedFC } from 'common/react/named-fc';

export type FooterTextProps = { environmentInfoProvider: EnvironmentInfoProvider };
export const FooterTextForService = (serviceName: string) => {

    const footerText = NamedFC<FooterTextProps>(
        'FooterText',
        ({ environmentInfoProvider }) => {
            const { extensionVersion, browserSpec, axeCoreVersion } = environmentInfoProvider.getEnvironmentInfo();
            return (
                <>
                    This automated checks result was generated using the {serviceName}{' '}
                that helps find some of the most common accessibility issues. The scan was
                performed using axe-core {axeCoreVersion} and {browserSpec}. For a complete
                WCAG 2.1 compliance assessment please visit{' '}<ToolLink />.
                </>
            )
        },
    );

    return footerText;
};
