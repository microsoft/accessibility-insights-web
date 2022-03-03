// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { HeadingWithContentLink } from 'common/components/heading-with-content-link';
import { shallow } from 'enzyme';
import * as React from 'react';

import { ContentPage } from 'views/content/content-page';
import { ContentActionMessageCreator } from '../../../../../common/message-creators/content-action-message-creator';

describe('HeadingWithContentLink', () => {
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

    const headingTitle = 'heading';

    const secondaryText = 'secondary';

    it('render null when reference is not defined', () => {
        const result = shallow(
            <HeadingWithContentLink deps={deps} guidance={null} headingTitle={headingTitle} />,
        );
        expect(result.debug()).toMatchSnapshot();
    });

    it('renders with both text and icon', () => {
        const result = shallow(
            <HeadingWithContentLink
                deps={deps}
                guidance={contentPath}
                headingTitle={headingTitle}
                iconName="test icon"
            />,
        );
        expect(result.debug()).toMatchSnapshot();
    });

    it('renders with heading, secondary text, and icon', () => {
        const result = shallow(
            <HeadingWithContentLink
                deps={deps}
                guidance={contentPath}
                headingTitle={headingTitle}
                secondaryText={secondaryText}
                iconName="test icon"
            />,
        );
        expect(result.debug()).toMatchSnapshot();
    });
});
