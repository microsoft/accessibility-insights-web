// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { css } from '@uifabric/utilities';
import { TooltipHost } from 'office-ui-fabric-react';
import * as React from 'react';

import * as styles from './assessment-instance-details-column.scss';

export interface AssessmentInstanceDetailsColumnProps {
    labelText?: string;
    headerText?: string;
    textContent: string;
    background?: string;
    customClassName?: string;
}

export const instanceTableTextContentAutomationId = 'instance-table-text-content';
export class AssessmentInstanceDetailsColumn extends React.Component<AssessmentInstanceDetailsColumnProps> {
    public render(): JSX.Element {
        const showLabel = !!this.props.labelText;
        const showHeader = !!this.props.headerText;
        const textContent = this.props.textContent;

        const classNames = css(styles.assessmentInstanceLabel, this.props.customClassName);

        return (
            <div>
                {showLabel ? (
                    <div className={classNames} style={{ background: this.props.background }}>
                        {this.props.labelText}
                    </div>
                ) : null}
                <div>
                    <TooltipHost content={textContent} calloutProps={{ gapSpace: 0 }}>
                        <div className={styles.allContent}>
                            {showHeader ? (
                                <strong className={styles.instanceHeader}>
                                    {this.props.headerText}{' '}
                                </strong>
                            ) : null}
                            <div
                                className={styles.assessmentInstanceTextContent}
                                data-automation-id={instanceTableTextContentAutomationId}
                            >
                                {textContent}
                            </div>
                        </div>
                    </TooltipHost>
                </div>
            </div>
        );
    }
}
