// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FixInstructionProcessor } from 'common/components/fix-instruction-processor';
import { CheckType } from 'common/types/check-type';
import * as React from 'react';
import { NamedFC } from '../react/named-fc';
import * as styles from './fix-instruction-panel.scss';

export interface FixInstructionPanelDeps {
    fixInstructionProcessor: FixInstructionProcessor;
}

export interface FixInstructionPanelProps {
    deps: FixInstructionPanelDeps;
    checkType: CheckType;
    checks: { message: string }[];
    renderTitleElement: (titleText: string) => JSX.Element;
}

export const FixInstructionPanel = NamedFC<FixInstructionPanelProps>(
    'FixInstructionPanel',
    props => {
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
                return (
                    <li key={`instruction-${CheckType[checkType]}-${checkIndex + 1}`}>
                        {fixInstructionProcessor.process(check.message)}
                    </li>
                );
            });

            return instructionList;
        };

        if (props.checks.length === 0) {
            return null;
        }

        const title: string = getPanelTitle(props.checkType, props.checks.length);

        return (
            <div>
                {props.renderTitleElement(title)}
                <ul className={styles.insightsFixInstructionList}>
                    {renderInstructions(props.checkType)}
                </ul>
            </div>
        );
    },
);
