// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { css } from '@uifabric/utilities';
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';

import { CollapsibleComponentCardsProps } from '../../../DetailsView/components/cards/collapsible-component-cards';

const ReportCollapsibleContainer = NamedFC<CollapsibleComponentCardsProps>('ReportCollapsibleContainer', props => {
    const { id, header, headingLevel, content, containerClassName, buttonAriaLabel } = props;

    const contentId = `content-container-${id}`;

    const outerDivClassName = css('collapsible-container', containerClassName, 'collapsed');

    const titleContainerProps = { role: 'heading', 'aria-level': headingLevel };

    return (
        <div className={outerDivClassName}>
            <div className="title-container" {...titleContainerProps}>
                <button className="collapsible-control" aria-expanded="false" aria-controls={contentId} aria-label={buttonAriaLabel}>
                    {header}
                </button>
            </div>
            <div id={contentId} className="collapsible-content" aria-hidden="true">
                {content}
            </div>
        </div>
    );
});

export const ReportCollapsibleContainerControl = (collapsibleControlProps: CollapsibleComponentCardsProps) => (
    <ReportCollapsibleContainer {...collapsibleControlProps} />
);
