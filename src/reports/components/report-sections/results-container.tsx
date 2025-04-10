// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';
import { SectionProps } from './report-section-factory';

export type ResultsContainerProps = Pick<SectionProps, 'getCollapsibleScript' | 'getCopyToClipboardScript'>;

export const ResultsContainer = NamedFC<ResultsContainerProps>(
    'ResultsContainer',
    ({ children, getCollapsibleScript, getCopyToClipboardScript }) => {
        return (
            <>
                <div className="results-container">{children}</div>
                <script dangerouslySetInnerHTML={{ __html: getCollapsibleScript() }} />
                <script dangerouslySetInnerHTML={{ __html: getCopyToClipboardScript() }} />
            </>
        );
    },
);
