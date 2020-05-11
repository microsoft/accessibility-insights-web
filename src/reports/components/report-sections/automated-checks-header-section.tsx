// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { ScanMetadata } from 'common/types/store-data/unified-data-interface';
import * as React from 'react';
import { HeaderSection } from 'reports/components/report-sections/header-section';

export interface AutomatedChecksHeaderSectionProps {
    scanMetadata: ScanMetadata;
}

export const AutomatedChecksHeaderSection = NamedFC<AutomatedChecksHeaderSectionProps>(
    'AutomatedChecksHeaderSection',
    ({ scanMetadata }) => {
        return <HeaderSection targetAppInfo={scanMetadata.targetAppInfo} />;
    },
);
