// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, It, Mock, MockBehavior } from 'typemoq';
import { CheckType } from '../../../../../injected/components/details-dialog';
import {
    FixInstructionPanel,
    FixInstructionPanelProps,
} from '../../../../../injected/components/fix-instruction-panel';
import { FixInstructionProcessor } from '../../../../../injected/fix-instruction-processor';

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
            renderTitleElement: renderTitleAsDiv,
            deps: {
                fixInstructionProcessor: fixInstructionProcessorMock.object,
            },
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

    function renderTitleAsDiv(
        titleText: string,
        className: string,
    ): JSX.Element {
        return <div className={className}>{titleText}</div>;
    }
});
