// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    FixInstructionPanel,
    FixInstructionPanelProps,
} from 'common/components/fix-instruction-panel';
import { FixInstructionProcessor } from 'common/components/fix-instruction-processor';
import { CheckType } from 'common/types/check-type';
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, It, Mock, MockBehavior } from 'typemoq';

describe('FixInstructionPanelTests', () => {
    let fixInstructionProcessorMock: IMock<FixInstructionProcessor>;

    beforeEach(() => {
        fixInstructionProcessorMock = Mock.ofType<FixInstructionProcessor>(
            undefined,
            MockBehavior.Strict,
        );
        fixInstructionProcessorMock
            .setup(processor => processor.process(It.isAnyString()))
            .returns(instruction => <>{instruction}</>);
    });

    test('render all checks', () => {
        const allChecks: FormattedCheckResult[] = [
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
            checks: allChecks,
            renderTitleElement: renderTitleAsDiv,
            deps: {
                fixInstructionProcessor: fixInstructionProcessorMock.object,
            },
        };

        const wrapped = shallow(<FixInstructionPanel {...props} />);

        expect(wrapped.getElement()).toMatchSnapshot();
    });

    test('render instruction only one check', () => {
        const allChecks: FormattedCheckResult[] = [
            {
                message: 'message',
                id: 'id1',
                data: 'data',
            },
        ];

        const props: FixInstructionPanelProps = {
            checkType: CheckType.All,
            checks: allChecks,
            renderTitleElement: renderTitleAsDiv,
            deps: {
                fixInstructionProcessor: fixInstructionProcessorMock.object,
            },
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
            renderTitleElement: renderTitleAsDiv,
            deps: {
                fixInstructionProcessor: fixInstructionProcessorMock.object,
            },
        };

        const wrapped = shallow(<FixInstructionPanel {...props} />);

        expect(wrapped.getElement()).toMatchSnapshot();
    });

    test('render nothing', () => {
        const checks: FormattedCheckResult[] = [];

        const props: FixInstructionPanelProps = {
            checkType: CheckType.None,
            checks: checks,
            renderTitleElement: renderTitleAsDiv,
            deps: {
                fixInstructionProcessor: fixInstructionProcessorMock.object,
            },
        };

        const wrapped = shallow(<FixInstructionPanel {...props} />);

        expect(wrapped.getElement()).toMatchSnapshot();
    });

    function renderTitleAsDiv(titleText: string): JSX.Element {
        return <div>{titleText}</div>;
    }
});
