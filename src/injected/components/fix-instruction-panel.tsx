// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';
import { Label } from 'office-ui-fabric-react/lib/Label';
import * as React from 'react';
import { CheckType } from './details-dialog';

export interface IFixInstructionPanelProps {
    checkType: CheckType;
    checks: FormattedCheckResult[];
}

export class FixInstructionPanel extends React.Component<IFixInstructionPanelProps, any> {
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
