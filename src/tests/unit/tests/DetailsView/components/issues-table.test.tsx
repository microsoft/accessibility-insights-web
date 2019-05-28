// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import { ISelection, Selection } from 'office-ui-fabric-react/lib/DetailsList';
import * as React from 'react';
import { It, Mock, Times } from 'typemoq';

import { VisualizationConfigurationFactory } from '../../../../../common/configs/visualization-configuration-factory';
import { UserConfigurationStoreData } from '../../../../../common/types/store-data/user-configuration-store';
import { IssuesTable, IssuesTableDeps, IssuesTableProps } from '../../../../../DetailsView/components/issues-table';
import { DetailsRowData, IssuesTableHandler } from '../../../../../DetailsView/components/issues-table-handler';
import { ReportExportComponent } from '../../../../../DetailsView/components/report-export-component';
import { ReportGenerator } from '../../../../../DetailsView/reports/report-generator';
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
                const description = 'test description';
                for (let i: number = 1; i <= count; i++) {
                    sampleIdToRuleResultMap['id' + i] = {} as DecoratedAxeNodeResult;
                    items.push({} as DetailsRowData);
                }

                const issuesEnabled = true;
                const issuesTableHandlerMock = Mock.ofType<IssuesTableHandler>(IssuesTableHandler);
                const selectionMock = Mock.ofType<ISelection>(Selection);
                const toggleClickHandlerMock = Mock.ofInstance(event => {});
                const reportGeneratorMock = Mock.ofType(ReportGenerator);

                const props = new TestPropsBuilder()
                    .setIssuesEnabled(issuesEnabled)
                    .setViolations(sampleViolations)
                    .setIssuesSelection(selectionMock.object)
                    .setIssuesTableHandler(issuesTableHandlerMock.object)
                    .setToggleClickHandler(toggleClickHandlerMock.object)
                    .setReportGenerator(reportGeneratorMock.object)
                    .build();

                reportGeneratorMock
                    .setup(rgm => rgm.generateHtml(props.scanResult, It.isAny(), props.pageTitle, props.pageUrl, description))
                    .verifiable(Times.once());

                const wrapped = shallow(<IssuesTable {...props} />);
                wrapped
                    .find(ReportExportComponent)
                    .props()
                    .htmlGenerator(description);

                expect(wrapped.debug()).toMatchSnapshot();
                reportGeneratorMock.verifyAll();
            });
        });

        it('spinner, issuesEnabled is an empty object', () => {
            const reportGeneratorMock = Mock.ofType(ReportGenerator);
            const props = new TestPropsBuilder()
                .setReportGenerator(reportGeneratorMock.object)
                .setIssuesEnabled({} as any)
                .build();

            const wrapper = shallow(<IssuesTable {...props} />);

            expect(wrapper.getElement()).toMatchSnapshot();
        });
    });

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
    private reportGenerator: ReportGenerator;
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

    public setReportGenerator(reportGenerator: ReportGenerator): TestPropsBuilder {
        this.reportGenerator = reportGenerator;
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
            reportGenerator: this.reportGenerator,
            userConfigurationStoreData: {
                bugService: 'gitHub',
            } as UserConfigurationStoreData,
        };
    }
}
