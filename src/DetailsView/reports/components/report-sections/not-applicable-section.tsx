// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedSFC } from '../../../../common/react/named-sfc';
import { SectionProps } from './report-section-factory';
import { ResultSectionTitle } from './result-section-title';

export type NotApplicableChecksSectionProps = Pick<SectionProps, 'scanResult'>;

export const NotApplicableChecksSection = NamedSFC<NotApplicableChecksSectionProps>('NotApplicableChecksSection', props => {
    const count = props.scanResult.inapplicable.length;
    return (
        <div id="not-applicable-checks-section">
            <ResultSectionTitle title="Not applicable" count={count} outcomeType="incomplete" />
        </div>
    );
});
