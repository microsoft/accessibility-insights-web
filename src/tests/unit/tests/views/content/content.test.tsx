// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import * as React from 'react';

import { Content, ContentDeps } from 'views/content/content';
import { ContentProvider } from 'views/content/content-page';
import { ContentView } from 'views/content/content-view';
import { NarrowModeDetector } from '../../../../../DetailsView/components/narrow-mode-detector';
import { mockReactComponents } from '../../../mock-helpers/mock-module-helpers';

jest.mock('../../../../../DetailsView/components/narrow-mode-detector');
jest.mock('views/content/content-view');

describe('content', () => {
    mockReactComponents([NarrowModeDetector, ContentView]);
    it('renders', () => {
        const contentFromReference = jest.fn().mockReturnValue('THE-CONTENT');
        const contentProvider = {
            contentFromReference,
        } as Partial<ContentProvider> as ContentProvider;
        const deps = { contentProvider } as Partial<ContentDeps> as ContentDeps;

        const component = <Content deps={deps} reference="content/path" />;
        const renderResult = render(component);

        expect(renderResult.asFragment()).toMatchSnapshot();
        expect(contentFromReference).toHaveBeenCalledWith('content/path');
    });
});
