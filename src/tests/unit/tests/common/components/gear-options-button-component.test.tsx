// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { GearOptionsButtonComponent, GearOptionsButtonComponentProps } from 'common/components/gear-options-button-component';
import { DropdownClickHandler } from 'common/dropdown-click-handler';
import { FeatureFlags } from 'common/feature-flags';
import { shallow } from 'enzyme';
import { IButtonProps, IconButton } from 'office-ui-fabric-react';
import * as React from 'react';
import { EventStubFactory } from 'tests/unit/common/event-stub-factory';
import { IMock, It, Mock, Times } from 'typemoq';

describe('GearOptionsButtonComponent', () => {
    describe('renders', () => {
        const props: GearOptionsButtonComponentProps = {
            dropdownClickHandler: Mock.ofType(DropdownClickHandler).object,
            featureFlags: {},
        };

        it.each([true, false])('proper button with scoping enabled = %s', isScopingEnabled => {
            props.featureFlags = { [FeatureFlags[FeatureFlags.scoping]]: isScopingEnabled };

            const testSubject = shallow(<GearOptionsButtonComponent {...props} />);
            expect(testSubject.getElement()).toMatchSnapshot();
        });

        it('no down chevron menu icon', () => {
            const wrapped = shallow(<GearOptionsButtonComponent {...props} />);
            const testSubject = wrapped.find<IButtonProps>(IconButton).prop('onRenderMenuIcon');

            expect(testSubject()).toBeNull();
        });
    });

    describe('user interaction', () => {
        const eventStub = new EventStubFactory().createKeypressEvent() as any;

        let dropdownClickHandlerMock: IMock<DropdownClickHandler>;
        let props: GearOptionsButtonComponentProps;

        let buttonProps: IButtonProps;

        beforeEach(() => {
            dropdownClickHandlerMock = Mock.ofType(DropdownClickHandler);

            props = {
                dropdownClickHandler: dropdownClickHandlerMock.object,
                featureFlags: { [FeatureFlags[FeatureFlags.scoping]]: true },
            };

            const testSubject = shallow(<GearOptionsButtonComponent {...props} />);
            buttonProps = testSubject.find(IconButton).props();
        });

        it('handle settings menu item click', () => {
            dropdownClickHandlerMock.verify(handler => handler.openSettingsPanelHandler(It.isAny()), Times.never());
            buttonProps.menuProps.items.filter(item => item.key === 'settings')[0].onClick(eventStub);
            dropdownClickHandlerMock.verify(handler => handler.openSettingsPanelHandler(eventStub), Times.once());
        });

        it('handle preview features menu item click', () => {
            dropdownClickHandlerMock.verify(handler => handler.openPreviewFeaturesPanelHandler(It.isAny()), Times.never());
            buttonProps.menuProps.items.filter(item => item.key === 'preview-features')[0].onClick(eventStub);
            dropdownClickHandlerMock.verify(handler => handler.openPreviewFeaturesPanelHandler(eventStub), Times.once());
        });

        it('handle scoping menu item click', () => {
            dropdownClickHandlerMock.verify(handler => handler.openScopingPanelHandler(It.isAny()), Times.never());
            buttonProps.menuProps.items.filter(item => item.key === 'scoping-feature')[0].onClick(eventStub);
            dropdownClickHandlerMock.verify(handler => handler.openScopingPanelHandler(eventStub), Times.once());
        });
    });
});
