// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { css } from '@fluentui/utilities';
import { HeadingElementForLevel, HeadingLevel } from 'common/components/heading-element-for-level';
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';

import {
    ResultSectionContent,
    ResultSectionContentDeps,
    ResultSectionContentProps,
} from './result-section-content';
import { ResultSectionTitle, ResultSectionTitleProps } from './result-section-title';
import styles from './result-section.scss';

export type ResultSectionDeps = ResultSectionContentDeps;

export type ResultSectionProps = Omit<ResultSectionContentProps, 'headingLevel'> &
    Omit<ResultSectionTitleProps, 'titleSize'> & {
        containerClassName?: string;
        deps: ResultSectionDeps;
        sectionHeadingLevel: HeadingLevel;
    };

export const resultSectionAutomationId = 'result-section';

export const ResultSection = NamedFC<ResultSectionProps>('ResultSection', props => {
    const { containerClassName, sectionHeadingLevel, deps } = props;
    return (
        <div
            className={css(containerClassName, styles.resultSection)}
            data-automation-id={resultSectionAutomationId}
        >
            <HeadingElementForLevel headingLevel={sectionHeadingLevel}>
                <ResultSectionTitle {...props} titleSize="title" />
            </HeadingElementForLevel>
            <ResultSectionContent
                headingLevel={deps.getNextHeadingLevel(sectionHeadingLevel)}
                {...props}
            />
        </div>
    );
});
