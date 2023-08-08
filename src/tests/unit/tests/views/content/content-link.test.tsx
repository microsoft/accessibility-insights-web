// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { NewTabLink } from '../../../../../common/components/new-tab-link';
import { ContentActionMessageCreator } from '../../../../../common/message-creators/content-action-message-creator';
import { ContentLink, ContentLinkDeps } from '../../../../../views/content/content-link';
import { ContentPage } from '../../../../../views/content/content-page';
import { NullUrlDecorator } from '../../../../../views/content/url-decorator/null-url-decorator';

describe('ContentLink', () => {
    const contentPath = 'for/testing';
    const content = {
        for: {
            testing: ContentPage.create(() => 'CONTENT FOR TESTING' as any),
        },
    };

    const contentProvider = ContentPage.provider(content);

    const openContentPage = jest.fn();

    const contentActionMessageCreator = ({
        openContentPage,
    } as Partial<ContentActionMessageCreator>) as ContentActionMessageCreator;

    const deps: ContentLinkDeps = {
        contentProvider,
        contentActionMessageCreator,
        contentUrlDecorator: NullUrlDecorator,
    };

    it('render null when reference is not defined', () => {
        const result = shallow(<ContentLink deps={deps} reference={null} />);
        expect(result.debug()).toMatchSnapshot();
    });

    it('renders from content, only have the icon', () => {
        const result = shallow(<ContentLink deps={deps} reference={content.for.testing} iconName={'test icon 1'} />);
        expect(result.debug()).toMatchSnapshot();
    });

    it('renders from path, only have the icon', () => {
        const result = shallow(<ContentLink deps={deps} reference={contentPath} iconName={'test icon 2'} />);
        expect(result.debug()).toMatchSnapshot();
    });

    it('renders with only text', () => {
        const result = shallow(<ContentLink deps={deps} reference={contentPath} linkText={'test'} />);
        expect(result.debug()).toMatchSnapshot();
    });

    it('renders with both text and icon', () => {
        const result = shallow(<ContentLink deps={deps} reference={contentPath} linkText={'test'} iconName="test icon" />);
        expect(result.debug()).toMatchSnapshot();
    });

    it('reacts to a click', () => {
        const result = shallow(<ContentLink deps={deps} reference={contentPath} />);

        result.find(NewTabLink).simulate('click');

        expect(openContentPage).toBeCalledWith(undefined, contentPath);
    });
});
