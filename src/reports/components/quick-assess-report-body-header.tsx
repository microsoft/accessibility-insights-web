// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

export class QuickAssessReportBodyHeader extends React.Component {
    public render(): JSX.Element {
        return (
            <div className="quick-assess-report-body-header">
                <h1>QuickAssess report</h1>
                <p>
                    This report shows the results from a combination of assisted and manual tests that cover limited aspects of the WCAG 2.1 AA success criteria.
                </p>
            </div>
        );
    }
}
