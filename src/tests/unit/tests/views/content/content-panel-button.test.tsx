// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { ContentActionMessageCreator } from '../../../../../common/message-creators/content-action-message-creator';
import { ContentPage } from '../../../../../views/content/content-page';
import { ContentPanelButton } from '../../../../../views/content/content-panel-button';
import { shallowRender } from '../../../common/shallow-render';

describe('ContentPanelButton', () => {
    const content = {
        for: {
            testing: ContentPage.create(() => 'CONTENT FOR TESTING' as any),
        },
    };

    const deps = {
        contentProvider: ContentPage.provider(content),
        contentActionMessageCreator: ({} as any) as ContentActionMessageCreator,
    };

    it('renders from content', () => {
        const result = shallowRender(
            <ContentPanelButton deps={deps} reference={content.for.testing} iconName="iconName">
                TEXT
            </ContentPanelButton>,
        );
        expect(result).toMatchSnapshot();
    });

    it('renders from path', () => {
        const result = shallowRender(
            <ContentPanelButton deps={deps} reference={'for/testing'} iconName="iconName">
                TEXT
            </ContentPanelButton>,
        );
        expect(result).toMatchSnapshot();
    });
});
