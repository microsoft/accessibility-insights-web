// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { css } from '@uifabric/utilities';
import * as React from 'react';

import { NamedSFC } from '../../../../common/react/named-sfc';

type HeadingProps = {
    role: string;
    'aria-level': number;
};

export type CollapsibleContainerProps = {
    titleContainerProps: HeadingProps;
    id: string;
    summaryContent: JSX.Element;
    detailsContent: JSX.Element;
    buttonAriaLabel: string;
    containerClassName?: string;
};

export const CollapsibleContainer = NamedSFC<CollapsibleContainerProps>('CollapsibleContainer', props => {
    const { id, summaryContent, titleContainerProps, detailsContent, buttonAriaLabel, containerClassName } = props;

    const contentId = `content-container-${id}`;

    const outerDivClassName = css('collapsible-container', containerClassName);

    return (
        <div className={outerDivClassName}>
            <div className="title-container" {...titleContainerProps}>
                <button className="collapsible-control" aria-expanded="false" aria-controls={contentId} aria-label={buttonAriaLabel} />
                <div>{summaryContent}</div>
            </div>
            <div id={contentId} className="content-container" aria-hidden="true">
                {detailsContent}
            </div>
        </div>
    );
});
