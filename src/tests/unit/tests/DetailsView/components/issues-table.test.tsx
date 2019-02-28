// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import { ActionButton } from 'office-ui-fabric-react/lib/Button';
import { ISelection, Selection } from 'office-ui-fabric-react/lib/DetailsList';
import { Dialog, DialogFooter, DialogType } from 'office-ui-fabric-react/lib/Dialog';
import { Link } from 'office-ui-fabric-react/lib/Link';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import * as React from 'react';
import { It, Mock, Times } from 'typemoq';

import { VisualizationToggle } from '../../../../../common/components/visualization-toggle';
import { VisualizationConfigurationFactory } from '../../../../../common/configs/visualization-configuration-factory';
import { FeatureFlags } from '../../../../../common/feature-flags';
import { DetailsViewActionMessageCreator } from '../../../../../DetailsView/actions/details-view-action-message-creator';
import { IssuesTable, IssuesTableDeps, IssuesTableProps, IssuesTableState } from '../../../../../DetailsView/components/issues-table';
import { IDetailsRowData, IssuesTableHandler } from '../../../../../DetailsView/components/issues-table-handler';
import { ReportGenerator } from '../../../../../DetailsView/reports/report-generator';
import { DecoratedAxeNodeResult } from '../../../../../injected/scanner-utils';
import { RuleResult } from '../../../../../scanner/iruleresults';
import { ShallowRenderer } from '../../../common/shallow-renderer';
import * as Markup from '../../../../../assessments/markup';

