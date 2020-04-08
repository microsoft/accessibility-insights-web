// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { EnvironmentInfoProvider } from 'common/environment-info-provider';
import { NamedFC } from 'common/react/named-fc';
import { ToolLink } from 'reports/components/report-sections/tool-link';

export type FooterTextForServiceProps = { environmentInfoProvider: EnvironmentInfoProvider };
export const FooterTextForService = (serviceName: string) => {

    const footerTextForService = NamedFC<FooterTextForServiceProps>(
        'FooterText',
        ({ environmentInfoProvider }) => {
            const environmentInfo = environmentInfoProvider.getEnvironmentInfo();
            return (
                <>
                    This automated checks result was generated using the {serviceName}{' '}
                that helps find some of the most common accessibility issues. The scan was
                performed using axe-core {environmentInfo.axeCoreVersion} and {environmentInfo.browserSpec}. For a complete
                WCAG 2.1 compliance assessment please visit{' '}<ToolLink />.
                </>
            );
        },
    );

    return footerTextForService;
};
