// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedSFC } from '../../../../common/react/named-sfc';
import { CollapsibleContainer } from './collapsible-container';
import { ResultSectionProps } from './result-section';
import { ResultSectionContent } from './result-section-content';
import { ResultSectionTitle } from './result-section-title';

export type CollapsibleResultSectionProps = ResultSectionProps & {
    buttonAriaLabel: string;
};

export const CollapsibleResultSection = NamedSFC<CollapsibleResultSectionProps>('CollapsibleResultSection', props => {
    const { containerClassName, buttonAriaLabel } = props;

    return (
        <div className={containerClassName}>
            <CollapsibleContainer
                id={containerClassName}
                summaryContent={<ResultSectionTitle {...props} />}
                detailsContent={<ResultSectionContent {...props} />}
                buttonAriaLabel={buttonAriaLabel}
            />
        </div>
    );
});
