// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { css } from '@uifabric/utilities';
import { INavLink } from 'office-ui-fabric-react/lib/Nav';
import * as React from 'react';

import { ManualTestStatus } from '../../common/types/manual-test-status';
import { reqDescription, reqIndex, reqName } from './requirement-link.scss';
import { StatusIcon } from './status-icon';

export interface RequirementLinkProps {
    link: INavLink;
    status: ManualTestStatus;
    renderRequirementDescription: (link: RequirementLink) => JSX.Element;
}

export class RequirementLink extends React.Component<RequirementLinkProps> {
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
            <div className={css('ms-Button-label', reqDescription)}>
                <span className={reqIndex}>{this.props.link.index}</span>
                <span className={reqName}>{this.props.link.name}.</span>
                {this.props.link.description}
            </div>
        );
    }

    public renderRequirementDescriptionWithoutIndex(): JSX.Element {
        return (
            <div className={css('ms-Button-label', reqDescription)}>
                <span className={reqName}>{this.props.link.name}.</span>
                {this.props.link.description}
            </div>
        );
    }
}
