// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TooltipHost } from 'office-ui-fabric-react/lib/Tooltip';
import { css } from '@uifabric/utilities';
import * as React from 'react';

export interface IAssessmentInstanceDetailsColumnProps {
    labelText?: string;
    textContent: string;
    background: string;
    tooltipId: string;
    customClassName?: string;
}

export class AssessmentInstanceDetailsColumn extends React.Component<IAssessmentInstanceDetailsColumnProps> {
    public render(): JSX.Element {
        const showLabel = !!this.props.labelText;
        const textContent = this.props.textContent;

        const classNames = css('assessment-instance-label', this.props.customClassName);

        return (
            <div>
                 { showLabel ?
                <div className={classNames}
                    style={{ background: this.props.background }}
                >
                    {this.props.labelText}
                </div>
                 : null }
                <div>
                    <TooltipHost
                        content={textContent}
                        calloutProps={{ gapSpace: 0 }}
                    >
                        <div className="assessment-instance-textContent">
                            {textContent}
                        </div>
                    </TooltipHost>
                </div>
            </div>
        );
    }
}
