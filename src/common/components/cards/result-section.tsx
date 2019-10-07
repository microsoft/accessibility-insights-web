// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { css } from '@uifabric/utilities';
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';

import { UserConfigurationStoreData } from '../../types/store-data/user-configuration-store';
import { ResultSectionContent, ResultSectionContentDeps, ResultSectionContentProps } from './result-section-content';
import { ResultSectionTitle, ResultSectionTitleProps } from './result-section-title';
import { resultSection } from './result-section.scss';

export type ResultSectionDeps = ResultSectionContentDeps;

export type ResultSectionProps = ResultSectionContentProps &
    ResultSectionTitleProps & {
        userConfigurationStoreData: UserConfigurationStoreData;
        containerClassName: string;
        deps: ResultSectionDeps;
    };

export const ResultSection = NamedFC<ResultSectionProps>('ResultSection', props => {
    const { containerClassName } = props;

    return (
        <div className={css(containerClassName, resultSection)}>
            <h2>
                <ResultSectionTitle {...props} />
            </h2>
            <ResultSectionContent {...props} />
        </div>
    );
});
