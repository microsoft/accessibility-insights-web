// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedSFC } from '../../../../common/react/named-sfc';

type HeadingProps = {
    role: string;
    'aria-level': number;
};

export type SummaryDetailsProps = {
    summaryProps: HeadingProps;
    id: string;
    summaryContent: JSX.Element;
    detailsContent: JSX.Element;
};

export const SummaryDetails = NamedSFC<SummaryDetailsProps>('SummaryDetails', ({ id, summaryContent, summaryProps, detailsContent }) => {
    const contentId = `details-content-${id}`;
    const summaryId = `summary-${id}`;
    return (
        <div className="summary-details" id={`summary-details-${id}`}>
            <div className="summary-container" {...summaryProps}>
                <button className="collapsible-control" aria-expanded="false" aria-controls={contentId} />
                <div id={summaryId}>{summaryContent}</div>
            </div>
            <div id={contentId} className="details-container" aria-hidden="true">
                {detailsContent}
            </div>
        </div>
    );
});
