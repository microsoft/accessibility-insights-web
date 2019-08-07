// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TooltipHost } from 'office-ui-fabric-react/lib/Tooltip';
import * as React from 'react';

export interface FailureInstanceDetailsColumnProps {
    descriptionContent: string;
    pathContent: string;
}

export class FailureInstanceDetailsColumn extends React.Component<FailureInstanceDetailsColumnProps> {
    public render(): JSX.Element {
        return (
            <div className="failure-instance-details-row">
                {this.props.pathContent ? (
                    <div className="failure-instance-allContent">
                        <div className="failure-instance-path">
                            <strong> Path: </strong>
                        </div>
                        <TooltipHost content={this.props.pathContent} calloutProps={{ gapSpace: 0 }}>
                            <div className="failure-instance-valueContent">{this.props.pathContent}</div>
                        </TooltipHost>
                    </div>
                ) : null}
                {this.props.descriptionContent ? (
                    <div className="failure-instance-allContent">
                        <div className="failure-instance-comment">
                            <strong> Comment: </strong>
                        </div>
                        <TooltipHost content={this.props.descriptionContent} calloutProps={{ gapSpace: 0 }}>
                            <div className="failure-instance-valueContent">{this.props.descriptionContent}</div>
                        </TooltipHost>
                    </div>
                ) : null}
            </div>
        );
    }
}
