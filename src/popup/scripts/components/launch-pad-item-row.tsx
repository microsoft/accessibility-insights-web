// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { uniqueId } from 'lodash';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { Link } from 'office-ui-fabric-react/lib/Link';
import * as React from 'react';

export interface ILaunchPadItemRowProps {
    title: string;
    iconName: string;
    description: string;
    onClickTitle: (ev?) => void;
}

const descriptionClassName = 'launch-pad-item-description';

export class LaunchPadItemRow extends React.Component<ILaunchPadItemRowProps, undefined> {
    private descriptionId = uniqueId(`${descriptionClassName}-`);
    public render(): JSX.Element {
        return (
            <div className="ms-Grid">
                <div className="ms-Grid-row">
                    <div className="ms-Grid-col ms-sm3 popup-start-dialog-icon-circle">
                        <Icon iconName={this.props.iconName} className="popup-start-dialog-icon" />
                    </div>
                    <div className="ms-Grid-col ms-sm9">
                        <div className="launch-pad-item-title">
                            <Link role="link" onClick={this.props.onClickTitle} aria-describedby={this.descriptionId}>
                                {this.props.title}
                            </Link>
                        </div>
                        <div id={this.descriptionId} className={descriptionClassName}>
                            {this.props.description}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
