// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    AssessmentDefaultMessageGenerator,
    DefaultMessageInterface,
    IGetMessageGenerator,
    IMessageGenerator,
} from 'assessments/assessment-default-message-generator';
import { InstanceTableRow } from 'assessments/types/instance-table-data';
import { mount, shallow } from 'enzyme';
import { DetailsList, IColumn } from 'office-ui-fabric-react';
import * as React from 'react';
import { getAutomationIdSelector } from 'tests/common/get-automation-id-selector';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';
import { ManualTestStatus } from '../../../../../common/types/manual-test-status';
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

            const testSubject = shallow(<AssessmentInstanceTable {...props} />);
            expect(testSubject.getElement()).toMatchSnapshot();
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
            const testSubject = shallow(<AssessmentInstanceTable {...props} />);
            expect(testSubject.getElement()).toMatchSnapshot();
        });

        it('renders per snapshot with "none" header type', () => {
            const testSubject = shallow(
                <AssessmentInstanceTable {...props} instanceTableHeaderType={'none'} />,
            );
            expect(testSubject.getElement()).toMatchSnapshot();
        });

        it('prefers rendering with getDefaultMessage if non-null', () => {
            defaultMessage = {
                message: <>Message from getDefaultMessage</>,
                instanceCount: 1,
            } as DefaultMessageInterface;

            const testSubject = shallow(<AssessmentInstanceTable {...props} />);
            expect(testSubject.getElement()).toEqual(defaultMessage.message);

            getDefaultMessageMock.verifyAll();
        });

        it("delegates the underlying list's onItemInvoked to the handler's updateFocusedTarget", () => {
            const fakeItem = { instance: { target: ['fake-instance-target-0'] } };
            assessmentInstanceTableHandlerMock
                .setup(a => a.updateFocusedTarget(fakeItem.instance.target))
                .verifiable(Times.once());

            const testSubject = mount(<AssessmentInstanceTable {...props} />);
            testSubject.find(DetailsList).prop('onItemInvoked')(fakeItem);

            assessmentInstanceTableHandlerMock.verifyAll();
        });

        describe('"Pass all unmarked instances" button', () => {
            const passUnmarkedInstancesButtonSelector = `button${getAutomationIdSelector(
                passUnmarkedInstancesButtonAutomationId,
            )}`;
            it('is enabled if there is an instance with unknown status', () => {
                testStepResults[selectedTestStep] = { status: ManualTestStatus.UNKNOWN };

                const testSubject = mount(<AssessmentInstanceTable {...props} />);
                expect(
                    testSubject.find(passUnmarkedInstancesButtonSelector).prop('disabled'),
                ).toBeUndefined();
            });

            it.each([ManualTestStatus.FAIL, ManualTestStatus.PASS])(
                'is disabled if all instances are in non-UNKNOWN status %p',
                testStatus => {
                    testStepResults[selectedTestStep] = { status: testStatus };

                    const testSubject = mount(<AssessmentInstanceTable {...props} />);
                    expect(
                        testSubject.find(passUnmarkedInstancesButtonSelector).prop('disabled'),
                    ).toBe(true);
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

                const testSubject = mount(<AssessmentInstanceTable {...props} />);
                testSubject.find(passUnmarkedInstancesButtonSelector).simulate('click');

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
