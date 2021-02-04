// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';

import { OutcomeType } from 'reports/components/outcome-type';
import { OutcomeChip } from '../../../reports/components/outcome-chip';
import * as styles from './result-section-title.scss';

export type ResultSectionTitleProps = {
    title: string;
    badgeCount: number;
    outcomeType: OutcomeType;
    titleSize: keyof typeof titleClassNames;
    shouldAlertFailuresCount?: boolean;
};

const titleClassNames = {
    title: styles.title,
    heading: styles.heading,
};

export const ResultSectionTitle = NamedFC<ResultSectionTitleProps>('ResultSectionTitle', props => {
    const singularMessageSubject =
        props.outcomeType === 'review' ? 'instance to review' : 'failure';
    const pluralMessageSubject =
        props.outcomeType === 'review' ? 'instances to review' : 'failures';
    const alertTerm =
        props.badgeCount !== 1 ? `${pluralMessageSubject} were` : `${singularMessageSubject} was`;
    const alertingFailuresCount = (
        <span role="alert">
            {props.badgeCount} {alertTerm} detected.
        </span>
    );

    return (
        <span className={styles.resultSectionTitle}>
            <span className="screen-reader-only">
                {props.title}{' '}
                {props.shouldAlertFailuresCount ? alertingFailuresCount : props.badgeCount}
            </span>
            <span className={titleClassNames[props.titleSize]} aria-hidden="true">
                {props.title}
            </span>
            <span className={styles.outcomeChipContainer} aria-hidden="true">
                <OutcomeChip outcomeType={props.outcomeType} count={props.badgeCount} />
            </span>
        </span>
    );
});
