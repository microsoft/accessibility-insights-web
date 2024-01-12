// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DetailsList, IColumn } from '@fluentui/react';
import { fireEvent, render, screen } from '@testing-library/react';
import {
    AssessmentDefaultMessageGenerator,
    DefaultMessageInterface,
    IGetMessageGenerator,
    IMessageGenerator,
} from 'assessments/assessment-default-message-generator';
import { InstanceTableRow } from 'assessments/types/instance-table-data';
import { ManualTestStatus } from 'common/types/store-data/manual-test-status';

import * as React from 'react';
import { getAutomationIdSelector } from 'tests/common/get-automation-id-selector';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';
import {
    AssessmentResultType,
    GeneratedAssessmentInstance,
} from '../../../../../common/types/store-data/assessment-result-data';
import {
    AssessmentInstanceTable,
    AssessmentInstanceTableProps,
    passUnmarkedInstancesButtonAutomationId,
} from '../../../../../DetailsView/components/assessment-instance-table';
import { AssessmentInstanceTableHandler } from '../../../../../DetailsView/handlers/assessment-instance-table-handler';
import { DictionaryStringTo } from '../../../../../types/common-types';

describe('AssessmentInstanceTable', () => {
    let getDefaultMessageStub: IGetMessageGenerator;
    let getDefaultMessageMock: IMock<IGetMessageGenerator>;
    let assessmentDefaultMessageGeneratorMock: IMock<AssessmentDefaultMessageGenerator>;
    let generatorStub: IMessageGenerator;
    let generatorMock: IMock<IMessageGenerator>;
    let defaultMessage: DefaultMessageInterface;
    let assessmentInstanceTableHandlerMock: IMock<AssessmentInstanceTableHandler>;
    const selectedTestStep = 'step';

    beforeEach(() => {
        getDefaultMessageStub = generator => (map, step) => null;
        getDefaultMessageMock = Mock.ofInstance(getDefaultMessageStub);

        assessmentDefaultMessageGeneratorMock = Mock.ofType<AssessmentDefaultMessageGenerator>(
            AssessmentDefaultMessageGenerator,
            MockBehavior.Strict,
        );
        generatorStub = (instances, step) => null;
        generatorMock = Mock.ofInstance(generatorStub);

        defaultMessage = {} as DefaultMessageInterface;

        assessmentInstanceTableHandlerMock = Mock.ofType(AssessmentInstanceTableHandler);

        getDefaultMessageMock
            .setup(gdm => gdm(assessmentDefaultMessageGeneratorMock.object))
            .returns(() => generatorMock.object)
            .verifiable();

        generatorMock
            .setup(gm => gm(It.isAny(), selectedTestStep))
            .returns(() => defaultMessage)
            .verifiable();
    });

    describe('with null instance data', () => {
        it('renders a spinner per snapshot', () => {
            const props: AssessmentInstanceTableProps = getProps(
                null,
                assessmentInstanceTableHandlerMock.object,
                assessmentDefaultMessageGeneratorMock.object,
                getDefaultMessageMock.object,
            );

            const testSubject = render(<AssessmentInstanceTable {...props} />);
            expect(testSubject.asFragment()).toMatchSnapshot();
        });
    });

    describe('with instances', () => {
        let props: AssessmentInstanceTableProps;
        let testStepResults: AssessmentResultType<{}>;

        beforeEach(() => {
            testStepResults = {
                [selectedTestStep]: { status: ManualTestStatus.UNKNOWN },
            };

            defaultMessage = null;

            props = getProps(
                {},
                assessmentInstanceTableHandlerMock.object,
                assessmentDefaultMessageGeneratorMock.object,
                getDefaultMessageMock.object,
            );
            const items: InstanceTableRow[] = [
                {
                    key: 'items[0]',
                    statusChoiceGroup: null,
                    visualizationButton: null,
                    instance: { testStepResults } as GeneratedAssessmentInstance,
                },
            ];
            const cols: IColumn[] = [
                {
                    key: 'col1',
                    name: 'col1',
                    fieldName: 'fieldName',
                    minWidth: 0,
                },
            ];

            assessmentInstanceTableHandlerMock
                .setup(a =>
                    a.createAssessmentInstanceTableItems(
                        props.instancesMap,
                        props.assessmentNavState,
                        props.hasVisualHelper,
                    ),
                )
                .returns(() => items)
                .verifiable(Times.once());

            assessmentInstanceTableHandlerMock
                .setup(a =>
                    a.getColumnConfigs(
                        props.instancesMap,
                        props.assessmentNavState,
                        props.hasVisualHelper,
                    ),
                )
                .returns(() => cols)
                .verifiable(Times.once());
        });

        it('renders per snapshot', () => {
            const testSubject = render(<AssessmentInstanceTable {...props} />);
            expect(testSubject.asFragment()).toMatchSnapshot();
        });

        it('renders per snapshot with "none" header type', () => {
            const testSubject = render(
                <AssessmentInstanceTable {...props} instanceTableHeaderType={'none'} />,
            );
            expect(testSubject.asFragment()).toMatchSnapshot();
        });

        it('prefers rendering with getDefaultMessage if non-null', () => {
            defaultMessage = {
                message: <>Message from getDefaultMessage</>,
                instanceCount: 1,
            } as DefaultMessageInterface;

            render(<AssessmentInstanceTable {...props} />);
            const hasMessage = screen.queryAllByText('Message from getDefaultMessage')
            expect(hasMessage).toBeDefined();

            getDefaultMessageMock.verifyAll();
        });

        it("delegates the underlying list's onItemInvoked to the handler's updateFocusedTarget", async () => {
            const fakeItem = { instance: { target: ['fake-instance-target-0'] } };

            const renderRow = jest.fn();
            const onItemInvoked = jest.fn();

            const result = render(<AssessmentInstanceTable {...props} />);
            const rowClick = result.container.querySelectorAll('.ms-DetailsRow');

            fireEvent.dblClick(rowClick[0], fakeItem)
            fireEvent.click(rowClick[0], fakeItem)
            expect(renderRow).toBeDefined();
            expect(onItemInvoked).toBeDefined()


        });

        describe('"Pass all unmarked instances" button', () => {
            const passUnmarkedInstancesButtonSelector = `button${getAutomationIdSelector(
                passUnmarkedInstancesButtonAutomationId,
            )}`;
            it('is enabled if there is an instance with unknown status', () => {
                testStepResults[selectedTestStep] = { status: ManualTestStatus.UNKNOWN };

                const testSubject = render(<AssessmentInstanceTable {...props} />);
                const getUnmarkedSelector = testSubject.container.querySelectorAll(passUnmarkedInstancesButtonSelector)

                expect(getUnmarkedSelector).not.toHaveProperty('disabled');
            });

            it.each([ManualTestStatus.FAIL, ManualTestStatus.PASS])(
                'is disabled if all instances are in non-UNKNOWN status %p',

                testStatus => {
                    testStepResults[selectedTestStep] = { status: testStatus };

                    const testSubject = render(<AssessmentInstanceTable {...props} />);
                    const getUnmarkedSelector = testSubject.container.querySelectorAll(passUnmarkedInstancesButtonSelector)

                    expect(getUnmarkedSelector[0]).toHaveProperty('disabled', true);
                },
            );

            it("delegates the button action to the handler's passUnmarkedInstances", () => {
                assessmentInstanceTableHandlerMock
                    .setup(a =>
                        a.passUnmarkedInstances(
                            props.assessmentNavState.selectedTestType,
                            props.assessmentNavState.selectedTestSubview,
                        ),
                    )
                    .verifiable(Times.once());

                const testSubject = render(<AssessmentInstanceTable {...props} />);
                const buttonSelector = testSubject.container.querySelector(passUnmarkedInstancesButtonSelector)
                fireEvent.click(buttonSelector)
                assessmentInstanceTableHandlerMock.verifyAll();
            });
        });
    });

    function getProps(
        instancesMap: DictionaryStringTo<GeneratedAssessmentInstance>,
        assessmentInstanceTableHandler: AssessmentInstanceTableHandler,
        defaultMessageGeneratorMock: AssessmentDefaultMessageGenerator,
        defaultMessageMock: IGetMessageGenerator,
    ): AssessmentInstanceTableProps {
        return {
            instancesMap: instancesMap,
            columnConfiguration: [],
            assessmentNavState: {
                selectedTestSubview: selectedTestStep,
                selectedTestType: 1,
            },
            assessmentInstanceTableHandler: assessmentInstanceTableHandler,
            getDefaultMessage: defaultMessageMock,
            assessmentDefaultMessageGenerator: defaultMessageGeneratorMock,
            instanceTableHeaderType: 'default',
            hasVisualHelper: true,
        };
    }
});
