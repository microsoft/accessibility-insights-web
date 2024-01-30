// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { HeadingWithContentLink } from 'common/components/heading-with-content-link';
import * as React from 'react';

import { ContentLink } from 'views/content/content-link';
import { ContentPage } from 'views/content/content-page';
import { ContentActionMessageCreator } from '../../../../../common/message-creators/content-action-message-creator';
import { mockReactComponents } from '../../../mock-helpers/mock-module-helpers';

jest.mock('views/content/content-link');
describe('HeadingWithContentLink', () => {
    mockReactComponents([ContentLink]);
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
        const renderResult = render(
            <HeadingWithContentLink deps={deps} guidance={null} headingTitle={headingTitle} />,
        );
        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    it('renders with both text and icon', () => {
        const renderResult = render(
            <HeadingWithContentLink
                deps={deps}
                guidance={contentPath}
                headingTitle={headingTitle}
                iconName="test icon"
            />,
        );
        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    it('renders with heading, secondary text, and icon', () => {
        const renderResult = render(
            <HeadingWithContentLink
                deps={deps}
                guidance={contentPath}
                headingTitle={headingTitle}
                secondaryText={secondaryText}
                iconName="test icon"
            />,
        );
        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
