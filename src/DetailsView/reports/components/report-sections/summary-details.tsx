// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedSFC } from '../../../../common/react/named-sfc';

type HeadingProps = {
    role: string;
    'aria-level': number;
};

export type CollapsibleContainerProps = {
    summaryProps: HeadingProps;
    id: string;
    summaryContent: JSX.Element;
    detailsContent: JSX.Element;
    buttonAriaLabel: string;
};

export const CollapsibleContainer = NamedSFC<CollapsibleContainerProps>('CollapsibleContainer', props => {
    const { id, summaryContent, summaryProps, detailsContent, buttonAriaLabel } = props;

    const contentId = `details-content-${id}`;

    return (
        <div className="summary-details">
            <div className="summary-container" {...summaryProps}>
                <button className="collapsible-control" aria-expanded="false" aria-controls={contentId} aria-label={buttonAriaLabel} />
                <div>{summaryContent}</div>
            </div>
            <div id={contentId} className="details-container" aria-hidden="true">
                {detailsContent}
            </div>
        </div>
    );
});
