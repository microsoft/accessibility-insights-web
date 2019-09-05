// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedSFC } from 'common/react/named-sfc';
import * as React from 'react';

import { ResultSectionTitle } from '../../../DetailsView/components/cards/result-section-title';
import { CollapsibleContainer } from './collapsible-container';
import { ResultSectionProps } from './result-section';
import { RulesOnly, RulesOnlyProps } from './rules-only';

export type CollapsibleResultSectionProps = RulesOnlyProps &
    ResultSectionProps & {
        containerId: string;
    };

export const CollapsibleResultSection = NamedSFC<CollapsibleResultSectionProps>('CollapsibleResultSection', props => {
    const { containerClassName, containerId } = props;

    return (
        <div className={containerClassName}>
            <CollapsibleContainer
                id={containerId}
                visibleHeadingContent={<ResultSectionTitle {...props} />}
                collapsibleContent={<RulesOnly {...props} />}
                titleHeadingLevel={2}
            />
        </div>
    );
});
