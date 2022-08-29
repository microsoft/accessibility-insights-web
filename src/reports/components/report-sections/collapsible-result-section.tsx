// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    ResultSectionTitle,
    ResultSectionTitleProps,
} from 'common/components/cards/result-section-title';
import { HeadingLevel } from 'common/components/heading-element-for-level';
import { CardSelectionMessageCreator } from 'common/message-creators/card-selection-message-creator';
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';
import { ReportCollapsibleContainerProps } from 'reports/components/report-sections/report-collapsible-container';

import { RulesOnly, RulesOnlyDeps, RulesOnlyProps } from './rules-only';

export type CollapsibleResultSectionDeps = {
    collapsibleControl: (props: ReportCollapsibleContainerProps) => JSX.Element;
} & RulesOnlyDeps;

export type CollapsibleResultSectionProps = RulesOnlyProps &
    Omit<ResultSectionTitleProps, 'titleSize'> & {
        deps: CollapsibleResultSectionDeps;
        containerId: string;
        containerClassName: string;
        cardSelectionMessageCreator?: CardSelectionMessageCreator;
        testKey?: string;
        headingLevel: HeadingLevel;
    };

export const CollapsibleResultSection = NamedFC<CollapsibleResultSectionProps>(
    'CollapsibleResultSection',
    props => {
        const { containerClassName, containerId, deps, cardSelectionMessageCreator, testKey } =
            props;
        const CollapsibleContent = deps.collapsibleControl({
            id: containerId,
            header: <ResultSectionTitle {...props} titleSize="title" />,
            content: <RulesOnly {...props} />,
            headingLevel: props.headingLevel,
            deps: null,
            testKey,
            onExpandToggle: (event: React.MouseEvent<HTMLDivElement>) => {
                cardSelectionMessageCreator?.toggleRuleExpandCollapse(containerId, event);
            },
        });

        return <div className={containerClassName}>{CollapsibleContent}</div>;
    },
);
