// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';

import { ResultSectionTitleProps } from './result-section-title';
import * as styles from './result-section-title.scss';

const titleClassNames = {
    title: styles.title,
    heading: styles.heading,
};

export const CombinedReportResultSectionTitle = NamedFC<ResultSectionTitleProps>(
    'ResultSectionTitle',
    props => {
        const singularMessageSubject =
            props.outcomeType === 'review' ? 'instance to review' : 'failure';
        const pluralMessageSubject =
            props.outcomeType === 'review' ? 'instances to review' : 'failures';
        const alertTerm =
            props.badgeCount !== 1
                ? `${pluralMessageSubject} were`
                : `${singularMessageSubject} was`;
        const alertingFailuresCount = (
            <span role="alert">
                {props.badgeCount} {alertTerm} detected.
            </span>
        );
        const titleWithInstance = (
            <span className={titleClassNames[props.titleSize]} aria-hidden="true">
                {props.title} "("{props.badgeCount}")"
            </span>
        );

        return (
            <span className={styles.resultSectionTitle}>
                <span className="screen-reader-only">
                    {props.title}{' '}
                    {props.shouldAlertFailuresCount ? alertingFailuresCount : props.badgeCount}
                </span>
                {titleWithInstance}
            </span>
        );
    },
);
