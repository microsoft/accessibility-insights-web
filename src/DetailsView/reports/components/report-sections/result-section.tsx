// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedSFC } from '../../../../common/react/named-sfc';
import { ResultSectionContent, ResultSectionContentProps } from './result-section-content';
import { ResultSectionTitle, ResultSectionTitleProps } from './result-section-title';

export type ResultSectionProps = ResultSectionContentProps &
    ResultSectionTitleProps & {
        containerClassName: string;
    };

export const ResultSection = NamedSFC<ResultSectionProps>('ResultSection', props => {
    const { containerClassName } = props;

    return (
        <div className={containerClassName}>
            <ResultSectionTitle {...props} />
            <ResultSectionContent {...props} />
        </div>
    );
});
