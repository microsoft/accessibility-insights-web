// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { EnvironmentInfoProvider } from 'common/environment-info-provider';
import { NamedFC } from 'common/react/named-fc';
import { toolName } from 'content/strings/application';
import * as React from 'react';
import { ToolLink } from 'reports/components/report-sections/tool-link';

export type FooterTextProps = { environmentInfoProvider: EnvironmentInfoProvider };
export const FooterText = NamedFC<FooterTextProps>('FooterText', ({ environmentInfoProvider }) => {
    const {
        extensionVersion,
        browserSpec,
        axeCoreVersion,
    } = environmentInfoProvider.getEnvironmentInfo();
    return (
        <>
            This automated checks result was generated using{' '}
            {`${toolName} ${extensionVersion} (axe-core ${axeCoreVersion})`}, a tool that helps
            debug and find accessibility issues earlier on {browserSpec}. Get more information &
            download this tool at <ToolLink />.
        </>
    );
});
