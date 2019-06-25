// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedSFC } from '../../../../common/react/named-sfc';
import { CollapsibleContainer } from './collapsible-container';
import { ResultSectionProps } from './result-section';
import { ResultSectionTitle } from './result-section-title';
import { RulesOnly } from './rules-only';

export type CollapsibleResultSectionProps = ResultSectionProps & {
    buttonAriaLabel: string;
    containerId: string;
};

export const CollapsibleResultSection = NamedSFC<CollapsibleResultSectionProps>('CollapsibleResultSection', props => {
    const { containerClassName, buttonAriaLabel, containerId, title, badgeCount } = props;

    return (
        <div className={containerClassName}>
            <CollapsibleContainer
                id={containerId}
                accessibleHeadingContent={
                    <h2 className="screen-reader-only">
                        {title} {badgeCount}
                    </h2>
                }
                visibleHeadingContent={
                    <div aria-hidden="true">
                        <ResultSectionTitle {...props} />
                    </div>
                }
                collapsibleContent={<RulesOnly {...props} />}
                buttonAriaLabel={buttonAriaLabel}
            />
        </div>
    );
});
