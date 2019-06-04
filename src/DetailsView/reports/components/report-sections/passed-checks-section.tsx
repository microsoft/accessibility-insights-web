// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedSFC } from '../../../../common/react/named-sfc';
import { SectionProps } from './report-section-factory';
import { ResultSectionTitle } from './result-section-title';
import { RuleDetailsGroup } from './rule-details-group';

export type PassedChecksSectionProps = Pick<SectionProps, 'scanResult'>;

export const PassedChecksSection = NamedSFC<PassedChecksSectionProps>('PassedChecksSection', props => {
    const count = props.scanResult.passes.length;
    return (
        <div id="passed-checks-section">
            <ResultSectionTitle title="Passed checks" count={count} outcomeType="pass" />
            <RuleDetailsGroup rules={props.scanResult.passes} />
        </div>
    );
});
