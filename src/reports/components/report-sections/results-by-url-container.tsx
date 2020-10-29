// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';
import { CombinedReportSectionProps } from 'reports/components/report-sections/combined-report-section-factory';
import * as styles from './results-by-url-container.scss';
export type ResultsByUrlContainerProps = Pick<CombinedReportSectionProps, 'getCollapsibleScript'>;

export const ResultsByUrlContainer = NamedFC<ResultsByUrlContainerProps>(
    'ResultsContainer',
    ({ children, getCollapsibleScript }) => {
        return (
            <>
                <div className={styles.urlResultsContainer}>
                    <div className={styles.resultsHeading}>
                        <h2>Results by URL</h2>
                    </div>
                    {children}
                </div>
                {/* tslint:disable-next-line: react-no-dangerous-html */}
                <script dangerouslySetInnerHTML={{ __html: getCollapsibleScript() }} />
            </>
        );
    },
);
