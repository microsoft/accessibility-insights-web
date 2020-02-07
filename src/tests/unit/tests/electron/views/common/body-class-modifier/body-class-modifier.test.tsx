// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BodyClassModifier, BodyClassModifierProps } from 'electron/views/common/body-class-modifier/body-class-modifier';
import { PlatformInfo } from 'electron/window-management/platform-info';
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock } from 'typemoq';

describe('BodyClassModifier', () => {
    describe('renders', () => {
        let platformInfoMock: IMock<PlatformInfo>;
        let props: BodyClassModifierProps;

        beforeEach(() => {
            platformInfoMock = Mock.ofType<PlatformInfo>();

            props = {
                deps: {
                    platformInfo: platformInfoMock.object,
                },
            };
        });

        it.each([true, false])('with isMac = %s', isMacOs => {
            platformInfoMock.setup(info => info.isMac()).returns(() => isMacOs);

            const wrapped = shallow(<BodyClassModifier {...props} />);

            expect(wrapped.getElement()).toMatchSnapshot();
        });
    });
});
