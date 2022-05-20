// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';
import { OutcomeType } from 'reports/components/outcome-type';

import styles from './combined-report-result-section-title.scss';

export type CombinedReportResultSectionTitleProps = {
    title: string;
    outcomeCount: number;
    outcomeType: OutcomeType;
    shouldAlertFailuresCount?: boolean;
};

export const CombinedReportResultSectionTitle = NamedFC<CombinedReportResultSectionTitleProps>(
    'CombinedResultSectionTitle',
    props => {
        const singularMessageSubject =
            props.outcomeType === 'review' ? 'instance to review' : 'failure';
        const pluralMessageSubject =
            props.outcomeType === 'review' ? 'instances to review' : 'failures';
        const alertTerm =
            props.outcomeCount !== 1
                ? `${pluralMessageSubject} were`
                : `${singularMessageSubject} was`;
        const alertingFailuresCount = (
            <span role="alert">
                {props.outcomeCount} {alertTerm} detected.
            </span>
        );
        const titleWithInstance = (
            <span className={styles.heading} aria-hidden="true">
                {props.title} ({props.outcomeCount})
            </span>
        );

        return (
            <span className={styles.combinedReportResultSectionTitle}>
                <span className="screen-reader-only">
                    {props.title}{' '}
                    {props.shouldAlertFailuresCount ? alertingFailuresCount : props.outcomeCount}
                </span>
                {titleWithInstance}
            </span>
        );
    },
);
