// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ActionButton } from 'office-ui-fabric-react/lib/Button';
import { CheckboxVisibility, ConstrainMode, DetailsList, IColumn } from 'office-ui-fabric-react/lib/DetailsList';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import * as React from 'react';
import { Mock, MockBehavior, Times } from 'typemoq';

import {
    AssessmentDefaultMessageGenerator,
    DefaultMessageInterface,
    IGetMessageGenerator,
    IMessageGenerator,
} from '../../../../../assessments/assessment-default-message-generator';
import { ManualTestStatus } from '../../../../../common/types/manual-test-status';
import { IAssessmentResultType, IGeneratedAssessmentInstance } from '../../../../../common/types/store-data/iassessment-result-data';
import {
    AssessmentInstanceTable,
    AssessmentInstanceTableProps,
    IAssessmentInstanceRowData,
} from '../../../../../DetailsView/components/assessment-instance-table';
import { AssessmentInstanceTableHandler } from '../../../../../DetailsView/handlers/assessment-instance-table-handler';

describe('AssessmentInstanceTableTest', () => {
    let getDefaultMessageStub: IGetMessageGenerator;
    let getDefaultMessageMock;
    let assessmentDefaultMessageGeneratorMock;
    let generatorStub: IMessageGenerator;
    let generatorMock;
    let expectedMessage: DefaultMessageInterface;

    beforeEach(() => {
        getDefaultMessageStub = generator => (map, step) => null;
        getDefaultMessageMock = Mock.ofInstance(getDefaultMessageStub);

        assessmentDefaultMessageGeneratorMock = Mock.ofType<AssessmentDefaultMessageGenerator>(
            AssessmentDefaultMessageGenerator,
            MockBehavior.Strict,
        );
        generatorStub = (instances, step) => null;
        generatorMock = Mock.ofInstance(generatorStub);

        expectedMessage = {} as DefaultMessageInterface;

        getDefaultMessageMock
            .setup(gdm => gdm(assessmentDefaultMessageGeneratorMock.object))
            .returns(() => generatorMock.object)
            .verifiable();

        generatorMock
            .setup(gm => gm({}, 'step'))
            .returns(() => expectedMessage)
            .verifiable();
    });

    it('render spinner', () => {
        const assessmentInstanceTableHandlerMock = Mock.ofType(AssessmentInstanceTableHandler);

        const props: AssessmentInstanceTableProps = getProps(
            null,
            assessmentInstanceTableHandlerMock.object,
            assessmentDefaultMessageGeneratorMock.object,
            getDefaultMessageMock.object,
        );
        const items: IAssessmentInstanceRowData[] = [
            {
                statusChoiceGroup: null,
                visualizationButton: null,
                instance: {} as IGeneratedAssessmentInstance,
            },
        ];
        const testObject = new AssessmentInstanceTable(props);
        const expected = <Spinner className="details-view-spinner" size={SpinnerSize.large} label={'Scanning'} />;
        expect(testObject.render()).toEqual(expected);
    });

    it('render', () => {
        const assessmentInstanceTableHandlerMock = Mock.ofType(AssessmentInstanceTableHandler);
        expectedMessage = null;

        const props: AssessmentInstanceTableProps = getProps(
            {},
            assessmentInstanceTableHandlerMock.object,
            assessmentDefaultMessageGeneratorMock.object,
            getDefaultMessageMock.object,
        );
        const items: IAssessmentInstanceRowData[] = [
            {
                statusChoiceGroup: null,
                visualizationButton: null,
                instance: {} as IGeneratedAssessmentInstance,
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
            .setup(a => a.createAssessmentInstanceTableItems(props.instancesMap, props.assessmentNavState, props.hasVisualHelper))
            .returns(() => items)
            .verifiable(Times.once());

        assessmentInstanceTableHandlerMock
            .setup(a => a.getColumnConfigs(props.instancesMap, props.assessmentNavState, props.hasVisualHelper))
            .returns(() => cols)
            .verifiable(Times.once());

        const testObject = new TestableAssessmentInstanceTable(props);

        const expected = (
            <div>
                <ActionButton iconProps={{ iconName: 'skypeCheck' }} onClick={testObject.getOnPassUnmarkedInstances()} disabled={true}>
                    Pass unmarked instances
                </ActionButton>
                <DetailsList
                    ariaLabelForGrid="Use arrow keys to navigate inside the instances grid"
                    items={items}
                    columns={cols}
                    checkboxVisibility={CheckboxVisibility.hidden}
                    constrainMode={ConstrainMode.horizontalConstrained}
                    onRenderRow={testObject.renderRow}
                    onItemInvoked={testObject.onItemInvoked}
                />
            </div>
        );

        const actualObj = testObject.render();

        assessmentInstanceTableHandlerMock.verifyAll();
        getDefaultMessageMock.verifyAll();
        expect(actualObj).toEqual(expected);
    });

    it('renders with empty header', () => {
        const assessmentInstanceTableHandlerMock = Mock.ofType(AssessmentInstanceTableHandler, MockBehavior.Strict);
        expectedMessage = null;

        const props: AssessmentInstanceTableProps = getProps(
            {},
            assessmentInstanceTableHandlerMock.object,
            assessmentDefaultMessageGeneratorMock.object,
            getDefaultMessageMock.object,
        );
        props.renderInstanceTableHeader = () => null;
        const items: IAssessmentInstanceRowData[] = [
            {
                statusChoiceGroup: null,
                visualizationButton: null,
                instance: {} as IGeneratedAssessmentInstance,
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
            .setup(a => a.createAssessmentInstanceTableItems(props.instancesMap, props.assessmentNavState, props.hasVisualHelper))
            .returns(() => items)
            .verifiable(Times.once());

        assessmentInstanceTableHandlerMock
            .setup(a => a.getColumnConfigs(props.instancesMap, props.assessmentNavState, props.hasVisualHelper))
            .returns(() => cols)
            .verifiable(Times.once());

        const testObject = new TestableAssessmentInstanceTable(props);

        const expected = (
            <div>
                {null}
                <DetailsList
                    ariaLabelForGrid="Use arrow keys to navigate inside the instances grid"
                    items={items}
                    columns={cols}
                    checkboxVisibility={CheckboxVisibility.hidden}
                    constrainMode={ConstrainMode.horizontalConstrained}
                    onRenderRow={testObject.renderRow}
                    onItemInvoked={testObject.onItemInvoked}
                />
            </div>
        );

        expect(testObject.render()).toEqual(expected);
        assessmentInstanceTableHandlerMock.verifyAll();
        assessmentDefaultMessageGeneratorMock.verifyAll();
        getDefaultMessageMock.verifyAll();
    });

    it('renders default instance table header enabled', () => {
        const selectedTestStep = 'step';
        const testStepResults = {} as IAssessmentResultType<{}>;
        testStepResults[selectedTestStep] = { status: ManualTestStatus.UNKNOWN };
        const props = getProps({}, null, null, null);
        const testObject = new AssessmentInstanceTable(props);
        const items: IAssessmentInstanceRowData[] = [
            {
                statusChoiceGroup: null,
                visualizationButton: null,
                instance: { testStepResults } as IGeneratedAssessmentInstance,
            },
        ];

        const actual = testObject.renderDefaultInstanceTableHeader(items);

        expect(actual).toMatchSnapshot();
    });

    it('renders default instance table header disabled with instance', () => {
        const selectedTestStep = 'step';
        const testStepResults = {} as IAssessmentResultType<{}>;
        testStepResults[selectedTestStep] = { status: ManualTestStatus.PASS };
        const props = getProps({}, null, null, null);
        const testObject = new AssessmentInstanceTable(props);
        const items: IAssessmentInstanceRowData[] = [
            {
                statusChoiceGroup: null,
                visualizationButton: null,
                instance: { testStepResults } as IGeneratedAssessmentInstance,
            },
        ];

        const actual = testObject.renderDefaultInstanceTableHeader(items);

        expect(actual).toMatchSnapshot();
    });

    it('renders default instance table header disabled without instance', () => {
        const props = getProps({}, null, null, null);
        const testObject = new AssessmentInstanceTable(props);
        const items: IAssessmentInstanceRowData[] = [];

        const actual = testObject.renderDefaultInstanceTableHeader(items);

        expect(actual).toMatchSnapshot();
    });

    it('onItemInvoked, updateFocusedTarget', () => {
        const assessmentInstanceTableHandlerMock = Mock.ofType(AssessmentInstanceTableHandler);

        const props: AssessmentInstanceTableProps = getProps(
            {},
            assessmentInstanceTableHandlerMock.object,
            assessmentDefaultMessageGeneratorMock.object,
            getDefaultMessageMock.object,
        );

        const items: IAssessmentInstanceRowData[] = [
            {
                statusChoiceGroup: null,
                visualizationButton: null,
                instance: {
                    target: ['target'],
                } as IGeneratedAssessmentInstance,
            },
        ];

        assessmentInstanceTableHandlerMock.setup(a => a.updateFocusedTarget(items[0].instance.target)).verifiable(Times.once());

        const testObject = new TestableAssessmentInstanceTable(props);
        testObject.onItemInvoked(items[0]);

        assessmentInstanceTableHandlerMock.verifyAll();
    });

    it('passUnmarkedInstances', () => {
        const assessmentInstanceTableHandlerMock = Mock.ofType(AssessmentInstanceTableHandler);

        const props: AssessmentInstanceTableProps = getProps(
            {},
            assessmentInstanceTableHandlerMock.object,
            assessmentDefaultMessageGeneratorMock.object,
            getDefaultMessageMock.object,
        );

        assessmentInstanceTableHandlerMock
            .setup(a => a.passUnmarkedInstances(props.assessmentNavState.selectedTestType, props.assessmentNavState.selectedTestStep))
            .verifiable(Times.once());

        const items: IAssessmentInstanceRowData[] = [
            {
                statusChoiceGroup: null,
                visualizationButton: null,
                instance: {} as IGeneratedAssessmentInstance,
            },
        ];
        const testObject = new TestableAssessmentInstanceTable(props);
        testObject.getOnPassUnmarkedInstances()();

        assessmentInstanceTableHandlerMock.verifyAll();
    });

    it('if the function returns no failing instances message when there are instances but no failing ones', () => {
        const assessmentInstanceTableHandlerMock = Mock.ofType(AssessmentInstanceTableHandler);
        const instancesMap: IDictionaryStringTo<IGeneratedAssessmentInstance> = {
            selector1: {
                target: ['target1'],
                html: 'html',
                testStepResults: {
                    step: {
                        status: ManualTestStatus.PASS,
                        originalStatus: 2,
                        isVisualizationEnabled: false,
                        isVisible: false,
                    },
                },
            },
            selector2: {
                target: ['target2'],
                html: 'html',
                testStepResults: {
                    step1: {
                        status: ManualTestStatus.PASS,
                        isVisualizationEnabled: false,
                        isVisible: false,
                    },
                },
            },
        };
        expectedMessage = {
            message: <div className="no-failure-view">No failing instances</div>,
            instanceCount: 1,
        } as DefaultMessageInterface;

        generatorMock
            .setup(gm => gm(instancesMap, 'step'))
            .returns(() => expectedMessage)
            .verifiable();

        const props: AssessmentInstanceTableProps = getProps(
            instancesMap,
            assessmentInstanceTableHandlerMock.object,
            assessmentDefaultMessageGeneratorMock.object,
            getDefaultMessageMock.object,
        );

        const testObject = new TestableAssessmentInstanceTable(props);
        expect(testObject.render()).toEqual(expectedMessage.message);
        getDefaultMessageMock.verifyAll();
    });

    function getProps(
        instancesMap: IDictionaryStringTo<IGeneratedAssessmentInstance>,
        assessmentInstanceTableHandler: AssessmentInstanceTableHandler,
        defaultMessageGeneratorMock: AssessmentDefaultMessageGenerator,
        defaultMessageMock: IGetMessageGenerator,
    ): AssessmentInstanceTableProps {
        return {
            instancesMap: instancesMap,
            columnConfiguration: [],
            assessmentNavState: {
                selectedTestStep: 'step',
                selectedTestType: 1,
            },
            assessmentInstanceTableHandler: assessmentInstanceTableHandler,
            getDefaultMessage: defaultMessageMock,
            assessmentDefaultMessageGenerator: defaultMessageGeneratorMock,
            renderInstanceTableHeader: (table: AssessmentInstanceTable, items: IAssessmentInstanceRowData[]) =>
                table.renderDefaultInstanceTableHeader(items),
            hasVisualHelper: true,
        };
    }
});

class TestableAssessmentInstanceTable extends AssessmentInstanceTable {
    public getOnPassUnmarkedInstances() {
        return this.onPassUnmarkedInstances;
    }
}
