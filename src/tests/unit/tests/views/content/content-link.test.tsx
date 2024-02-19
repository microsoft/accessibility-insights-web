// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { NewTabLink } from 'common/components/new-tab-link';
import { NewTabLinkWithTooltip } from 'common/components/new-tab-link-with-tooltip';
import * as React from 'react';

import {
    getMockComponentClassPropsForCall,
    mockReactComponents,
} from 'tests/unit/mock-helpers/mock-module-helpers';
import { ContentLink } from 'views/content/content-link';
import { ContentPage } from 'views/content/content-page';
import { ContentActionMessageCreator } from '../../../../../common/message-creators/content-action-message-creator';

jest.mock('common/components/new-tab-link-with-tooltip');
jest.mock('common/components/new-tab-link');
jest.mock('@fluentui/react')

describe('ContentLink', () => {
    mockReactComponents([NewTabLinkWithTooltip, NewTabLink, (Icon as any).type]);
    const contentPath = 'for/testing';
    const content = {
        for: {
            testing: ContentPage.create(() => 'CONTENT FOR TESTING' as any),
        },
    };

    const contentProvider = ContentPage.provider(content);

    const openContentPage = jest.fn();

    const contentActionMessageCreator = {
        openContentPage,
    } as Partial<ContentActionMessageCreator> as ContentActionMessageCreator;

    const deps = {
        contentProvider,
        contentActionMessageCreator,
    };

    it('render null when reference is not defined', () => {
        const renderResult = render(<ContentLink deps={deps} reference={null} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    it('renders from content, only have the icon', () => {
        const renderResult = render(
            <ContentLink deps={deps} reference={content.for.testing} iconName={'test icon 1'} />,
        );
        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    it('renders from path, only have the icon', () => {
        const renderResult = render(
            <ContentLink deps={deps} reference={contentPath} iconName={'test icon 2'} />,
        );
        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    it('renders with only text', () => {
        const renderResult = render(
            <ContentLink deps={deps} reference={contentPath} linkText={'test'} />,
        );
        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    it('renders with both text and icon', () => {
        const renderResult = render(
            <ContentLink
                deps={deps}
                reference={contentPath}
                linkText={'test'}
                iconName="test icon"
            />,
        );
        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    it('renders without tooltip', () => {
        const renderResult = render(
            <ContentLink
                deps={deps}
                reference={contentPath}
                linkText={'test'}
                hideTooltip={true}
            />,
        );
        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    it('reacts to a click', () => {
        render(<ContentLink deps={deps} reference={contentPath} />);
        getMockComponentClassPropsForCall(NewTabLinkWithTooltip).onClick();
        expect(openContentPage).toHaveBeenCalledWith(undefined, contentPath);
        expect(openContentPage).toHaveBeenCalledTimes(1);
    });
});
