// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedSFC } from '../../../../common/react/named-sfc';
import { CollapsibleContainer } from './collapsible-container';
import { ResultSectionProps } from './result-section';
import { ResultSectionTitle } from './result-section-title';
import { RulesOnly } from './rules-only';

export type CollapsibleResultSectionProps = ResultSectionProps & {
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
