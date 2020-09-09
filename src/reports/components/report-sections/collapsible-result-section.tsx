// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CollapsibleComponentCardsProps } from 'common/components/cards/collapsible-component-cards';
import {
    ResultSectionTitle,
    ResultSectionTitleProps,
} from 'common/components/cards/result-section-title';
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
    };

export const CollapsibleResultSection = NamedFC<CollapsibleResultSectionProps>(
    'CollapsibleResultSection',
    props => {
        const { containerClassName, containerId, deps } = props;
        const CollapsibleContent = deps.collapsibleControl({
            id: containerId,
            header: <ResultSectionTitle {...props} titleSize="large" />,
            content: <RulesOnly {...props} />,
            headingLevel: 2,
            deps: null,
        });

        return <div className={containerClassName}>{CollapsibleContent}</div>;
    },
);
