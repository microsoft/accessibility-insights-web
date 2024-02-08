// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ActionButton } from '@fluentui/react';
import { render } from '@testing-library/react';
import * as React from 'react';
import {
    expectMockedComponentPropsToMatchSnapshots,
    mockReactComponents,
} from 'tests/unit/mock-helpers/mock-module-helpers';
import { ContentPage } from 'views/content/content-page';
import { ContentPanelButton } from 'views/content/content-panel-button';
import { ContentActionMessageCreator } from '../../../../../common/message-creators/content-action-message-creator';

jest.mock('views/content/content-panel-button');

describe('ContentPanelButton', () => {
    mockReactComponents([ActionButton]);
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
        const renderResult = render(
            <ContentPanelButton
                deps={deps}
                reference={content.for.testing}
                iconName="iconName"
                contentTitle={contentTitle}
            >
                TEXT
            </ContentPanelButton>,
        );

        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([ActionButton]);
    });

    it('renders from path', () => {
        const renderResult = render(
            <ContentPanelButton
                deps={deps}
                reference={'for/testing'}
                iconName="iconName"
                contentTitle={contentTitle}
            >
                TEXT
            </ContentPanelButton>,
        );

        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([ActionButton]);
    });

    it('renders without iconName', () => {
        const renderResult = render(
            <ContentPanelButton deps={deps} reference={'for/testing'} contentTitle={contentTitle}>
                TEXT
            </ContentPanelButton>,
        );

        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([ActionButton]);
    });
});
