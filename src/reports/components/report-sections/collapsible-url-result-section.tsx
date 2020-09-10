// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CollapsibleComponentCardsProps } from 'common/components/cards/collapsible-component-cards';
import {
    ResultSectionTitle,
    ResultSectionTitleProps,
} from 'common/components/cards/result-section-title';
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';
import { NullComponent } from 'common/components/null-component';

export type CollapsibleUrlResultSectionDeps = {
    collapsibleControl: (props: CollapsibleComponentCardsProps) => JSX.Element;
};

export type CollapsibleUrlResultSectionProps = Omit<ResultSectionTitleProps, 'titleSize'> & {
    deps: CollapsibleUrlResultSectionDeps;
    containerId: string;
};

export const CollapsibleUrlResultSection = NamedFC<CollapsibleUrlResultSectionProps>(
    'CollapsibleResultSection',
    props => {
        const { containerId, deps } = props;
        const CollapsibleContent = deps.collapsibleControl({
            id: containerId,
            header: <ResultSectionTitle {...props} titleSize="heading" />,
            content: <NullComponent />,
            headingLevel: 3,
            deps: null,
        });

        return <div className="url-result-section">{CollapsibleContent}</div>;
    },
);
