// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { CheckType } from '../../../../../injected/components/details-dialog';
import { FixInstructionPanel, FixInstructionPanelProps } from '../../../../../injected/components/fix-instruction-panel';

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

        const props: FixInstructionPanelProps = {
            checkType: CheckType.All,
            checks: allchecks,
        };

        const wrapped = shallow(<FixInstructionPanel {...props} />);

        expect(wrapped.getElement()).toMatchSnapshot();
    });

    test('render instruction only one check', () => {
        const allchecks: FormattedCheckResult[] = [
            {
                message: 'message',
                id: 'id1',
                data: 'data',
            },
        ];

        const props: FixInstructionPanelProps = {
            checkType: CheckType.All,
            checks: allchecks,
        };

        const wrapped = shallow(<FixInstructionPanel {...props} />);

        expect(wrapped.getElement()).toMatchSnapshot();
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

        const props: FixInstructionPanelProps = {
            checkType: CheckType.None,
            checks: noneChecks,
        };

        const wrapped = shallow(<FixInstructionPanel {...props} />);

        expect(wrapped.getElement()).toMatchSnapshot();
    });

    test('render nothing', () => {
        const checks: FormattedCheckResult[] = [];

        const props: FixInstructionPanelProps = {
            checkType: CheckType.None,
            checks: checks,
        };

        const wrapped = shallow(<FixInstructionPanel {...props} />);

        expect(wrapped.getElement()).toMatchSnapshot();
    });
});
