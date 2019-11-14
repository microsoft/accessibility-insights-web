// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import * as React from 'react';

export interface FailureDetailsProps {
    items: any[];
}
export class FailureDetails extends React.Component<FailureDetailsProps> {
    public static readonly failureDetailCoda: string =
        'When the Automated Checks toggle is on, failure instances selected in this page are highlighted in the target page.';

    public render(): JSX.Element {
        return (
            <div className="details-message">
                {this.renderIcon()}
                {this.renderMessage()}
            </div>
        );
    }

    private renderIcon(): JSX.Element {
        if (this.props.items && this.props.items.length !== 0) {
            return (
                <Icon
                    iconName="statusErrorFull"
                    className="details-icon-error"
                />
            );
        }

        return null;
    }

    private renderMessage(): JSX.Element[] {
        let dynamicText: string = null;

        const totalItems = this.props.items ? this.props.items.length : 0;

        if (totalItems === 0) {
            dynamicText = 'No failures were detected.';
        } else if (totalItems === 1) {
            dynamicText = '1 failure was detected.';
        } else {
            dynamicText = `${totalItems} failures were detected.`;
        }

        return [
            <span role="alert" key="at-readable-text">
                {dynamicText}
            </span>,
            <span key="coda-text">{` ${FailureDetails.failureDetailCoda}`}</span>,
        ];
    }
}
