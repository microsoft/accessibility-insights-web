// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { ContentCreatorWithTitle, ContentPage } from 'views/content/content-page';
import { ContentPanel } from 'views/content/content-panel';
import { ContentActionMessageCreator } from '../../../../../common/message-creators/content-action-message-creator';

describe('ContentPanel', () => {
    const content = {
        for: {
            testing: ContentCreatorWithTitle(ContentPage.create)(
                {
                    pageTitle: 'Test title',
                },
                () => 'CONTENT FOR TESTING' as any,
            ),
        },
    };

    const applicationTitle = 'THE_APPLICATION_TITLE';
    const deps = {
        textContent: {
            applicationTitle,
        },
        contentProvider: ContentPage.provider(content),
        contentActionMessageCreator: ({} as any) as ContentActionMessageCreator,
    };

    it('renders from content', () => {
        const result = shallow(
            <ContentPanel deps={deps} content={content.for.testing} isOpen={true} />,
        );
        expect(result.debug()).toMatchSnapshot();
    });

    it('renders from path', () => {
        const result = shallow(<ContentPanel deps={deps} content={'for/testing'} isOpen={true} />);
        expect(result.debug()).toMatchSnapshot();
    });

    it('renders closed', () => {
        const result = shallow(<ContentPanel deps={deps} content={'for/testing'} isOpen={false} />);
        expect(result.debug()).toMatchSnapshot();
    });
});
