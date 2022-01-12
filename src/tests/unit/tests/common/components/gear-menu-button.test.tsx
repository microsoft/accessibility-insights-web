// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { GearMenuButton, GearMenuButtonProps } from 'common/components/gear-menu-button';
import { DropdownClickHandler } from 'common/dropdown-click-handler';
import { FeatureFlags } from 'common/feature-flags';
import { shallow } from 'enzyme';
import { IButtonProps, IconButton } from '@fluentui/react';
import * as React from 'react';
import { EventStubFactory } from 'tests/unit/common/event-stub-factory';
import { IMock, It, Mock, Times } from 'typemoq';

describe('GearMenuButton', () => {
    describe('renders', () => {
        const props: GearMenuButtonProps = {
            deps: {
                dropdownClickHandler: Mock.ofType(DropdownClickHandler).object,
            },
            featureFlagData: {},
        };

        it.each([true, false])('proper button with scoping enabled = %s', isScopingEnabled => {
            props.featureFlagData = { [FeatureFlags[FeatureFlags.scoping]]: isScopingEnabled };

            const testSubject = shallow(<GearMenuButton {...props} />);
            expect(testSubject.getElement()).toMatchSnapshot();
        });

        it('no down chevron menu icon', () => {
            const wrapped = shallow(<GearMenuButton {...props} />);
            const testSubject = wrapped.find<IButtonProps>(IconButton).prop('onRenderMenuIcon');

            expect(testSubject()).toBeNull();
        });
    });

    describe('user interaction', () => {
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

            const testSubject = shallow(<GearMenuButton {...props} />);
            buttonProps = testSubject.find(IconButton).props();
        });

        it('handle settings menu item click', () => {
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
