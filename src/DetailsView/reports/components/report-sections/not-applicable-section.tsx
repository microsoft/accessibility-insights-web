// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedSFC } from '../../../../common/react/named-sfc';
import { SectionProps } from './report-section-factory';
import { ResultSection } from './result-section';

export type NotApplicableChecksSectionProps = Pick<SectionProps, 'scanResult'>;

export const NotApplicableChecksSection = NamedSFC<NotApplicableChecksSectionProps>('NotApplicableChecksSection', ({ scanResult }) => (
    <ResultSection
        title="Not applicable"
        rules={scanResult.inapplicable}
        containerClassName="not-applicable-checks-section"
        outcomeType="inapplicable"
    />
));
