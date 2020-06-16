// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { css } from '@uifabric/utilities';
import { INavLink } from 'office-ui-fabric-react';
import * as React from 'react';

import { ManualTestStatus } from '../../common/types/manual-test-status';
import * as styles from './requirement-link.scss';
import { StatusIcon } from './status-icon';

export interface RequirementLinkProps {
    link: INavLink;
    status: ManualTestStatus;
    renderRequirementDescription: (link: RequirementLink) => JSX.Element;
}

export class RequirementLink extends React.Component<RequirementLinkProps> {
    public render(): JSX.Element {
        return (
            <span className={styles.requirementLink} aria-hidden="true">
                {this.props.renderRequirementDescription(this)}
                <StatusIcon status={this.props.status} level="requirement" />
            </span>
        );
    }

    public renderRequirementDescriptionWithIndex(): JSX.Element {
        return (
            <span className={css('ms-Button-label', styles.reqDescription)}>
                <span className={styles.reqIndex}>{this.props.link.index}</span>
                <span className={styles.reqName}>{this.props.link.name}.</span>
                {this.props.link.description}
            </span>
        );
    }

    public renderRequirementDescriptionWithoutIndex(): JSX.Element {
        return (
            <span className={css('ms-Button-label', styles.reqDescription)}>
                <span className={styles.reqName}>{this.props.link.name}.</span>
                {this.props.link.description}
            </span>
        );
    }
}
