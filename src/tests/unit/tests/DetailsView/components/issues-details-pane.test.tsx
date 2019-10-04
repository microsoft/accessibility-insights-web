// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { HyperlinkDefinition } from 'views/content/content-page';
import { IssueFilingButton } from '../../../../../common/components/issue-filing-button';
import { CreateIssueDetailsTextData } from '../../../../../common/types/create-issue-details-text-data';
import { UserConfigurationStoreData } from '../../../../../common/types/store-data/user-configuration-store';
import { DetailsViewActionMessageCreator } from '../../../../../DetailsView/actions/details-view-action-message-creator';
import {
    IssuesDetailsPane,
    IssuesDetailsPaneDeps,
    IssuesDetailsPaneProps,
} from '../../../../../DetailsView/components/Issues-details-pane';
import { FixInstructionPanel } from '../../../../../injected/components/fix-instruction-panel';
import { DecoratedAxeNodeResult } from '../../../../../injected/scanner-utils';
import { AxeResultToIssueFilingDataConverter } from '../../../../../issue-filing/rule-result-to-issue-filing-data';
import { DictionaryStringTo } from '../../../../../types/common-types';

describe('IssuesDetailsPaneTest', () => {
    const samplePageTitle = 'pageTitle';
    const samplePageUrl = 'pageUrl';

    test('render with empty selection', () => {
        testRenderNotSingle(0);
    });

    test('render with multiple selection', () => {
        testRenderNotSingle(2);
    });

    test('render with single selection, test copy to clipboard', () => {
        const props = generateProps(1, 2);
        const wrapper = shallow(<IssuesDetailsPane {...props} />);
        expect(wrapper.debug()).toMatchSnapshot();
    });

    test('render with single selection, issue filing button', () => {
        const props = generateProps(1, 2);
        const wrapper = shallow(<IssuesDetailsPane {...props} />);
        const issueFilingButton = wrapper.find(IssueFilingButton);
        expect(issueFilingButton.getElement()).toMatchSnapshot();
    });

    test('renderTitleElement passed to embedded FixInstructionPanels should match snapshot', () => {
        const issuesDetailsPaneProps = generateProps(1, 2);
        const issuesDetailsPane = shallow(<IssuesDetailsPane {...issuesDetailsPaneProps} />);
        const renderTitleElement = issuesDetailsPane
            .find(FixInstructionPanel)
            .first()
            .prop('renderTitleElement');

        const titleElement = renderTitleElement('test title', 'test-class-name');
        expect(titleElement).toMatchSnapshot();
    });

    function testRenderNotSingle(count: number): void {
        const props = generateProps(count, 0);
        const testObject = new IssuesDetailsPane(props);

        const actual = testObject.render();

        const expected: JSX.Element = (
            <div>
                <div>
                    <h2>Failure details</h2>
                    <div className="issue-detail-select-message">
                        Select a single failure instance from a group in the table above to see more details here.
                    </div>
                </div>
            </div>
        );
        expect(actual).toEqual(expected);
    }

    function generateProps(ruleCount: number, linksCount: number): IssuesDetailsPaneProps {
        const checkResult: FormattedCheckResult[] = [
            {
                message: 'check-result-message',
                id: 'check-result-id',
                data: 'check-result-data',
            },
        ];

        const guidanceLinks: HyperlinkDefinition[] = [];
        for (let i = 1; i <= linksCount; i++) {
            guidanceLinks.push({
                text: `guidance X.${i}.${i}`,
                href: `aka.ms/guidance-url-X.${i}.${i}`,
            });
        }

        const ruleMap = {} as DictionaryStringTo<DecoratedAxeNodeResult>;
        for (let i = 1; i <= ruleCount; i++) {
            const id = `id${i}`;
            ruleMap[id] = {
                any: checkResult,
                all: checkResult,
                none: checkResult,
                status: false,
                ruleId: 'rule-id',
                help: 'rule-help',
                failureSummary: null,
                html: null,
                selector: null,
                id: id,
                guidanceLinks: guidanceLinks,
                helpUrl: 'http://help-url/',
                fingerprint: id,
                snippet: null,
            };
        }

        const fakeIssueData = {
            targetApp: {
                name: 'name',
            },
        } as CreateIssueDetailsTextData;
        const deps: IssuesDetailsPaneDeps = {
            axeResultToIssueFilingDataConverter: {
                convert: (res, title, url) => fakeIssueData,
            } as AxeResultToIssueFilingDataConverter,
            issueDetailsTextGenerator: null,
            detailsViewActionMessageCreator: {
                copyIssueDetailsClicked: _ => {},
            } as DetailsViewActionMessageCreator,
            windowUtils: null,
            issueFilingActionMessageCreator: null,
        } as IssuesDetailsPaneDeps;

        const props: IssuesDetailsPaneProps = {
            deps,
            selectedIdToRuleResultMap: ruleMap,
            pageTitle: samplePageTitle,
            pageUrl: samplePageUrl,
            featureFlagData: {},
            userConfigurationStoreData: {} as UserConfigurationStoreData,
        };

        return props;
    }
});
