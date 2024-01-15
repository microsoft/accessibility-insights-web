// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IButtonProps, IconButton } from '@fluentui/react';
import { render } from '@testing-library/react';
import { GearMenuButton, GearMenuButtonProps } from 'common/components/gear-menu-button';
import { DropdownClickHandler } from 'common/dropdown-click-handler';
import { FeatureFlags } from 'common/feature-flags';
import * as React from 'react';
import { EventStubFactory } from 'tests/unit/common/event-stub-factory';
import { IMock, It, Mock, Times } from 'typemoq';
import {
    expectMockedComponentPropsToMatchSnapshots,
    getMockComponentClassPropsForCall,
    mockReactComponents,
    useOriginalReactElements,
} from '../../../mock-helpers/mock-module-helpers';

jest.mock('@fluentui/react');

describe('GearMenuButton', () => {
    describe('renders', () => {
        mockReactComponents([IconButton]);
        const props: GearMenuButtonProps = {
            deps: {
                dropdownClickHandler: Mock.ofType(DropdownClickHandler).object,
            },
            featureFlagData: {},
        };

        it.each([true, false])('proper button with scoping enabled = %s', isScopingEnabled => {
            props.featureFlagData = { [FeatureFlags[FeatureFlags.scoping]]: isScopingEnabled };

            const renderResult = render(<GearMenuButton {...props} />);
            expect(renderResult.asFragment()).toMatchSnapshot();
            expectMockedComponentPropsToMatchSnapshots([IconButton]);
        });

        it('no down chevron menu icon', () => {
            render(<GearMenuButton {...props} />);
            const testSubject = getMockComponentClassPropsForCall(IconButton).onRenderMenuIcon;
            expect(testSubject()).toBeNull();
        });
    });

    describe('user interaction', () => {
        mockReactComponents([IconButton]);
        const eventStub = new EventStubFactory().createKeypressEvent() as any;

        let dropdownClickHandlerMock: IMock<DropdownClickHandler>;
        let props: GearMenuButtonProps;

        let buttonProps: IButtonProps;

        beforeEach(() => {
            dropdownClickHandlerMock = Mock.ofType(DropdownClickHandler);

            props = {
                deps: {
                    dropdownClickHandler: dropdownClickHandlerMock.object,
                },
                featureFlagData: { [FeatureFlags[FeatureFlags.scoping]]: true },
            };

            render(<GearMenuButton {...props} />);
            buttonProps = getMockComponentClassPropsForCall(IconButton);
        });

        it('handle settings menu item click', () => {
            useOriginalReactElements('@fluentui/react', ['IconButton']);
            dropdownClickHandlerMock.verify(
                handler => handler.openSettingsPanelHandler(It.isAny()),
                Times.never(),
            );
            findMenuItemByKey('settings').onClick(eventStub);
            dropdownClickHandlerMock.verify(
                handler => handler.openSettingsPanelHandler(eventStub),
                Times.once(),
            );
        });

        it('handle preview features menu item click', () => {
            useOriginalReactElements('@fluentui/react', ['IconButton']);
            dropdownClickHandlerMock.verify(
                handler => handler.openPreviewFeaturesPanelHandler(It.isAny()),
                Times.never(),
            );
            findMenuItemByKey('preview-features').onClick(eventStub);
            dropdownClickHandlerMock.verify(
                handler => handler.openPreviewFeaturesPanelHandler(eventStub),
                Times.once(),
            );
        });

        it('handle scoping menu item click', () => {
            useOriginalReactElements('@fluentui/react', ['IconButton']);
            dropdownClickHandlerMock.verify(
                handler => handler.openScopingPanelHandler(It.isAny()),
                Times.never(),
            );
            findMenuItemByKey('scoping-feature').onClick(eventStub);
            dropdownClickHandlerMock.verify(
                handler => handler.openScopingPanelHandler(eventStub),
                Times.once(),
            );
        });

        const findMenuItemByKey = (key: string) =>
            buttonProps.menuProps.items.find(item => item.key === key);
    });
});