describe('IssuesTableTest', () => {
    const onExportButtonClickStub = () => {};
    const onDismissExportDialogStub = () => {};
    const onExportDescriptionChangeStub = () => {};
    const onSaveExportResultStub = () => {};

    test('render spinner, issuesEnabled == null', () => {
        const props = new TestPropsBuilder().build();

        const wrapped = shallow(<IssuesTable {...props} />);

        expect(wrapped.debug()).toMatchSnapshot();
    });

    test('render automated checks disabled', () => {
        const issuesEnabled = false;
        const selectionMock = Mock.ofType<ISelection>(Selection);

        const issuesTableHandlerMock = Mock.ofType<IssuesTableHandler>(IssuesTableHandler);
        const toggleClickHandlerMock = Mock.ofInstance(event => {});

        const props = new TestPropsBuilder()
            .setIssuesEnabled(issuesEnabled)
            .setIssuesSelection(selectionMock.object)
            .setIssuesTableHandler(issuesTableHandlerMock.object)
            .setToggleClickHandler(toggleClickHandlerMock.object)
            .build();

        const state: IssuesTableState = getDefaultState();

        const testObject = new IssuesTable(props);
        setupHandlersOnTestObject(testObject);

        const expected: JSX.Element = (
            <div className="issues-table">
                <h1>{props.title}</h1>
                <div>
                    {getCommandBarFromProps(props)}
                    {getDialogFromProps(props, state)}
                    <div className="details-disabled-message" role="alert">
                        Turn on <Markup.Term>Automated checks</Markup.Term> to see a list of failures.
                    </div>
                </div>
            </div>
        );

        expect(testObject.render()).toEqual(expected);
    });

    test('render spinner for scanning state', () => {
        const issuesEnabled = true;
        const toggleClickHandlerMock = Mock.ofInstance(event => {});

        const props = new TestPropsBuilder()
            .setIssuesEnabled(issuesEnabled)
            .setScanning(true)
            .setToggleClickHandler(toggleClickHandlerMock.object)
            .build();

        const wrapped = shallow(<IssuesTable {...props} />);

        expect(wrapped.debug()).toMatchSnapshot();
    });

    test('render table with 0 issues', () => {
        testRenderTableWithIssues(0, false);
    });

    test('render table with 1 issue', () => {
        testRenderTableWithIssues(1, false);
    });

    test('render table with 2 issues', () => {
        testRenderTableWithIssues(2, false);
    });

    test('render table with 0 issues, export FF on', () => {
        testRenderTableWithIssues(0, true);
    });

    test('render table with 1 issue, export FF on', () => {
        testRenderTableWithIssues(1, true);
    });

    test('render table with 2 issues, export FF on', () => {
        testRenderTableWithIssues(2, true);
    });

    test('render spinner, issuesEnabled.scanResult == null', () => {
        const props = new TestPropsBuilder().setIssuesEnabled({} as any).build();

        const wrapper = shallow(<IssuesTable {...props} />);

        expect(wrapper.debug());

        const component = ShallowRenderer.render(IssuesTable, props);
        expect(component).toMatchSnapshot();
    });

    test('onExportButtonClick', () => {
        const stateDiff = {
            isExportDialogOpen: true,
            exportDescription: '',
            exportName: 'generateName',
            exportDataWithPlaceholder: 'generateHtml',
            exportData: 'generateHtml',
        };
        const eventStub = {};

        const reportGeneratorMock = Mock.ofType(ReportGenerator);
        reportGeneratorMock
            .setup(builder => builder.generateName(It.isAny(), It.isAnyString()))
            .returns(() => 'generateName')
            .verifiable();
        reportGeneratorMock
            .setup(builder => builder.generateHtml(It.isAny(), It.isAny(), It.isAnyString(), It.isAnyString(), It.isAnyString()))
            .returns(() => 'generateHtml')
            .verifiable();

        testStateChangedByHandlerCalledWithParam('onExportButtonClick', eventStub, stateDiff, Times.once(), reportGeneratorMock.object);
        reportGeneratorMock.verifyAll();
    });

    test('onDismissExportDialog: blocked', () => {
        const stateDiff = {};
        const eventStub = {
            target: {} as HTMLDivElement,
        };
        testStateChangedByHandlerCalledWithParam('onDismissExportDialog', eventStub, stateDiff, Times.never());
    });

    test('onDismissExportDialog: exit', () => {
        const stateDiff = { isExportDialogOpen: false };
        const eventStub = {
            target: {} as HTMLButtonElement,
        };
        testStateChangedByHandlerCalledWithParam('onDismissExportDialog', eventStub, stateDiff);
    });

    test('onExportDescriptionChange', () => {
        const text = 'text';
        const stateDiff = { exportDescription: text, exportData: '' };
        testStateChangedByHandlerCalledWithParam('onExportDescriptionChange', text, stateDiff);
    });

    function testStateChangedByHandlerCalledWithParam(
        handlerName: string,
        param: any,
        stateDiff: any,
        times: Times = Times.once(),
        reportGenerator: ReportGenerator = undefined,
        actionMessageCreator: DetailsViewActionMessageCreator = null,
        beforeState: IssuesTableState = getDefaultState(),
    ): void {
        const initialState: IssuesTableState = getDefaultState();

        const props = new TestPropsBuilder()
            .setIssuesEnabled(true)
            .setViolations(getSampleViolations(2))
            .setReportGenerator(reportGenerator)
            .setDeps({
                detailsViewActionMessageCreator: actionMessageCreator,
                bugClickHandler: null,
                dropdownClickHandler: null,
                issueDetailsTextGenerator: null,
                windowUtils: null,
            })
            .build();
        const setStateMock = Mock.ofInstance(state => {});

        setStateMock.setup(s => s(It.isValue(stateDiff))).verifiable(times);

        const testObject = new IssuesTable(props);
        (testObject as any).setState = setStateMock.object;

        expect((testObject as any).state).toEqual(initialState);

        (testObject as any).state = beforeState;
        (testObject as any)[handlerName](param);

        setStateMock.verifyAll();
    }

    function testRenderTableWithIssues(count: number, exportResult: boolean): void {
        const sampleViolations: RuleResult[] = getSampleViolations(count);
        const sampleIdToRuleResultMap: IDictionaryStringTo<DecoratedAxeNodeResult> = {};
        const items: IDetailsRowData[] = [];
        for (let i: number = 1; i <= count; i++) {
            sampleIdToRuleResultMap['id' + i] = {} as DecoratedAxeNodeResult;
            items.push({} as IDetailsRowData);
        }

        const issuesEnabled = true;
        const issuesTableHandlerMock = Mock.ofType<IssuesTableHandler>(IssuesTableHandler);
        const selectionMock = Mock.ofType<ISelection>(Selection);
        const toggleClickHandlerMock = Mock.ofInstance(event => {});

        const props = new TestPropsBuilder()
            .setIssuesEnabled(issuesEnabled)
            .setViolations(sampleViolations)
            .setIssuesSelection(selectionMock.object)
            .setIssuesTableHandler(issuesTableHandlerMock.object)
            .setToggleClickHandler(toggleClickHandlerMock.object)
            .setFeatureFlag(FeatureFlags.exportResult, exportResult)
            .build();

        const wrapped = shallow(<IssuesTable {...props} />);

        expect(wrapped.debug()).toMatchSnapshot();
    }

    function getSampleViolations(count: number): RuleResult[] {
        if (count === 0) {
            return [];
        }

        const sampleViolations: RuleResult[] = [
            {
                id: 'rule name',
                description: 'rule description',
                help: 'rule help',
                nodes: [],
            },
        ];

        for (let i: number = 0; i < count; i++) {
            sampleViolations[0].nodes[i] = {
                any: [],
                none: [],
                all: [],
                html: '',
                target: ['#target-' + (i + 1)],
            };
        }

        return sampleViolations;
    }

    function setupHandlersOnTestObject(testObject): void {
        testObject.onExportButtonClick = onExportButtonClickStub;
        testObject.onDismissExportDialog = onDismissExportDialogStub;
        testObject.onExportDescriptionChange = onExportButtonClickStub;
        testObject.onSaveExportResult = onSaveExportResultStub;
    }

    function getCommandBarFromProps(props: IssuesTableProps): JSX.Element {
        return (
            <div className="details-view-command-bar">
                {getToggleFromProps(props)}
                {getExportButtonFromProps(props)}
            </div>
        );
    }

    function getExportButtonFromProps(props: IssuesTableProps): JSX.Element {
        const shouldShowButton = props.featureFlags[FeatureFlags.exportResult] && props.issuesEnabled && !props.scanning;
        if (shouldShowButton) {
            return (
                <ActionButton iconProps={{ iconName: 'Export' }} onClick={onExportButtonClickStub}>
                    Export result
                </ActionButton>
            );
        } else {
            return null;
        }
    }

    function getDialogFromProps(props: IssuesTableProps, state: IssuesTableState): JSX.Element {
        if (props.featureFlags[FeatureFlags.exportResult]) {
            return (
                <Dialog
                    hidden={!state.isExportDialogOpen}
                    onDismiss={onDismissExportDialogStub}
                    dialogContentProps={{
                        type: DialogType.normal,
                        title: IssuesTable.exportTextareaLabel,
                        subText: IssuesTable.exportInstructions,
                    }}
                    modalProps={{
                        isBlocking: false,
                        containerClassName: 'insights-dialog-main-override',
                    }}
                >
                    <TextField
                        multiline
                        autoFocus
                        rows={8}
                        resizable={false}
                        onChange={onExportDescriptionChangeStub}
                        value={state.exportDescription}
                        ariaLabel={IssuesTable.exportTextareaLabel}
                    />
                    <DialogFooter>
                        <Link onClick={onSaveExportResultStub} className="download-report-link" download="" href={'data:text/html,'}>
                            Export
                        </Link>
                    </DialogFooter>
                </Dialog>
            );
        } else {
            return null;
        }
    }

    function getToggleFromProps(props: IssuesTableProps): JSX.Element {
        return (
            <VisualizationToggle
                label="Show failures"
                checked={props.issuesEnabled}
                disabled={props.scanning}
                onClick={props.toggleClickHandler}
                className="automated-checks-details-view-toggle"
                visualizationName="Automated checks"
            />
        );
    }

    function getDefaultState(): IssuesTableState {
        return {
            isExportDialogOpen: false,
            exportDescription: '',
            exportName: '',
            exportDataWithPlaceholder: '',
            exportData: '',
        };
    }
});

