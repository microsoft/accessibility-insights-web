// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { DebugToolsNavActionCreator } from 'debug-tools/action-creators/debug-tools-nav-action-creator';
import { DebugToolsNav, DebugToolsNavProps } from 'debug-tools/components/debug-tools-nav';
import { ToolsNavKey } from 'debug-tools/stores/debug-tools-nav-store';
import { shallow } from 'enzyme';
import { INavLink, Nav } from 'office-ui-fabric-react';
import * as React from 'react';
import { Mock, Times } from 'typemoq';

describe('DebugToolsNav', () => {
    it('renders', () => {
        const props: DebugToolsNavProps = {
            className: 'test-class-name',
            state: {
                debugToolsNavStoreData: {
                    selectedTool: 'test-selected-tool' as ToolsNavKey,
                },
            },
            deps: {
                debugToolsNavActionCreator: Mock.ofType(DebugToolsNavActionCreator).object,
            },
        };

        const wrapped = shallow(<DebugToolsNav {...props} />);

        expect(wrapped.getElement()).toMatchSnapshot();
    });

    it('handles user link click', () => {
        const debugToolsNavActionCreatorMock = Mock.ofType(DebugToolsNavActionCreator);

        const props: DebugToolsNavProps = {
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

        const wrapped = shallow(<DebugToolsNav {...props} />);

        const nav = wrapped.find(Nav);

        const onLinkClick = nav.prop('onLinkClick');

        onLinkClick(null, { key: 'test-key' } as INavLink);

        debugToolsNavActionCreatorMock.verify(
            creator => creator.onSelectTool('test-key' as ToolsNavKey),
            Times.once(),
        );
    });
});
