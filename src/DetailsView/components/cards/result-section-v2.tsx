// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedSFC } from 'common/react/named-sfc';
import * as React from 'react';
import {
    ResultSectionContentProps,
    ResultSectionContentDeps,
    ResultSectionContent,
} from '../../../reports/components/report-sections/result-section-content';
import { ResultSectionTitleProps, ResultSectionTitle } from '../../../reports/components/report-sections/result-section-title';

export type ResultSectionDeps = ResultSectionContentDeps;

export type ResultSectionPropsV2 = ResultSectionContentProps &
    ResultSectionTitleProps & {
        containerClassName: string;
        deps: ResultSectionDeps;
    };

export const ResultSectionV2 = NamedSFC<ResultSectionPropsV2>('ResultSectionV2', props => {
    const { containerClassName } = props;

    return (
        <div className={containerClassName}>
            <h2>
                <ResultSectionTitle {...props} />
            </h2>
            <ResultSectionContent {...props} />
        </div>
    );
});
