// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { cloneDeep } from 'lodash';
import { GroupHeader } from 'office-ui-fabric-react/lib/components/GroupedList/GroupHeader';
import * as React from 'react';

import { DetailsGroupHeader, DetailsGroupHeaderProps } from '../../../../../DetailsView/components/details-group-header';
import { EventStubFactory } from '../../../common/event-stub-factory';

describe('DetailsGroupHeader', () => {
    let props: DetailsGroupHeaderProps;

    beforeEach(() => {
        props = {
            group: {
                key: 'key',
                name: 'name',
                startIndex: 0,
                count: 2,
                guidanceLinks: [
                    {
                        text: 'test name',
                        href: 'url',
                    },
                ],
                ruleUrl: 'test rule url',
            },
        };
    });

    it('renders with Guidance links', () => {
        testRender();
    });

    function testRender() {
        /* OF6UPDATE
        const groupHeader = new GroupHeader(props);
        const testObject = new DetailsGroupHeader(props);

        const actual = testObject.render();

        const basic = groupHeader.render();
        const expected = createExpectedByMergingActualChangesIntoBasicGroupHeader(actual, basic);
        expect(actual).toEqual(expected);

        expect(basic).toMatchSnapshot('GroupHeader baseline - changes should be matched in DetailsGroupHeader baseline');
        expect(actual).toMatchSnapshot('DetailsGroupHeader baseline');
        */
    }

    function createExpectedByMergingActualChangesIntoBasicGroupHeader(actual: JSX.Element, basic: JSX.Element) {
        const expected = cloneDeep(basic);
        expect(expected).toEqual(basic);

        expected.props.onClick = actual.props.onClick;

        const expectedFocusZone = expected.props.children;
        const actualFocusZone = actual.props.children;
        expect(expectedFocusZone.props.children.length).toBe(6);
        expect(actualFocusZone.props.children.length).toBe(6);

        const expectedExpandButton = expectedFocusZone.props.children[3];
        const actualExpandButton = actualFocusZone.props.children[3];
        expectedExpandButton.props.onClick = actualExpandButton.props.onClick;

        const expectedGroupHeaderTitle = expectedFocusZone.props.children[4];
        const actualGroupHeaderTitle = actualFocusZone.props.children[4];
        expect(expectedGroupHeaderTitle.props.children.length).toBe(2);
        expect(actualGroupHeaderTitle.props.children.length).toBe(4);
        expectedGroupHeaderTitle.props.children = [
            actualGroupHeaderTitle.props.children[0],
            expectedGroupHeaderTitle.props.children[0],
            expectedGroupHeaderTitle.props.children[1],
            actualGroupHeaderTitle.props.children[3],
        ];

        const actualRuleObject = actualGroupHeaderTitle.props.children[0];
        expect(actualRuleObject).toMatchSnapshot('expected NewTabLink inside div');

        const actualGuidanceObject = actualGroupHeaderTitle.props.children[3];
        expect(actualGuidanceObject).toMatchSnapshot('expected Guidance Links');

        const expectedGroupHeaderCount = expectedGroupHeaderTitle.props.children[2];
        const actualGroupHeaderCount = actualGroupHeaderTitle.props.children[2];
        expect(expectedGroupHeaderCount.props.children.length).toBe(4);
        expect(actualGroupHeaderCount.props.children.length).toBe(5);
        expectedGroupHeaderCount.props.children = [
            expectedGroupHeaderCount.props.children[0],
            undefined,
            expectedGroupHeaderCount.props.children[1],
            expectedGroupHeaderCount.props.children[2],
            expectedGroupHeaderCount.props.children[3],
        ];

        return expected;
    }

    /* OF6UPDATE
    it('renders provided countIcon in header', () => {
        const testIcon = <i className="test-icon"></i>;
        props.countIcon = testIcon;

        const testObject = new DetailsGroupHeader(props);
        const actual = testObject.render();
        const focusZoneActual = actual.props.children;
        const groupHeaderTitleActual = focusZoneActual.props.children[4];
        const headerCountActual = groupHeaderTitleActual.props.children[2];
        const headerCountIconActual = headerCountActual.props.children[1];

        expect(headerCountIconActual).toEqual(testIcon);
    });

    it('hides header count', () => {
        props.hideHeaderCount = true;

        const testObject = new DetailsGroupHeader(props);
        const actual = testObject.render();
        const focusZoneActual = actual.props.children;
        const groupHeaderTitleActual = focusZoneActual.props.children[4];
        const headerCountActual = groupHeaderTitleActual.props.children[2];

        expect(headerCountActual).toBeNull();
    });

    it('renders ariaLabel in header button if insertButtonLabels, expanded group', () => {
        props.insertButtonLabels = true;

        const testObject = new DetailsGroupHeader(props);
        const actual = testObject.render();
        const focusZoneActual = actual.props.children;
        const expandButton: JSX.Element = focusZoneActual.props.children[3];

        expect(expandButton.type).toBe('button');
        expect(expandButton.props['aria-label']).toBe('Collapse group');
    });

    it('renders ariaLabel in header button if insertButtonLabels, collapsed group', () => {
        props.insertButtonLabels = true;
        props.group.isCollapsed = true;

        const testObjet = new DetailsGroupHeader(props);
        const actual = testObjet.render();
        const focusZoneActual = actual.props.children;
        const expandButton: JSX.Element = focusZoneActual.props.children[3];

        expect(expandButton.type).toBe('button');
        expect(expandButton.props['aria-label']).toBe('Expand group');
    });

    it('stops event propagation when rule link clicked', () => {
        const eventFactory = new EventStubFactory();
        const mouseClickEventStub = eventFactory.createMouseClickEvent() as any;
        const stopPropagationMock = jest.fn();
        mouseClickEventStub.stopPropagation = stopPropagationMock;

        const testObject = new DetailsGroupHeader(props);
        (testObject as any).onRuleLinkClick(mouseClickEventStub);

        expect(stopPropagationMock).toHaveBeenCalledTimes(1);
    });
    */

});