class TestPropsBuilder {
    private title: string = 'test title';
    private issuesTableHandler: IssuesTableHandler;
    private issuesEnabled: boolean;
    private violations: RuleResult[];
    private issuesSelection: ISelection;
    private scanning: boolean = false;
    private clickHandler: (event) => void;
    private featureFlags = {};
    private reportGenerator: ReportGenerator;
    private actionMessageCreator: DetailsViewActionMessageCreator;
    private deps: IssuesTableDeps;

    public setDeps(deps: IssuesTableDeps) {
        this.deps = deps;
        return this;
    }

    public setToggleClickHandler(handler: (event) => void): TestPropsBuilder {
        this.clickHandler = handler;
        return this;
    }

    public setScanning(newValue: boolean): TestPropsBuilder {
        this.scanning = newValue;
        return this;
    }

    public setIssuesEnabled(data: boolean): TestPropsBuilder {
        this.issuesEnabled = data;
        return this;
    }

    public setViolations(data: RuleResult[]): TestPropsBuilder {
        this.violations = data;
        return this;
    }

    public setIssuesSelection(selection: ISelection): TestPropsBuilder {
        this.issuesSelection = selection;
        return this;
    }

    public setIssuesTableHandler(issuesTableHandler: IssuesTableHandler) {
        this.issuesTableHandler = issuesTableHandler;
        return this;
    }

    public setFeatureFlag(name: string, value: boolean) {
        this.featureFlags[name] = value;
        return this;
    }

    public setReportGenerator(reportGenerator: ReportGenerator) {
        this.reportGenerator = reportGenerator;
        return this;
    }

    public build(): IssuesTableProps {
        return {
            deps: this.deps,
            title: this.title,
            issuesTableHandler: this.issuesTableHandler,
            issuesEnabled: this.issuesEnabled,
            issuesSelection: this.issuesSelection,
            issueTrackerPath: 'example/example',
            pageTitle: 'pageTitle',
            pageUrl: 'http://pageUrl',
            scanning: this.scanning,
            toggleClickHandler: this.clickHandler,
            violations: this.violations,
            visualizationConfigurationFactory: new VisualizationConfigurationFactory(),
            featureFlags: this.featureFlags,
            selectedIdToRuleResultMap: {},
            scanResult: {
                violations: [],
                passes: [],
                inapplicable: [],
                incomplete: [],
                timestamp: '',
                targetPageUrl: '',
                targetPageTitle: '',
            },
            reportGenerator: this.reportGenerator,
        };
    }
}
