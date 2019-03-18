// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow, ShallowWrapper } from 'enzyme';
import { IContextualMenuItem } from 'office-ui-fabric-react/lib/ContextualMenu';
import * as React from 'react';
import { IMock, Mock } from 'typemoq';

import {
    GearOptionsButtonComponent,
    GearOptionsButtonComponentProps,
} from '../../../../../common/components/gear-options-button-component';
import { DropdownClickHandler } from '../../../../../common/dropdown-click-handler';
import { FeatureFlags } from '../../../../../common/feature-flags';
import { DetailsViewDropDown } from '../../../../../DetailsView/components/details-view-dropdown';
import { DictionaryStringTo } from '../../../../../types/common-types';

describe('gear-options-button-component.test', () => {
    let dropdownClickHandlerMock: IMock<DropdownClickHandler>;
    const openScopingPanelClickHandler: (event: any) => void = 'open scoping handler' as any;
    const openPreviewFeaturesClickHandler: (event: any) => void = 'open preview features handler' as any;
    const openSettingsPanelClickHandler: (event: any) => void = 'open settings panel handler' as any;

    beforeEach(() => {
        dropdownClickHandlerMock = Mock.ofType(DropdownClickHandler);

        dropdownClickHandlerMock.setup(acm => acm.openPreviewFeaturesPanelHandler).returns(event => openPreviewFeaturesClickHandler);

        dropdownClickHandlerMock.setup(acm => acm.openScopingPanelHandler).returns(event => openScopingPanelClickHandler);

        dropdownClickHandlerMock.setup(acm => acm.openSettingsPanelHandler).returns(event => openSettingsPanelClickHandler);
    });

    test('constructor', () => {
        const testSubject = new GearOptionsButtonComponent(null);
        expect(testSubject).toEqual(expect.anything());
    });

    type TestCase = {
        featureFlags: DictionaryStringTo<boolean>;
        expectedMenuItems: IContextualMenuItem[];
    };
    test.each([
        {
            featureFlags: {
                [FeatureFlags[FeatureFlags.scoping]]: true,
            },
            expectedMenuItems: [getSettingsFeatureMenuItem(), getPreviewFeatureMenuItem(), getScopingFeatureMenuItem()],
        },
        {
            featureFlags: {
                [FeatureFlags[FeatureFlags.scoping]]: false,
            },
            expectedMenuItems: [getSettingsFeatureMenuItem(), getPreviewFeatureMenuItem()],
        },
        {
            featureFlags: {
                [FeatureFlags[FeatureFlags.scoping]]: false,
            },
            expectedMenuItems: [getSettingsFeatureMenuItem(), getPreviewFeatureMenuItem()],
        },
        {
            featureFlags: {
                [FeatureFlags[FeatureFlags.scoping]]: true,
            },
            expectedMenuItems: [getSettingsFeatureMenuItem(), getPreviewFeatureMenuItem(), getScopingFeatureMenuItem()],
        },
    ] as TestCase[])('verify rendering with menu items: %#', (testCase: TestCase) => {
        verifyRendering(testCase.featureFlags, testCase.expectedMenuItems);
    });

    function verifyRendering(featureFlags: DictionaryStringTo<boolean>, menuItems: IContextualMenuItem[]) {
        const props: GearOptionsButtonComponentProps = {
            dropdownClickHandler: dropdownClickHandlerMock.object,
            featureFlags: featureFlags,
        };

        const dropDownProps = {
            menuItems: menuItems,
        };
        const wrapper = shallow(<GearOptionsButtonComponent {...props} />);
        const div = wrapper.find('.gear-options-button-component');
        expect(div.exists()).toBe(true);
        const dropDown = div.find(dropDownProps);
        makeDropdownAssertions(dropDown, DetailsViewDropDown);
    }

    function getScopingFeatureMenuItem(): IContextualMenuItem {
        return {
            key: 'scoping-feature',
            iconProps: {
                iconName: 'scopeTemplate',
            },
            onClick: openScopingPanelClickHandler,
            name: 'Scoping',
        };
    }

    function getPreviewFeatureMenuItem(): IContextualMenuItem {
        return {
            key: 'preview-features',
            iconProps: {
                iconName: 'giftboxOpen',
            },
            onClick: openPreviewFeaturesClickHandler,
            name: 'Preview features',
        };
    }

    function getSettingsFeatureMenuItem(): IContextualMenuItem {
        return {
            key: 'settings',
            iconProps: {
                iconName: 'gear',
            },
            onClick: openSettingsPanelClickHandler,
            name: 'Settings',
        };
    }

    function makeDropdownAssertions(dropDownWrapper: ShallowWrapper<any, any>, expectedDropdown) {
        expect(dropDownWrapper.exists()).toBe(true);
        expect(dropDownWrapper.type()).toEqual(expectedDropdown);
    }
});
