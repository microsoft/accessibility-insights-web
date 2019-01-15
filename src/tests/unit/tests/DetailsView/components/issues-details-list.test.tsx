// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    ConstrainMode,
    DetailsList,
    DetailsListLayoutMode,
    IColumn,
    ISelection,
    Selection,
    SelectionMode,
} from 'office-ui-fabric-react/lib/DetailsList';
import * as React from 'react';
import { Mock } from 'typemoq';

import { FeatureFlags } from '../../../../../common/feature-flags';
import { FeatureFlagStoreData } from '../../../../../common/types/store-data/feature-flag-store-data';
import { VisualizationType } from '../../../../../common/types/visualization-type';
import { BugButton } from '../../../../../DetailsView/components/bug-button';
import { FailureDetails } from '../../../../../DetailsView/components/failure-details';
import { IssuesDetailsList, IssuesDetailsListProps } from '../../../../../DetailsView/components/issues-details-list';
import {
    DetailsGroup,
    IDetailsRowData,
    IssuesTableHandler,
} from '../../../../../DetailsView/components/issues-table-handler';
import { DecoratedAxeNodeResult } from '../../../../../injected/scanner-utils';
import { RuleResult } from '../../../../../scanner/iruleresults';
import { VisualizationScanResultStoreDataBuilder } from '../../../common/visualization-scan-result-store-data-builder';

describe('IssuesDetailsListTest', () => {
    const bugFilingColumn = {
        key: 'bugs',
        name: 'Bugs',
        ariaLabel: 'Bugs',
        fieldName: 'bugButton',
        minWidth: 100,
        maxWidth: 150,
        isResizable: true,
        className: 'content-cell',
        headerClassName: 'content-header',
    };

    const instanceColumns = [
        {
            key: 'target',
            name: 'Path',
            ariaLabel: 'Path',
            fieldName: 'selector',
            minWidth: 100,
            maxWidth: 200,
            isResizable: true,
            className: 'content-cell',
            headerClassName: 'content-header',
        },
        {
            key: 'html',
            name: 'Snippet',
            ariaLabel: 'Snippet',
            fieldName: 'html',
            minWidth: 200,
            maxWidth: 400,
            isResizable: true,
            className: 'content-cell insights-code',
        },
        {
            key: 'fix',
            name: 'How to fix',
            ariaLabel: 'How to fix',
            fieldName: 'failureSummary',
            minWidth: 200,
            maxWidth: 400,
            isResizable: true,
            className: 'content-cell',
        },
    ];

    const iconClassName = 'details-icon-error';

    test('render with bug filing enabled', () => {

        const featureFlagData = {
            [FeatureFlags.showBugFiling]: true,
        };

        testRendering(getSampleItems(true), [bugFilingColumn, ...instanceColumns], featureFlagData);
    });

    test('render with bug filing disabled', () => {

        const featureFlagData: IDictionaryStringTo<boolean> = {
            [FeatureFlags.showBugFiling]: false,
        };

        testRendering(null, instanceColumns, featureFlagData);
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

    function getSampleIdToRuleResultMap(): IDictionaryStringTo<DecoratedAxeNodeResult> {
        return {
            id1: {} as DecoratedAxeNodeResult,
            id2: {} as DecoratedAxeNodeResult,
        };
    }

    function getSampleItems(showBugFiling = false): IDetailsRowData[] {
        const rowData = {
            selector: 'testSelector',
            bugButton: showBugFiling ? <BugButton/> : null,
        };
        return [rowData as IDetailsRowData, rowData as IDetailsRowData];
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

    function testRendering(sampleItems: IDetailsRowData[], columns: IColumn[], featureFlagData: IDictionaryStringTo<boolean>) {
        const sampleViolations: AxeRule[] = getSampleViolations();
        const sampleIdToRuleResultMap: IDictionaryStringTo<DecoratedAxeNodeResult> = getSampleIdToRuleResultMap();
        const items: IDetailsRowData[] = sampleItems ? sampleItems : getSampleItems();
        const groups: DetailsGroup[] = getSampleGroups();
        const issuesData = new VisualizationScanResultStoreDataBuilder()
            .withScanResult(VisualizationType.Issues, {
                passes: [],
                violations: sampleViolations,
            })
            .withSelectedIdToRuleResultMap(VisualizationType.Issues, sampleIdToRuleResultMap)
            .build().issues;
        const issuesTableHandlerMock = Mock.ofType<IssuesTableHandler>(IssuesTableHandler);
        const listGroups = {
            groups: groups,
            items: items,
        };

        issuesTableHandlerMock
            .setup(handler => handler.getListProps(
                issuesData.scanResult.violations,
                featureFlagData[FeatureFlags.showBugFiling]))
            .returns(failedRules => listGroups)
            .verifiable();

        const selectionMock = Mock.ofType<ISelection>(Selection);
        const props = new TestPropsBuilder()
            .setViolations(issuesData.scanResult.violations)
            .setIssuesTableHandler(issuesTableHandlerMock.object)
            .setIssuesSelection(selectionMock.object)
            .setFeatureFlagStoreData(featureFlagData)
            .build();
        const testObject = new IssuesDetailsList(props);
        const expected: JSX.Element = (<div className="issues-details-list">
            <FailureDetails items={items} />
            <DetailsList
                groupProps={{
                    isAllGroupsCollapsed: true,
                    onRenderHeader: (testObject as any).onRenderGroupHeader,
                }}
                items={items}
                groups={groups}
                onRenderDetailsHeader={(testObject as any).onRenderDetailsHeader}
                columns={columns}
                ariaLabelForSelectAllCheckbox="Toggle selection for all items"
                ariaLabelForSelectionColumn="Toggle selection"
                constrainMode={ConstrainMode.unconstrained}
                selectionMode={SelectionMode.multiple}
                selection={props.issuesSelection}
                selectionPreservedOnEmptyClick={true}
                setKey="key" className="details-list"
                layoutMode={DetailsListLayoutMode.fixedColumns} />
        </div>);

        expect(testObject.render()).toEqual(expected);
        expect(testObject.shouldComponentUpdate()).toBe(false);
        issuesTableHandlerMock.verifyAll();
    }

});

export class TestPropsBuilder {
    private violations: RuleResult[];
    private issuesTableHandler: IssuesTableHandler;
    private issuesSelection: ISelection;
    private featureFlagData: FeatureFlagStoreData;

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

    public setFeatureFlagStoreData(featureFlagData: FeatureFlagStoreData): TestPropsBuilder {
        this.featureFlagData = featureFlagData;
        return this;
    }

    public build(): IssuesDetailsListProps {
        return {
            violations: this.violations,
            issuesTableHandler: this.issuesTableHandler,
            issuesSelection: this.issuesSelection,
            pageTitle: 'pageTitle',
            pageUrl: 'http://pageUrl/',
            featureFlagData: this.featureFlagData,
        };
    }
}

