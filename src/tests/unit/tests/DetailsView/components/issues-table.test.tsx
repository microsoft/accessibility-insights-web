// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import { ISelection, Selection } from 'office-ui-fabric-react/lib/DetailsList';
import * as React from 'react';
import { It, Mock, Times } from 'typemoq';

import { VisualizationConfigurationFactory } from '../../../../../common/configs/visualization-configuration-factory';
import { UserConfigurationStoreData } from '../../../../../common/types/store-data/user-configuration-store';
import { DetailsViewActionMessageCreator } from '../../../../../DetailsView/actions/details-view-action-message-creator';
import { IssuesTable, IssuesTableDeps, IssuesTableProps, IssuesTableState } from '../../../../../DetailsView/components/issues-table';
import { DetailsRowData, IssuesTableHandler } from '../../../../../DetailsView/components/issues-table-handler';
import { ReportGenerator } from '../../../../../DetailsView/reports/report-generator';
import { ReportGeneratorProvider } from '../../../../../DetailsView/reports/report-generator-provider';
import { DecoratedAxeNodeResult } from '../../../../../injected/scanner-utils';
import { RuleResult } from '../../../../../scanner/iruleresults';
import { DictionaryStringTo } from '../../../../../types/common-types';

describe('IssuesTableTest', () => {
    describe('render', () => {
        it('spinner, issuesEnabled == null', () => {
            const props = new TestPropsBuilder().build();

            const wrapped = shallow(<IssuesTable {...props} />);

            expect(wrapped.debug()).toMatchSnapshot();
        });

        it('includes subtitle if specified', () => {
            const props = new TestPropsBuilder().setSubtitle(<>test subtitle text</>).build();

            const wrapped = shallow(<IssuesTable {...props} />);

            expect(wrapped.debug()).toMatchSnapshot();
        });

        it('automated checks disabled', () => {
            const issuesEnabled = false;
            const selectionMock = Mock.ofType<ISelection>(Selection);

            const toggleClickHandlerMock = Mock.ofInstance(event => {});

            const props = new TestPropsBuilder()
                .setIssuesEnabled(issuesEnabled)
                .setIssuesSelection(selectionMock.object)
                .setToggleClickHandler(toggleClickHandlerMock.object)
                .build();

            const wrapped = shallow(<IssuesTable {...props} />);

            expect(wrapped.getElement()).toMatchSnapshot();
        });

        it('spinner for scanning state', () => {
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

        describe('table', () => {
            const issuesCount = [0, 1, 2];

            it.each(issuesCount)('with %s issues', count => {
                const sampleViolations: RuleResult[] = getSampleViolations(count);
                const sampleIdToRuleResultMap: DictionaryStringTo<DecoratedAxeNodeResult> = {};
                const items: DetailsRowData[] = [];
                for (let i: number = 1; i <= count; i++) {
                    sampleIdToRuleResultMap['id' + i] = {} as DecoratedAxeNodeResult;
                    items.push({} as DetailsRowData);
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
                    .build();

                const wrapped = shallow(<IssuesTable {...props} />);

                expect(wrapped.debug()).toMatchSnapshot();
            });
        });

        it('spinner, issuesEnabled is an empty object', () => {
            const props = new TestPropsBuilder().setIssuesEnabled({} as any).build();

            const wrapper = shallow(<IssuesTable {...props} />);

            expect(wrapper.getElement()).toMatchSnapshot();
        });
    });

    describe('user interaction', () => {
        it('handles click on export result button', () => {
            const stateDiff = {
                isExportDialogOpen: true,
                exportDescription: '',
                exportName: 'generateName',
                exportDataWithPlaceholder: 'generateHtml',
                exportData: 'generateHtml',
            };
            const eventStub = {};

            const reportGeneratorMock = Mock.ofType<ReportGenerator>();
            reportGeneratorMock
                .setup(builder => builder.generateName(It.isAnyString(), It.isAny(), It.isAnyString()))
                .returns(() => 'generateName')
                .verifiable();
            reportGeneratorMock
                .setup(builder => builder.generateHtml(It.isAny(), It.isAny(), It.isAnyString(), It.isAnyString(), It.isAnyString()))
                .returns(() => 'generateHtml')
                .verifiable();

            const reportGeneratorProviderMock = Mock.ofType<ReportGeneratorProvider>();
            reportGeneratorProviderMock.setup(provider => provider.getGenerator()).returns(() => reportGeneratorMock.object);

            testStateChangedByHandlerCalledWithParam(
                'onExportButtonClick',
                eventStub,
                stateDiff,
                Times.once(),
                reportGeneratorProviderMock.object,
            );
            reportGeneratorMock.verifyAll();
        });

        it('handles close the dialog: blocked', () => {
            const stateDiff = {};
            const eventStub = {
                target: {} as HTMLDivElement,
            };
            testStateChangedByHandlerCalledWithParam('onDismissExportDialog', eventStub, stateDiff, Times.never());
        });

        it('hanldes close the dialog: exit', () => {
            const stateDiff = { isExportDialogOpen: false };
            const eventStub = {
                target: {} as HTMLButtonElement,
            };
            testStateChangedByHandlerCalledWithParam('onDismissExportDialog', eventStub, stateDiff);
        });

        it('handles changes on the export dialog description text', () => {
            const text = 'text';
            const stateDiff = { exportDescription: text, exportData: '' };
            testStateChangedByHandlerCalledWithParam('onExportDescriptionChange', text, stateDiff);
        });
    });

    function testStateChangedByHandlerCalledWithParam(
        handlerName: string,
        param: any,
        stateDiff: any,
        times: Times = Times.once(),
        reportGeneratorProvider: ReportGeneratorProvider = undefined,
        actionMessageCreator: DetailsViewActionMessageCreator = null,
        beforeState: IssuesTableState = getDefaultState(),
    ): void {
        const initialState: IssuesTableState = getDefaultState();

        const props = new TestPropsBuilder()
            .setIssuesEnabled(true)
            .setViolations(getSampleViolations(2))
            .setDeps({
                detailsViewActionMessageCreator: actionMessageCreator,
                reportGeneratorProvider,
            } as IssuesTableDeps)
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
    private subtitle?: JSX.Element;
    private issuesTableHandler: IssuesTableHandler;
    private issuesEnabled: boolean;
    private violations: RuleResult[];
    private issuesSelection: ISelection;
    private scanning: boolean = false;
    private clickHandler: (event) => void;
    private featureFlags = {};
    private deps: IssuesTableDeps;

    public setDeps(deps: IssuesTableDeps): TestPropsBuilder {
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

    public setIssuesTableHandler(issuesTableHandler: IssuesTableHandler): TestPropsBuilder {
        this.issuesTableHandler = issuesTableHandler;
        return this;
    }

    public setFeatureFlag(name: string, value: boolean): TestPropsBuilder {
        this.featureFlags[name] = value;
        return this;
    }

    public setSubtitle(subtitle?: JSX.Element): TestPropsBuilder {
        this.subtitle = subtitle;
        return this;
    }

    public build(): IssuesTableProps {
        return {
            deps: this.deps,
            title: this.title,
            subtitle: this.subtitle,
            issuesTableHandler: this.issuesTableHandler,
            issuesEnabled: this.issuesEnabled,
            issuesSelection: this.issuesSelection,
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
            userConfigurationStoreData: {
                bugService: 'gitHub',
            } as UserConfigurationStoreData,
        };
    }
}
