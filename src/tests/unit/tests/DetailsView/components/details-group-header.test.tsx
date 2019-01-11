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

    it('renders', () => {
        const testObject = new DetailsGroupHeader(props);

        const actual = testObject.render();

        expect(actual).toMatchSnapshot();
    });

    it('renders the title', () => {
        const testObject = new DetailsGroupHeader(props);

        const actual = testObject.onRenderTitle();

        expect(actual).toMatchSnapshot();
    });

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

    it('stops event propagation when rule link clicked', () => {
        const eventFactory = new EventStubFactory();
        const mouseClickEventStub = eventFactory.createMouseClickEvent() as any;
        const stopPropagationMock = jest.fn();
        mouseClickEventStub.stopPropagation = stopPropagationMock;

        const testObject = new DetailsGroupHeader(props);
        (testObject as any).onRuleLinkClick(mouseClickEventStub);

        expect(stopPropagationMock).toHaveBeenCalledTimes(1);
    });

});
