// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { It, Mock, Times } from 'typemoq';

import {
    GearOptionsButtonComponent,
    GearOptionsButtonComponentProps,
} from '../../../../../common/components/gear-options-button-component';
import { DropdownClickHandler } from '../../../../../common/dropdown-click-handler';
import { FeatureFlags } from '../../../../../common/feature-flags';
import { DetailsViewDropDown } from '../../../../../DetailsView/components/details-view-dropdown';

describe('GearOptionsButtonComponent', () => {
    it('renders like snapshot', () => {
        const props: GearOptionsButtonComponentProps = {
            dropdownClickHandler: Mock.ofType(DropdownClickHandler).object,
            featureFlags: { [FeatureFlags[FeatureFlags.scoping]]: false },
        };

        const testSubject = shallow(<GearOptionsButtonComponent {...props} />);
        expect(testSubject.debug()).toMatchInlineSnapshot(`
            "<div className=\\"gear-options-button-component\\">
              <DetailsViewDropDown menuItems={{...}} />
            </div>"
        `);
    });

    it('renders its contained dropdown with the appropriate menu items (including scoping) with scoping flag enabled', () => {
        const props: GearOptionsButtonComponentProps = {
            dropdownClickHandler: Mock.ofType(DropdownClickHandler).object,
            featureFlags: { [FeatureFlags[FeatureFlags.scoping]]: true },
        };

        const testSubject = shallow(<GearOptionsButtonComponent {...props} />);
        const dropdownProps = testSubject.find(DetailsViewDropDown).props();
        expect(dropdownProps).toMatchInlineSnapshot(`
            Object {
              "menuItems": Array [
                Object {
                  "iconProps": Object {
                    "iconName": "gear",
                  },
                  "key": "settings",
                  "name": "Settings",
                  "onClick": [Function],
                },
                Object {
                  "className": "preview-features-drop-down-button",
                  "iconProps": Object {
                    "iconName": "giftboxOpen",
                  },
                  "key": "preview-features",
                  "name": "Preview features",
                  "onClick": [Function],
                },
                Object {
                  "iconProps": Object {
                    "iconName": "scopeTemplate",
                  },
                  "key": "scoping-feature",
                  "name": "Scoping",
                  "onClick": [Function],
                },
              ],
            }
        `);
    });

    it('renders its contained dropdown with the appropriate menu items (excluding scoping) with scoping flag disabled', () => {
        const props: GearOptionsButtonComponentProps = {
            dropdownClickHandler: Mock.ofType(DropdownClickHandler).object,
            featureFlags: { [FeatureFlags[FeatureFlags.scoping]]: false },
        };

        const testSubject = shallow(<GearOptionsButtonComponent {...props} />);
        const dropdownProps = testSubject.find(DetailsViewDropDown).props();
        expect(dropdownProps).toMatchInlineSnapshot(`
            Object {
              "menuItems": Array [
                Object {
                  "iconProps": Object {
                    "iconName": "gear",
                  },
                  "key": "settings",
                  "name": "Settings",
                  "onClick": [Function],
                },
                Object {
                  "className": "preview-features-drop-down-button",
                  "iconProps": Object {
                    "iconName": "giftboxOpen",
                  },
                  "key": "preview-features",
                  "name": "Preview features",
                  "onClick": [Function],
                },
              ],
            }
        `);
    });

    it('delegates menu item onClick calls to the appropriate clickHandler methods', () => {
        const stubClickEvent = {};
        const mockDropdownClickHandler = Mock.ofType(DropdownClickHandler);

        const props: GearOptionsButtonComponentProps = {
            dropdownClickHandler: mockDropdownClickHandler.object,
            featureFlags: { [FeatureFlags[FeatureFlags.scoping]]: true },
        };

        const testSubject = shallow(<GearOptionsButtonComponent {...props} />);
        const dropdownProps = testSubject.find(DetailsViewDropDown).props();

        mockDropdownClickHandler.verify(h => h.openSettingsPanelHandler(It.isAny()), Times.never());
        dropdownProps.menuItems.filter(item => item.key === 'settings')[0].onClick(stubClickEvent);
        mockDropdownClickHandler.verify(h => h.openSettingsPanelHandler(It.isAny()), Times.once());

        mockDropdownClickHandler.verify(h => h.openScopingPanelHandler(It.isAny()), Times.never());
        dropdownProps.menuItems.filter(item => item.key === 'scoping-feature')[0].onClick(stubClickEvent);
        mockDropdownClickHandler.verify(h => h.openScopingPanelHandler(It.isAny()), Times.once());

        mockDropdownClickHandler.verify(h => h.openPreviewFeaturesPanelHandler(It.isAny()), Times.never());
        dropdownProps.menuItems.filter(item => item.key === 'preview-features')[0].onClick(stubClickEvent);
        mockDropdownClickHandler.verify(h => h.openPreviewFeaturesPanelHandler(It.isAny()), Times.once());
    });
});
