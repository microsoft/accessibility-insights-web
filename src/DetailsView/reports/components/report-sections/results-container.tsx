// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { NamedSFC } from 'common/react/named-sfc';
import { SectionProps } from './report-section-factory';

export type ResultsContainerProps = Pick<SectionProps, 'getCollapsibleScript'>;

export const ResultsContainer = NamedSFC<ResultsContainerProps>('ResultsContainer', ({ children, getCollapsibleScript }) => {
    return (
        <>
            <div className="results-container">{children}</div>
            <script dangerouslySetInnerHTML={{ __html: getCollapsibleScript() }} />
        </>
    );
});
