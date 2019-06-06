// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { CheckType } from './details-dialog';

export interface FixInstructionPanelProps {
    checkType: CheckType;
    checks: FormattedCheckResult[];
    renderTitleElement: (titleText: string, className: string) => JSX.Element;
}

export class FixInstructionPanel extends React.Component<FixInstructionPanelProps, any> {
    public render(): JSX.Element {
        if (this.props.checks.length === 0) {
            return null;
        }
        const title: string = this.getPanelTitle(this.props.checkType, this.props.checks.length);

        return (
            <div>
                {this.props.renderTitleElement(title, 'insights-fix-instruction-title')}
                <ul className="insights-fix-instruction-list">{this.renderInstructions(this.props.checkType)}</ul>
            </div>
        );
    }

    private getPanelTitle(checkType: CheckType, checkCount: number): string {
        if (checkCount === 1) {
            return 'Fix the following:';
        }
        if (checkType === CheckType.Any) {
            return 'Fix ONE of the following:';
        } else {
            return 'Fix ALL of the following:';
        }
    }

    private renderInstructions(checkType: CheckType): JSX.Element[] {
        const instructionList = this.props.checks.map((check, checkIndex) => {
            return <li key={`instruction-${CheckType[checkType]}-${checkIndex + 1}`}>{check.message}</li>;
        });
        return instructionList;
    }
}
