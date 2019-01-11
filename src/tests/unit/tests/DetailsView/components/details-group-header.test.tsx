// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
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
            countIcon: <i className="test-icon"></i>,
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
