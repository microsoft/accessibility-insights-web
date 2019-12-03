// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';

import { InstanceOutcomeType } from '../../../reports/components/instance-outcome-type';
import { OutcomeChip } from '../../../reports/components/outcome-chip';
import * as styles from './result-section-title.scss';

export type ResultSectionTitleProps = {
    title: string;
    badgeCount: number;
    outcomeType: InstanceOutcomeType;
    shouldAlertFailuresCount?: boolean;
};

export const ResultSectionTitle = NamedFC<ResultSectionTitleProps>('ResultSectionTitle', props => {
    const failureTerm = props.badgeCount !== 1 ? 'failures were' : 'failure was';
    const alertingFailuresCount = (
        <span role="alert">
            {props.badgeCount} {failureTerm} detected.
        </span>
    );

    return (
        <span className={styles.resultSectionTitle}>
            <span className="screen-reader-only">
                {props.title} {props.shouldAlertFailuresCount ? alertingFailuresCount : props.badgeCount}
            </span>
            <span className={styles.title} aria-hidden="true">
                {props.title}
            </span>
            <span className={styles.outcomeChipContainer} aria-hidden="true">
                <OutcomeChip outcomeType={props.outcomeType} count={props.badgeCount} />
            </span>
        </span>
    );
});
