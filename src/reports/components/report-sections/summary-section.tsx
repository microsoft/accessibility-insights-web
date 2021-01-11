// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';

import { InstanceOutcomeType } from '../instance-outcome-type';
import { OutcomeSummaryBar } from '../outcome-summary-bar';
import { SectionProps } from './report-section-factory';

export type SummarySectionProps = Pick<SectionProps, 'cardsViewData'>;
export type BaseSummarySectionProps = {
    outcomeTypesShown: InstanceOutcomeType[];
} & SummarySectionProps;

export const BaseSummarySection = NamedFC<BaseSummarySectionProps>('BaseSummarySection', props => {
    const { cards } = props.cardsViewData;

    const countSummary: { [type in InstanceOutcomeType]: number } = {
        fail: cards.fail.reduce((total, currentFail) => {
            return total + currentFail.nodes.length;
        }, 0),
        pass: cards.pass.length,
        inapplicable: cards.inapplicable.length,
        review: 0, // never used
    };

    return (
        <div className="summary-section">
            <h2>Summary</h2>
            <OutcomeSummaryBar
                outcomeStats={countSummary}
                iconStyleInverted={true}
                allOutcomeTypes={props.outcomeTypesShown}
            />
        </div>
    );
});

export const AllOutcomesSummarySection = NamedFC<SummarySectionProps>(
    'AllOutcomesSummarySection',
    props => {
        return (
            <BaseSummarySection {...props} outcomeTypesShown={['fail', 'pass', 'inapplicable']} />
        );
    },
);

export const PassFailSummarySection = NamedFC<SummarySectionProps>(
    'PassFailSummarySection',
    props => {
        return <BaseSummarySection {...props} outcomeTypesShown={['fail', 'pass']} />;
    },
);
