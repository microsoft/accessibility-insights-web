// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { title } from 'content/strings/application';
import * as React from 'react';

export interface AssessmentReportFooterProps {
    extensionVersion: string;
    axeVersion: string;
    chromeVersion: string;
}

export class AssessmentReportFooter extends React.Component<AssessmentReportFooterProps> {
    public render(): JSX.Element {
        return (
            <footer className="report-footer">
                This assessment report was generated using {title} {this.props.extensionVersion}{' '}
                (axe-core {this.props.axeVersion}), a tool that helps debug and find accessibility
                issues earlier on {this.props.chromeVersion}. Get more information & download this
                tool at{' '}
                <a
                    href="http://aka.ms/AccessibilityInsights"
                    className="link report-footer-link"
                    target="_blank"
                    rel="noreferrer"
                >
                    http://aka.ms/AccessibilityInsights
                </a>
            </footer>
        );
    }
}
