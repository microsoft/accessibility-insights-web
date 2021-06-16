// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { ContentPage } from 'views/content/content-page';
import { ContentPanelButton } from 'views/content/content-panel-button';
import { ContentActionMessageCreator } from '../../../../../common/message-creators/content-action-message-creator';

describe('ContentPanelButton', () => {
    const content = {
        for: {
            testing: ContentPage.create(() => 'CONTENT FOR TESTING' as any),
        },
    };
    const contentTitle = 'TITLE FOR TESTING';

    const deps = {
        contentProvider: ContentPage.provider(content),
        contentActionMessageCreator: {} as any as ContentActionMessageCreator,
    };

    it('renders from content', () => {
        const wrapped = shallow(
            <ContentPanelButton
                deps={deps}
                reference={content.for.testing}
                iconName="iconName"
                contentTitle={contentTitle}
            >
                TEXT
            </ContentPanelButton>,
        );

        expect(wrapped.getElement()).toMatchSnapshot();
    });

    it('renders from path', () => {
        const wrapped = shallow(
            <ContentPanelButton
                deps={deps}
                reference={'for/testing'}
                iconName="iconName"
                contentTitle={contentTitle}
            >
                TEXT
            </ContentPanelButton>,
        );

        expect(wrapped.getElement()).toMatchSnapshot();
    });
});
