// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NewTabLinkWithTooltip } from 'common/components/new-tab-link-with-tooltip';
import { shallow } from 'enzyme';
import * as React from 'react';

import { ContentLink } from 'views/content/content-link';
import { ContentPage } from 'views/content/content-page';
import { ContentActionMessageCreator } from '../../../../../common/message-creators/content-action-message-creator';

describe('ContentLink', () => {
    const contentPath = 'for/testing';
    const content = {
        for: {
            testing: ContentPage.create(() => 'CONTENT FOR TESTING' as any),
        },
    };

    const contentProvider = ContentPage.provider(content);

    const openContentPage = jest.fn();

    const contentActionMessageCreator = {
        openContentPage,
    } as Partial<ContentActionMessageCreator> as ContentActionMessageCreator;

    const deps = {
        contentProvider,
        contentActionMessageCreator,
    };

    it('render null when reference is not defined', () => {
        const result = shallow(<ContentLink deps={deps} reference={null} />);
        expect(result.debug()).toMatchSnapshot();
    });

    it('renders from content, only have the icon', () => {
        const result = shallow(
            <ContentLink deps={deps} reference={content.for.testing} iconName={'test icon 1'} />,
        );
        expect(result.debug()).toMatchSnapshot();
    });

    it('renders from path, only have the icon', () => {
        const result = shallow(
            <ContentLink deps={deps} reference={contentPath} iconName={'test icon 2'} />,
        );
        expect(result.debug()).toMatchSnapshot();
    });

    it('renders with only text', () => {
        const result = shallow(
            <ContentLink deps={deps} reference={contentPath} linkText={'test'} />,
        );
        expect(result.debug()).toMatchSnapshot();
    });

    it('renders with both text and icon', () => {
        const result = shallow(
            <ContentLink
                deps={deps}
                reference={contentPath}
                linkText={'test'}
                iconName="test icon"
            />,
        );
        expect(result.debug()).toMatchSnapshot();
    });

    it('reacts to a click', () => {
        const result = shallow(<ContentLink deps={deps} reference={contentPath} />);

        result.find(NewTabLinkWithTooltip).simulate('click');

        expect(openContentPage).toBeCalledWith(undefined, contentPath);
    });
});
