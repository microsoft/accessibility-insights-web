// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { DetailsViewActionMessageCreator } from '../../../../../DetailsView/actions/details-view-action-message-creator';
import {
    IssuesDetailsPane,
    IssuesDetailsPaneDeps,
    IssuesDetailsPaneProps,
} from '../../../../../DetailsView/components/Issues-details-pane';
import { DecoratedAxeNodeResult } from '../../../../../injected/scanner-utils';
import { HyperlinkDefinition } from '../../../../../views/content/content-page';

describe('IssuesDetailsPaneTest', () => {
    const samplePageTitle = 'pageTitle';
    const samplePageUrl = 'pageUrl';
    const sampleIssueTrackerPath = 'https://example.com/example';

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

    function testRenderNotSingle(count: number): void {
        const props = generateProps(count, 0);
        const testObject = new IssuesDetailsPane(props);

        const actual = testObject.render();

        const expected: JSX.Element = (
            <div>
                <div>
                    <h2>Failure details</h2>
                    <div className="issue-detail-select-message">Select a single failure to see its details here.</div>
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

        const ruleMap = {} as IDictionaryStringTo<DecoratedAxeNodeResult>;
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

        const deps: IssuesDetailsPaneDeps = {
            issueDetailsTextGenerator: null,
            detailsViewActionMessageCreator: {
                copyIssueDetailsClicked: _ => {},
            } as DetailsViewActionMessageCreator,
            windowUtils: null,
            bugClickHandler: null,
        };

        const props: IssuesDetailsPaneProps = {
            deps,
            selectedIdToRuleResultMap: ruleMap,
            pageTitle: samplePageTitle,
            pageUrl: samplePageUrl,
            issueTrackerPath: sampleIssueTrackerPath,
            featureFlagData: {},
        };

        return props;
    }
});
