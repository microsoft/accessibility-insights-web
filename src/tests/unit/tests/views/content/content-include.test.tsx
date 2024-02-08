// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import * as React from 'react';

import {
    expectMockedComponentPropsToMatchSnapshots,
    mockReactComponents,
} from 'tests/unit/mock-helpers/mock-module-helpers';
import { Content } from 'views/content/content';
import { ContentInclude } from 'views/content/content-include';
import { ContentPage } from 'views/content/content-page';
import { ContentActionMessageCreator } from '../../../../../common/message-creators/content-action-message-creator';

jest.mock('views/content/content');
describe('ContentInclude', () => {
    mockReactComponents([Content]);
    const content = {
        for: {
            testing: ContentPage.create(() => 'CONTENT FOR TESTING' as any),
        },
    };

    const applicationTitle = 'THE_APPLICATION_TITLE';
    const deps = {
        textContent: {
            applicationTitle,
        },
        contentProvider: ContentPage.provider(content),
        contentActionMessageCreator: {} as any as ContentActionMessageCreator,
    };

    it('renders from content', () => {
        const renderResult = render(<ContentInclude deps={deps} content={content.for.testing} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([Content]);
    });

    it('renders from path', () => {
        const renderResult = render(<ContentInclude deps={deps} content={'for/testing'} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([Content]);
    });
});
