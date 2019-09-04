// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedSFC } from 'common/react/named-sfc';
import * as React from 'react';

import { ResultSectionTitleV2 } from '../../../DetailsView/components/cards/result-section-title-v2';
import { ResultSectionContent, ResultSectionContentDeps, ResultSectionContentProps } from './result-section-content';
import { ResultSectionTitleProps } from './result-section-title';

export type ResultSectionDeps = ResultSectionContentDeps;

export type ResultSectionProps = ResultSectionContentProps &
    ResultSectionTitleProps & {
        containerClassName: string;
        deps: ResultSectionDeps;
    };

export const ResultSection = NamedSFC<ResultSectionProps>('ResultSection', props => {
    const { containerClassName } = props;

    return (
        <div className={containerClassName}>
            <h2>
                <ResultSectionTitleV2 {...props} />
            </h2>
            <ResultSectionContent {...props} />
        </div>
    );
});
