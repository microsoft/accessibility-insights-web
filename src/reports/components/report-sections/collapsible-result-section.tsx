// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CollapsibleComponentCardsProps } from 'common/components/cards/collapsible-component-cards';
import {
    ResultSectionTitle,
    ResultSectionTitleProps,
} from 'common/components/cards/result-section-title';
import { CardSelectionMessageCreator } from 'common/message-creators/card-selection-message-creator';
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';

import { RulesOnly, RulesOnlyDeps, RulesOnlyProps } from './rules-only';

export type CollapsibleResultSectionDeps = {
    collapsibleControl: (props: CollapsibleComponentCardsProps) => JSX.Element;
} & RulesOnlyDeps;

export type CollapsibleResultSectionProps = RulesOnlyProps &
    Omit<ResultSectionTitleProps, 'titleSize'> & {
        deps: CollapsibleResultSectionDeps;
        containerId: string;
        containerClassName: string;
        cardSelectionMessageCreator: CardSelectionMessageCreator;
    };

export const CollapsibleResultSection = NamedFC<CollapsibleResultSectionProps>(
    'CollapsibleResultSection',
    props => {
        const { containerClassName, containerId, deps, cardSelectionMessageCreator } = props;
        const CollapsibleContent = deps.collapsibleControl({
            id: containerId,
            header: <ResultSectionTitle {...props} titleSize="title" />,
            content: <RulesOnly {...props} />,
            headingLevel: 2,
            deps: null,
            onExpandToggle: (event: React.MouseEvent<HTMLDivElement>) => {
                cardSelectionMessageCreator.toggleRuleExpandCollapse(containerId, event);
            },
        });

        return <div className={containerClassName}>{CollapsibleContent}</div>;
    },
);
