// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedSFC } from '../../common/react/named-sfc';
import { FixInstructionProcessor } from '../fix-instruction-processor';
import { CheckType } from './details-dialog';

export interface FixInstructionPanelDeps {
    fixInstructionProcessor: FixInstructionProcessor;
}

export interface FixInstructionPanelProps {
    deps: FixInstructionPanelDeps;
    checkType: CheckType;
    checks: { message: string }[];
    renderTitleElement: (titleText: string, className: string) => JSX.Element;
}

export const FixInstructionPanel = NamedSFC<FixInstructionPanelProps>('FixInstructionPanel', props => {
    const { fixInstructionProcessor } = props.deps;

    const getPanelTitle = (checkType: CheckType, checkCount: number): string => {
        if (checkCount === 1) {
            return 'Fix the following:';
        }
        if (checkType === CheckType.Any) {
            return 'Fix ONE of the following:';
        } else {
            return 'Fix ALL of the following:';
        }
    };

    const renderInstructions = (checkType: CheckType): JSX.Element[] => {
        const instructionList = props.checks.map((check, checkIndex) => {
            return <li key={`instruction-${CheckType[checkType]}-${checkIndex + 1}`}>{fixInstructionProcessor.process(check.message)}</li>;
        });

        return instructionList;
    };

    if (props.checks.length === 0) {
        return null;
    }

    const title: string = getPanelTitle(props.checkType, props.checks.length);

    return (
        <div>
            {props.renderTitleElement(title, 'insights-fix-instruction-title')}
            <ul className="insights-fix-instruction-list">{renderInstructions(props.checkType)}</ul>
        </div>
    );
});
