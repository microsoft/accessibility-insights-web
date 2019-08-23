// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedSFC } from 'common/react/named-sfc';
import * as React from 'react';

import { ResultSectionTitle, ResultSectionTitleProps } from '../../../reports/components/report-sections/result-section-title';
import { ResultSectionContentDepsV2, ResultSectionContentPropsV2, ResultSectionContentV2 } from './result-section-content-v2';

export type ResultSectionDepsV2 = ResultSectionContentDepsV2;

export type ResultSectionPropsV2 = ResultSectionContentPropsV2 &
    ResultSectionTitleProps & {
        containerClassName: string;
        deps: ResultSectionDepsV2;
    };

export const ResultSectionV2 = NamedSFC<ResultSectionPropsV2>('ResultSectionV2', props => {
    const { containerClassName } = props;

    return (
        <div className={containerClassName}>
            <h2>
                <ResultSectionTitle {...props} />
            </h2>
            <ResultSectionContentV2 {...props} />
        </div>
    );
});
