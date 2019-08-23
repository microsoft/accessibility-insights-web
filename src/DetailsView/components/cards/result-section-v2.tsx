// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedSFC } from 'common/react/named-sfc';
import * as React from 'react';

import { ResultSectionTitle, ResultSectionTitleProps } from '../../../reports/components/report-sections/result-section-title';
import { ResultSectionContentV2, ResultSectionContentV2Deps, ResultSectionContentV2Props } from './result-section-content-v2';

export type ResultSectionV2Deps = ResultSectionContentV2Deps;

export type ResultSectionV2Props = ResultSectionContentV2Props &
    ResultSectionTitleProps & {
        containerClassName: string;
        deps: ResultSectionV2Deps;
    };

export const ResultSectionV2 = NamedSFC<ResultSectionV2Props>('ResultSectionV2', props => {
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
