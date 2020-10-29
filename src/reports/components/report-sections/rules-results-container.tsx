// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';
import { CombinedReportSectionProps } from 'reports/components/report-sections/combined-report-section-factory';
import * as styles from './rules-results-container.scss';

export type RulesResultsContainerProps = Pick<CombinedReportSectionProps, 'getCollapsibleScript'>;

export const RulesResultsContainer = NamedFC<RulesResultsContainerProps>(
    'RulesResultsContainer',
    ({ children, getCollapsibleScript }) => {
        return (
            <>
                <div className={styles.rulesResultsContainer}>
                    <div className={styles.resultsHeading}>Rules</div>
                    {children}
                </div>
                {/* tslint:disable-next-line: react-no-dangerous-html */}
                <script dangerouslySetInnerHTML={{ __html: getCollapsibleScript() }} />
            </>
        );
    },
);
