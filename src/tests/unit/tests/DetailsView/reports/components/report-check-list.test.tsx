// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { ReportCheckList, ReportCheckListProps } from '../../../../../../DetailsView/reports/components/report-check-list';
import { RuleResult } from '../../../../../../scanner/iruleresults';

describe('ReportCheckListTest', () => {
    const result1: RuleResult = {
        description: 'test-description',
        helpUrl: 'https://help-url-1/',
        id: 'rule-id-1',
        help: 'rule-help-1',
        guidanceLinks: [
            {
                href: 'test href 1',
                text: 'test text 1',
            },
        ],
        nodes: [{} as AxeNodeResult, {} as AxeNodeResult],
    };

    const result2: RuleResult = {
        description: 'test-description',
        helpUrl: 'https://help-url-2/',
        id: 'rule-id-2',
        help: 'rule-help-2',
        guidanceLinks: [
            {
                href: 'test href 2',
                text: 'test text 2',
            },
        ],
        nodes: [{} as AxeNodeResult],
    };

    test('render 0 results with congratulations', () => {
        const props: ReportCheckListProps = {
            results: [],
            idPrefix: 'test0',
            showInstanceCount: true,
            showInstances: true,
            congratulateIfEmpty: true,
        };

        verifySnapshot(props);
    });

    test('render 0 results', () => {
        const props: ReportCheckListProps = {
            results: [],
            idPrefix: 'test0',
            showInstanceCount: false,
            showInstances: false,
            congratulateIfEmpty: false,
        };

        verifySnapshot(props);
    });

    test('render 1 result with instances', () => {
        const props: ReportCheckListProps = {
            results: [result1 as any],
            idPrefix: 'test1',
            showInstanceCount: true,
            showInstances: true,
            congratulateIfEmpty: true,
        };

        verifySnapshot(props);
    });

    test('render 2 results', () => {
        const props: ReportCheckListProps = {
            results: [result1 as any, result2 as any],
            idPrefix: 'test2',
            showInstanceCount: true,
            showInstances: true,
            congratulateIfEmpty: false,
        };

        verifySnapshot(props);
    });

    test('render, showInstanceCount = false', () => {
        const props: ReportCheckListProps = {
            results: [result1 as any, result2 as any],
            idPrefix: 'test2',
            showInstanceCount: false,
            showInstances: true,
            congratulateIfEmpty: false,
        };

        verifySnapshot(props);
    });

    test('render, showInstances = false', () => {
        const props: ReportCheckListProps = {
            results: [result1 as any, result2 as any],
            idPrefix: 'test2',
            showInstanceCount: true,
            showInstances: false,
            congratulateIfEmpty: false,
        };

        verifySnapshot(props);
    });

    function verifySnapshot(props: ReportCheckListProps): void {
        expect(shallow(<ReportCheckList {...props} />).getElement()).toMatchSnapshot();
    }
});
