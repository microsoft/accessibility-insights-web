// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

export class AssessmentReportBodyHeader extends React.Component {
    public render(): JSX.Element {
        return (
            <div className="assessment-report-body-header">
                <h1>Assessment report</h1>
                <p>
                    This report shows the overall accessibility of the website or web app through a
                    combination of automated and manual tests that cover all the WCAG 2.1 AA and 2.2
                    AA success criteria.
                </p>
            </div>
        );
    }
}
