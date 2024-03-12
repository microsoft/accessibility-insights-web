// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Panel } from '@fluentui/react';
import { render } from '@testing-library/react';
import * as React from 'react';

import { mockReactComponents } from 'tests/unit/mock-helpers/mock-module-helpers';
import { ContentPage } from 'views/content/content-page';
import { ContentPanel } from 'views/content/content-panel';
import { ContentActionMessageCreator } from '../../../../../common/message-creators/content-action-message-creator';

jest.mock('@fluentui/react');
describe('ContentPanel', () => {
    mockReactComponents([Panel]);
    const content = {
        for: {
            testing: ContentPage.create(() => 'CONTENT FOR TESTING' as any),
        },
    };

    const applicationTitle = 'THE_APPLICATION_TITLE';
    const contentTitle = 'THE CONTENT TITLE';
    const deps = {
        textContent: {
            applicationTitle,
        },
        contentProvider: ContentPage.provider(content),
        contentActionMessageCreator: {} as any as ContentActionMessageCreator,
    };

    it('renders from content', () => {
        const renderResult = render(
            <ContentPanel
                deps={deps}
                content={content.for.testing}
                isOpen={true}
                contentTitle={contentTitle}
            />,
        );
        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    it('renders from path', () => {
        const renderResult = render(
            <ContentPanel
                deps={deps}
                content={'for/testing'}
                isOpen={true}
                contentTitle={contentTitle}
            />,
        );
        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    it('renders closed', () => {
        const renderResult = render(
            <ContentPanel
                deps={deps}
                content={'for/testing'}
                isOpen={false}
                contentTitle={contentTitle}
            />,
        );
        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
