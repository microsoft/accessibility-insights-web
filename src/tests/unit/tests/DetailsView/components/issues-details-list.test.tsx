// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import { ISelection, Selection } from 'office-ui-fabric-react/lib/DetailsList';
import * as React from 'react';
import { Mock } from 'typemoq';

import { VisualizationType } from '../../../../../common/types/visualization-type';
import { IssuesDetailsList, IssuesDetailsListProps } from '../../../../../DetailsView/components/issues-details-list';
import { DetailsGroup, DetailsRowData, IssuesTableHandler } from '../../../../../DetailsView/components/issues-table-handler';
import { DecoratedAxeNodeResult } from '../../../../../injected/scanner-utils';
import { RuleResult } from '../../../../../scanner/iruleresults';
import { DictionaryStringTo } from '../../../../../types/common-types';
import { VisualizationScanResultStoreDataBuilder } from '../../../common/visualization-scan-result-store-data-builder';

describe('IssuesDetailsListTest', () => {
    const iconClassName = 'details-icon-error';

    test('render columns', () => {
        const sampleViolations: AxeRule[] = getSampleViolations();
        const sampleIdToRuleResultMap: DictionaryStringTo<DecoratedAxeNodeResult> = getSampleIdToRuleResultMap();
        const items: DetailsRowData[] = getSampleItems();
        const groups: DetailsGroup[] = getSampleGroups();
        const issuesData = new VisualizationScanResultStoreDataBuilder()
            .withScanResult(VisualizationType.Issues, {
                passes: [],
                violations: sampleViolations,
            })
            .withSelectedIdToRuleResultMapForIssues(sampleIdToRuleResultMap)
            .build().issues;
        const issuesTableHandlerMock = Mock.ofType<IssuesTableHandler>(IssuesTableHandler);
        const listGroups = {
            groups: groups,
            items: items,
        };

        issuesTableHandlerMock.setup(handler => handler.getListProps(issuesData.scanResult.violations)).returns(failedRules => listGroups);

        const selectionMock = Mock.ofType<ISelection>(Selection);
        const props = new TestPropsBuilder()
            .setViolations(issuesData.scanResult.violations)
            .setIssuesTableHandler(issuesTableHandlerMock.object)
            .setIssuesSelection(selectionMock.object)
            .build();

        const wrapped = shallow(<IssuesDetailsList {...props} />);
        expect(wrapped.getElement()).toMatchSnapshot();
    });

    test('shouldComponentUpdate', () => {
        const props = new TestPropsBuilder().build();
        const testSubject = new IssuesDetailsList(props);
        expect(testSubject.shouldComponentUpdate()).toBe(false);
    });

    test('onRenderGroupHeader', () => {
        const issuesDetailsListProps = new TestPropsBuilder().build();
        const testObject = new IssuesDetailsList(issuesDetailsListProps);
        const group = {
            ruleUrl: 'url',
            guidanceLinks: [
                {
                    text: 'test-text',
                    href: 'test-href',
                },
            ],
        };

        const result: JSX.Element = (testObject as any).onRenderGroupHeader({ testProp: 'testValue', group: group }, null);

        expect((result.type as any).name).toBe('DetailsGroupHeader');
        expect(result.props.testProp).toBe('testValue');
        expect(result.props.countIcon.props.className).toEqual(iconClassName);
        expect(result.props.countIcon.props.iconName).toEqual('statusErrorFull');
    });

    function getSampleIdToRuleResultMap(): DictionaryStringTo<DecoratedAxeNodeResult> {
        return {
            id1: {} as DecoratedAxeNodeResult,
            id2: {} as DecoratedAxeNodeResult,
        };
    }

    function getSampleItems(): DetailsRowData[] {
        const rowData = {
            selector: 'testSelector',
        };
        return [rowData as DetailsRowData, rowData as DetailsRowData];
    }

    function getSampleGroups(): DetailsGroup[] {
        return [
            {
                key: 'rule name',
                name: 'rule help',
                startIndex: 0,
                count: 2,
                guidanceLinks: [
                    {
                        text: 'test text',
                        href: 'url',
                    },
                ],
                ruleUrl: 'url',
            },
        ];
    }

    function getSampleViolations(): RuleResult[] {
        return [
            {
                id: 'rule name',
                description: 'rule description',
                help: 'rule help',
                nodes: [
                    {
                        any: [],
                        none: [],
                        all: [],
                        html: '',
                        target: ['#target-1'],
                        guidanceLinks: [
                            {
                                text: 'test-text',
                                url: 'url',
                            },
                        ],
                        ruleUrl: 'url',
                    },
                    {
                        any: [],
                        none: [],
                        all: [],
                        html: '',
                        target: ['#target-2'],
                        guidanceLinks: [
                            {
                                text: 'test-text',
                                url: 'url',
                            },
                        ],
                        ruleUrl: 'url',
                    },
                ],
            },
        ];
    }
});

class TestPropsBuilder {
    private violations: RuleResult[];
    private issuesTableHandler: IssuesTableHandler;
    private issuesSelection: ISelection;

    public setIssuesTableHandler(issuesTableHandler: IssuesTableHandler): TestPropsBuilder {
        this.issuesTableHandler = issuesTableHandler;
        return this;
    }

    public setIssuesSelection(selection: ISelection): TestPropsBuilder {
        this.issuesSelection = selection;
        return this;
    }

    public setViolations(violations: RuleResult[]): TestPropsBuilder {
        this.violations = violations;
        return this;
    }

    public build(): IssuesDetailsListProps {
        return {
            deps: {
                dropdownClickHandler: null,
                issueDetailsTextGenerator: null,
            },
            violations: this.violations,
            issuesTableHandler: this.issuesTableHandler,
            issuesSelection: this.issuesSelection,
            pageTitle: 'pageTitle',
            pageUrl: 'http://pageUrl/',
            selectedIdToRuleResultMap: null,
        };
    }
}
