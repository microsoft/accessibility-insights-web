// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { CheckType } from '../../../../injected/components/details-dialog';
import { FixInstructionPanel, IFixInstructionPanelProps } from '../../../../injected/components/fix-instruction-panel';
import { ShallowRenderer } from '../../../Common/shallow-renderer';

describe('FixInstructionPanelTests', () => {
    test('render all checks', () => {
        const allchecks: FormattedCheckResult[] = [
            {
                message: 'message',
                id: 'id1',
                data: 'data',
            },
            {
                message: 'message',
                id: 'id2',
                data: 'data',
            },
        ];

        const props: IFixInstructionPanelProps = {
            checkType: CheckType.All,
            checks: allchecks,
        };

        const testObject = new FixInstructionPanel(props);
        const expected = (
            <div>
                <div className="insights-fix-instruction-title">Fix ALL of the following:</div>
                <ul className="insights-fix-instruction-list">
                    <li key={'instruction-All-1'}>message</li>
                    <li key={'instruction-All-2'}>message</li>
                </ul>
            </div>
        );

        expect(testObject.render()).toEqual(expected);
    });

    test('render instruction only one check', () => {
        const allchecks: FormattedCheckResult[] = [
            {
                message: 'message',
                id: 'id1',
                data: 'data',
            },
        ];

        const props: IFixInstructionPanelProps = {
            checkType: CheckType.All,
            checks: allchecks,
        };

        const component = ShallowRenderer.render(FixInstructionPanel, props);
        const panelTitle = component.props.children[0];

        expect(panelTitle.props.children).toBe('Fix the following:');
    });

    test('render none checks', () => {
        const noneChecks: FormattedCheckResult[] = [
            {
                message: 'message',
                id: 'id1',
                data: 'data',
            },
            {
                message: 'message',
                id: 'id2',
                data: 'data',
            },
        ];

        const props: IFixInstructionPanelProps = {
            checkType: CheckType.None,
            checks: noneChecks,
        };

        const testObject = new FixInstructionPanel(props);
        const expected = (
            <div>
                <div className="insights-fix-instruction-title">Fix ALL of the following:</div>
                <ul className="insights-fix-instruction-list">
                    <li key={'instruction-None-1'}>message</li>
                    <li key={'instruction-None-2'}>message</li>
                </ul>
            </div>
        );

        expect(testObject.render()).toEqual(expected);
    });

    test('render nothing', () => {
        const checks: FormattedCheckResult[] = [];

        const props: IFixInstructionPanelProps = {
            checkType: CheckType.None,
            checks: checks,
        };

        const component = ShallowRenderer.render(FixInstructionPanel, props);
        expect(component).toBeNull();
    });
});
