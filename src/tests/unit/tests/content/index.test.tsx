// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { mockReactComponents } from 'tests/unit/mock-helpers/mock-module-helpers';
import { Mock } from 'typemoq';

import { ContentActionMessageCreator } from '../../../../common/message-creators/content-action-message-creator';
import { contentPages } from '../../../../content';

jest.mock('react-helmet-async');

describe('content', () => {
    mockReactComponents([Helmet]);
    const contentActionMessageCreator = Mock.ofType<ContentActionMessageCreator>().object;
    const applicationTitle = 'THE_APPLICATION_TITLE';
    const deps = {
        textContent: {
            applicationTitle,
        },
        contentActionMessageCreator,
    };

    contentPages.allPaths().forEach(path =>
        it(`can render ${path}`, () => {
            const ThisPage = contentPages.getPage(path);
            expect(ThisPage.displayName).toEqual('ContentPageComponent');
            const renderResult = render(<ThisPage deps={deps} />);
            const headerExists =
                renderResult.queryAllByRole('heading', { level: 1 }) ||
                renderResult.queryAllByRole('heading', { level: 2 });

            expect(headerExists).not.toBeNull();
        }),
    );
});
