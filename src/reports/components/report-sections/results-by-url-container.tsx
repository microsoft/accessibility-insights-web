// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';
import { SummaryReportSectionProps } from 'reports/components/report-sections/summary-report-section-factory';

export type ResultsByUrlContainerProps = Pick<SummaryReportSectionProps, 'getCollapsibleScript'>;

export const ResultsByUrlContainer = NamedFC<ResultsByUrlContainerProps>(
    'ResultsContainer',
    ({ children, getCollapsibleScript }) => {
        return (
            <>
                <h2>Results by URL</h2>
                <div className="results-container">{children}</div>
                {/* tslint:disable-next-line: react-no-dangerous-html */}
                <script dangerouslySetInnerHTML={{ __html: getCollapsibleScript() }} />
            </>
        );
    },
);
