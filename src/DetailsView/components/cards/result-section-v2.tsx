// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { css } from '@uifabric/utilities';
import { NamedFC } from 'common/react/named-sfc';
import * as React from 'react';

import { ResultSectionContentV2, ResultSectionContentV2Deps, ResultSectionContentV2Props } from './result-section-content-v2';
import { ResultSectionTitle, ResultSectionTitleProps } from './result-section-title';
import { resultSection } from './result-section.scss';

export type ResultSectionV2Deps = ResultSectionContentV2Deps;

export type ResultSectionV2Props = ResultSectionContentV2Props &
    ResultSectionTitleProps & {
        containerClassName: string;
        deps: ResultSectionV2Deps;
    };

export const ResultSectionV2 = NamedFC<ResultSectionV2Props>('ResultSectionV2', props => {
    const { containerClassName } = props;

    return (
        <div className={css(containerClassName, resultSection)}>
            <h2>
                <ResultSectionTitle {...props} />
            </h2>
            <ResultSectionContentV2 {...props} />
        </div>
    );
});
