// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { ContentInclude } from 'views/content/content-include';
import { ContentPage } from 'views/content/content-page';
import { ContentActionMessageCreator } from '../../../../../common/message-creators/content-action-message-creator';

describe('ContentInclude', () => {
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
        const result = shallow(<ContentInclude deps={deps} content={content.for.testing} />);
        expect(result.debug()).toMatchSnapshot();
    });

    it('renders from path', () => {
        const result = shallow(<ContentInclude deps={deps} content={'for/testing'} />);
        expect(result.debug()).toMatchSnapshot();
    });
});
