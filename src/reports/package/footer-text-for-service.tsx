// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';

import { FooterTextProps } from 'reports/components/report-sections/footer-text-props';
import { ToolLink } from 'reports/components/report-sections/tool-link';

export const FooterTextForService = NamedFC<FooterTextProps>('FooterTextForService', ({ scanMetadata }) => {
    const toolData = scanMetadata.toolData;
    return (
        <>
            This automated checks result was generated using the {toolData.applicationProperties.name}{' '}
            that helps find some of the most common accessibility issues. The scan was{' '}
            performed in a clean browser environment, using {toolData.scanEngineProperties.name}{' '}
            {toolData.scanEngineProperties.version} and {toolData.applicationProperties.environmentName}{' '}
            with a display resolution of {toolData.applicationProperties.resolution}. For a complete{' '}
            WCAG 2.1 compliance assessment please visit{' '}<ToolLink />.
        </>
    );
});
