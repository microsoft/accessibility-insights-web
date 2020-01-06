// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedFC } from 'common/react/named-fc';
import { allInstanceOutcomeTypes, InstanceOutcomeType } from '../instance-outcome-type';
import { OutcomeSummaryBar } from '../outcome-summary-bar';
import { SectionProps } from './report-section-factory';

export type SummarySectionProps = Pick<SectionProps, 'cardsViewData'>;

export const SummarySection = NamedFC<SummarySectionProps>('SummarySection', props => {
    const { cards } = props.cardsViewData;

    const countSummary: { [type in InstanceOutcomeType]: number } = {
        fail: cards.fail.reduce((total, currentFail) => {
            return total + currentFail.nodes.length;
        }, 0),
        pass: cards.pass.length,
        inapplicable: cards.inapplicable.length,
    };

    return (
        <div className="summary-section">
            <h2>Summary</h2>
            <OutcomeSummaryBar
                outcomeStats={countSummary}
                iconStyleInverted={true}
                allOutcomeTypes={allInstanceOutcomeTypes}
            />
        </div>
    );
});
