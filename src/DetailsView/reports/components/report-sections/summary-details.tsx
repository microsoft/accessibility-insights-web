// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedSFC } from '../../../../common/react/named-sfc';

export type SummaryDetailsProps = {
    summaryProps?: Object;
    summaryContent: JSX.Element;
    detailsContent: JSX.Element;
};

export const SummaryDetails = NamedSFC<SummaryDetailsProps>('SummaryDetails', ({ summaryContent, summaryProps, detailsContent }) => {
    return (
        <details>
            <summary {...summaryProps}>{summaryContent}</summary>
            {detailsContent}
        </details>
    );
});
