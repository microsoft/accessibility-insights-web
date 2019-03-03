// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { autobind } from '@uifabric/utilities';
import { CheckType } from './details-dialog';
import { Label } from 'office-ui-fabric-react/lib/Label';

export interface FixInstructionPanelProps {
    checkType: CheckType;
    checks: FormattedCheckResult[];
}

export class FixInstructionPanel extends React.Component<FixInstructionPanelProps, any> {
    public render(): JSX.Element {
        if (this.props.checks.length === 0) {
            return null;
        }
        const title: string = this.getPanelTitle(this.props.checkType, this.props.checks.length);

        return (
            <div>
                <div className="insights-fix-instruction-title">{title}</div>
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
