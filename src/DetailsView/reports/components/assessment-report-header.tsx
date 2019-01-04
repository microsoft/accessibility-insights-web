// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import * as React from 'react';

import { NewTabLink } from '../../../common/components/new-tab-link';
import { BrandWhite } from '../../../icons/brand/white/brand-white';
import { productName } from '../../../content/strings/application';

export interface IAssessmentReportHeaderProps {
    targetPageUrl: string;
    targetPageTitle: string;
}

export class AssessmentReportHeader extends React.Component<IAssessmentReportHeaderProps> {

    public render(): JSX.Element {
        return (
            <header>
                <div className="report-header-bar">
                    <BrandWhite size={24} />
                    <div className="ms-font-m header-text ms-fontWeight-semibold">{productName}</div>
                </div>
                <div className="report-header-command-bar">
                    <div className="target-page">
                        Target page:&nbsp;
                        <NewTabLink href={this.props.targetPageUrl} title={this.props.targetPageTitle}>
                            {this.props.targetPageTitle}
                        </NewTabLink>
                    </div>
                </div>
            </header>
        );
    }
}
