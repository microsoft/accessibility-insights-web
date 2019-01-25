// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { BugButton } from '../../../../../DetailsView/components/bug-button';
import { DetailsGroup, IListProps, IssuesTableHandler } from '../../../../../DetailsView/components/issues-table-handler';
import { RuleResult } from '../../../../../scanner/iruleresults';

describe('IssuesTableHandlerTests', () => {
    test('get list props with bug filing', () => {
        testGetListProps(true);
    });

    test('get list props without bug filing', () => {
        testGetListProps(false);
    });

    function testGetListProps(showBugFiling: boolean) {
        const node1: AxeNodeResult = {
            any: [],
            none: [],
            all: [],
            instanceId: 'id1',
            html: 'html1',
            target: ['target1', 'id1'],
        };
        const node2: AxeNodeResult = {
            any: [],
            none: [],
            all: [],
            instanceId: 'id2',
            html: 'html2',
            target: ['target2', 'id2'],
        };
        const node3: AxeNodeResult = {
            any: [],
            none: [],
            all: [],
            instanceId: 'id3',
            html: 'html3',
            target: ['target3', 'id3'],
        };

        const failedRules: RuleResult[] = [
            {
                id: 'id1',
                nodes: [node1, node2],
                description: 'des1',
                help: 'help1',
                guidanceLinks: [
                    {
                        text: 'text1',
                        href: 'testurl1',
                    },
                ],
                helpUrl: 'https://id1',
            },
            {
                id: 'id2',
                nodes: [node3],
                description: 'des2',
                help: 'help2',
                guidanceLinks: [
                    {
                        text: 'text2',
                        href: 'testurl2',
                    },
                ],
                helpUrl: 'https://id2',
            },
        ];

        const testSubject = new IssuesTableHandler();

        const detailsRow1 = {
            ...node1,
            key: node1.instanceId,
            selector: 'target1;id1',
            bugButton: showBugFiling ? <BugButton /> : undefined,
        };
        const detailsRow2 = {
            ...node2,
            key: node2.instanceId,
            selector: 'target2;id2',
            bugButton: showBugFiling ? <BugButton /> : undefined,
        };
        const detailsRow3 = {
            ...node3,
            key: node3.instanceId,
            selector: 'target3;id3',
            bugButton: showBugFiling ? <BugButton /> : undefined,
        };

        const expectedGroups: DetailsGroup[] = [
            {
                key: 'id1',
                isCollapsed: true,
                name: 'help1',
                startIndex: 0,
                count: 2,
                guidanceLinks: [
                    {
                        text: 'text1',
                        href: 'testurl1',
                    },
                ],
                ruleUrl: 'https://id1',
            },
            {
                key: 'id2',
                isCollapsed: true,
                name: 'help2',
                startIndex: 2,
                count: 1,
                guidanceLinks: [
                    {
                        text: 'text2',
                        href: 'testurl2',
                    },
                ],
                ruleUrl: 'https://id2',
            },
        ];

        const expectedListGroups: IListProps = {
            groups: expectedGroups,
            items: [detailsRow1, detailsRow2, detailsRow3],
        };

        expect(testSubject.getListProps(failedRules, showBugFiling)).toEqual(expectedListGroups);
    }
});
