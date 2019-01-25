// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { INavLink } from 'office-ui-fabric-react/lib/Nav';
import * as React from 'react';

import { ManualTestStatus } from '../../common/types/manual-test-status';
import { StatusIcon } from './status-icon';

export interface ITestStepLinkProps {
    link: INavLink;
    status: ManualTestStatus;
    renderRequirementDescription: (testStepLink: TestStepLink) => JSX.Element;
}

export class TestStepLink extends React.Component<ITestStepLinkProps> {
    public render(): JSX.Element {
        return (
            <div className={'button-flex-container'} aria-hidden="true">
                {this.props.renderRequirementDescription(this)}
                <StatusIcon status={this.props.status} level="requirement" />
            </div>
        );
    }

    public renderRequirementDescriptionWithIndex(): JSX.Element {
        return (
            <div className={'ms-Button-label req-description'}>
                <span className="req-index">{this.props.link.index}</span>
                <span className="req-name">{this.props.link.name}.</span>
                {this.props.link.description}
            </div>
        );
    }

    public renderRequirementDescriptionWithoutIndex(): JSX.Element {
        return (
            <div className={'ms-Button-label req-description'}>
                <span className="req-name">{this.props.link.name}.</span>
                {this.props.link.description}
            </div>
        );
    }
}
