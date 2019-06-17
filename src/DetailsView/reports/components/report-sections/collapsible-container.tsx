// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { css } from '@uifabric/utilities';
import * as React from 'react';

import { NamedSFC } from '../../../../common/react/named-sfc';

export type CollapsibleContainerProps = {
    id: string;
    summaryContent: JSX.Element;
    detailsContent: JSX.Element;
    buttonAriaLabel: string;
    titleHeadingLevel?: number;
    containerClassName?: string;
};

export const CollapsibleContainer = NamedSFC<CollapsibleContainerProps>('CollapsibleContainer', props => {
    const { id, summaryContent, titleHeadingLevel, detailsContent, buttonAriaLabel, containerClassName } = props;

    const contentId = `content-container-${id}`;

    const outerDivClassName = css('collapsible-container', containerClassName);

    const titleContainerProps = titleHeadingLevel ? { role: 'heading', 'aria-level': titleHeadingLevel } : undefined;

    return (
        <div className={outerDivClassName}>
            <div className="title-container" {...titleContainerProps}>
                <button className="collapsible-control" aria-expanded="false" aria-controls={contentId} aria-label={buttonAriaLabel} />
                <div>{summaryContent}</div>
            </div>
            <div id={contentId} className="collapsible-content" aria-hidden="true">
                {detailsContent}
            </div>
        </div>
    );
});
