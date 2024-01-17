// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { INavLink, Nav } from '@fluentui/react';
import { DebugToolsNavActionCreator } from 'debug-tools/action-creators/debug-tools-nav-action-creator';
import { DebugToolsNav, DebugToolsNavProps } from 'debug-tools/components/debug-tools-nav';
import { ToolsNavKey } from 'debug-tools/stores/debug-tools-nav-store';
import * as React from 'react';
import { IMock, Mock, Times } from 'typemoq';
import { getMockComponentClassPropsForCall, mockReactComponents } from '../../../mock-helpers/mock-module-helpers';

jest.mock('@fluentui/react');
describe('DebugToolsNav', () => {
    mockReactComponents([Nav]);
    let props: DebugToolsNavProps;
    let debugToolsNavActionCreatorMock: IMock<DebugToolsNavActionCreator>;

    beforeEach(() => {
        debugToolsNavActionCreatorMock = Mock.ofType(DebugToolsNavActionCreator);
        props = {
            className: 'test-class-name',
            state: {
                debugToolsNavStoreData: {
                    selectedTool: 'test-selected-tool' as ToolsNavKey,
                },
            },
            deps: {
                debugToolsNavActionCreator: debugToolsNavActionCreatorMock.object,
            },
        };
    });

    it('renders', () => {
        const renderResult = render(<DebugToolsNav {...props} />);

        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    it('handles user link click', () => {
        render(<DebugToolsNav {...props} />);

        const nav = getMockComponentClassPropsForCall(Nav);

        const onLinkClick = nav.onLinkClick;

        onLinkClick(null, { key: 'test-key' } as INavLink);

        debugToolsNavActionCreatorMock.verify(
            creator => creator.onSelectTool('test-key' as ToolsNavKey),
            Times.once(),
        );
    });
});
