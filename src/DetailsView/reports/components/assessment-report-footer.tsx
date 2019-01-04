// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { title } from '../../../content/strings/application';

export interface IAssessmentReportFooterProps {
    extensionVersion: string;
    axeVersion: string;
    chromeVersion: string;
}

export class AssessmentReportFooter extends React.Component<IAssessmentReportFooterProps> {
    public render(): JSX.Element {
        return (
            <footer className="report-footer">
                This assessment report was generated using {title}{' '}
                {this.props.extensionVersion} (Axe {this.props.axeVersion}),
                a tool that helps debug and find accessibility issues earlier on {this.props.chromeVersion}.
                Get more information &amp; download this tool
                at <a href="http://aka.ms/AccessibilityInsights" className="link report-footer-link" target="_blank">
                http://aka.ms/AccessibilityInsights</a>
            </footer>
        );
    }
}
