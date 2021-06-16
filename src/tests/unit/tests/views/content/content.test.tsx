// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { Content, ContentDeps } from 'views/content/content';
import { ContentProvider } from 'views/content/content-page';

describe('content', () => {
    it('renders', () => {
        const contentFromReference = jest.fn().mockReturnValue('THE-CONTENT');
        const contentProvider = {
            contentFromReference,
        } as Partial<ContentProvider> as ContentProvider;
        const deps = { contentProvider } as Partial<ContentDeps> as ContentDeps;

        const component = <Content deps={deps} reference="content/path" />;
        const result = shallow(component);

        expect(result.debug()).toMatchSnapshot();
        expect(contentFromReference).toBeCalledWith('content/path');
    });
});
