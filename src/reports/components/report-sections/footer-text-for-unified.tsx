// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';
import { FooterTextProps } from 'reports/components/report-sections/footer-text-props';
import { ToolLink } from 'reports/components/report-sections/tool-link';

export const FooterTextForUnified = NamedFC<FooterTextProps>(
    'FooterTextForUnified',
    ({ scanMetadata }) => {
        const applicationProperties = scanMetadata.toolData.applicationProperties;
        const scanEngineProperties = scanMetadata.toolData.scanEngineProperties;
        return (
            <>
                This automated checks result was generated using{' '}
                {`${applicationProperties.name} ${applicationProperties.version} (${scanEngineProperties.name} ${scanEngineProperties.version})`}
                , a tool that helps debug and find accessibility issues earlier. Get more
                information & download this tool at <ToolLink />.
            </>
        );
    },
);
