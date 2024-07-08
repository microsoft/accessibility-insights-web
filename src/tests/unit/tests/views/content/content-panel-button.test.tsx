// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Button, themeToTokensObject, webLightTheme } from '@fluentui/react-components';
import { render } from '@testing-library/react';
import * as React from 'react';
import {
    expectMockedComponentPropsToMatchSnapshots,
    mockReactComponents,
} from 'tests/unit/mock-helpers/mock-module-helpers';
import { ContentPage } from 'views/content/content-page';
import { ContentPanelButton } from 'views/content/content-panel-button';
import { ContentActionMessageCreator } from '../../../../../common/message-creators/content-action-message-creator';
import { Theme, ThemeDeps, ThemeInnerProps } from 'common/components/theme';
import { Mock } from 'typemoq';
import { DocumentManipulator } from 'common/document-manipulator';

jest.mock('@fluentui/react-components');

describe('ContentPanelButton', () => {
    mockReactComponents([Button]);
    const documentManipulatorMock = Mock.ofType(DocumentManipulator);
    let props: ThemeInnerProps;
    beforeEach(() => {
        props = {
            deps: {
                documentManipulator: documentManipulatorMock.object,
                storeActionMessageCreator: null,
                storesHub: null,
            } as ThemeDeps,
            storeState: {
                userConfigurationStoreData: {
                    enableHighContrast: null,
                },
            },
        } as ThemeInnerProps;
    });

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
            // <Theme deps={props.deps}>
            <ContentPanelButton
                deps={deps}
                reference={content.for.testing}
                iconName="info"
                contentTitle={contentTitle}
            >
                TEXT
            </ContentPanelButton>,
            // </Theme>
        );

        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([Button]);
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
        expectMockedComponentPropsToMatchSnapshots([Button]);
    });

    it('renders without iconName', () => {
        const renderResult = render(
            <ContentPanelButton deps={deps} reference={'for/testing'} contentTitle={contentTitle}>
                TEXT
            </ContentPanelButton>,
        );

        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([Button]);
    });
});
