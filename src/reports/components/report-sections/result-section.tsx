// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-sfc';
import * as React from 'react';

import { ResultSectionTitle, ResultSectionTitleProps } from '../../../DetailsView/components/cards/result-section-title';
import { ResultSectionContent, ResultSectionContentDeps, ResultSectionContentProps } from './result-section-content';

export type ResultSectionDeps = ResultSectionContentDeps;

export type ResultSectionProps = ResultSectionContentProps &
    ResultSectionTitleProps & {
        containerClassName: string;
        deps: ResultSectionDeps;
    };

export const ResultSection = NamedFC<ResultSectionProps>('ResultSection', props => {
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
