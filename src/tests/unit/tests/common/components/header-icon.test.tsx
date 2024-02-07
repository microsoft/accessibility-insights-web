// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import * as React from 'react';

import { BrandBlue } from '../../../../../../src/icons/brand/blue/brand-blue';
import { BrandWhite } from '../../../../../../src/icons/brand/white/brand-white';
import {
    HeaderIconComponent,
    HeaderIconDeps,
    HeaderIconProps,
} from '../../../../../common/components/header-icon';
import { mockReactComponents } from '../../../mock-helpers/mock-module-helpers';

jest.mock('../../../../../../src/icons/brand/blue/brand-blue');
jest.mock('../../../../../../src/icons/brand/white/brand-white');
describe('HeaderIconComponent', () => {
    mockReactComponents([BrandBlue, BrandWhite]);
    let props: HeaderIconProps;

    beforeEach(() => {
        props = {
            deps: {
                storeActionMessageCreator: null,
                storesHub: null,
            } as HeaderIconDeps,
            storeState: {
                userConfigurationStoreData: {
                    enableHighContrast: null,
                },
            },
        } as HeaderIconProps;
    });

    describe('renders', () => {
        describe.each([true, false, undefined])('with invertColors = %s', invertColors => {
            it.each([true, false])('and high contrast mode = %s', enableHighContrast => {
                props.invertColors = invertColors;
                props.storeState.userConfigurationStoreData.enableHighContrast = enableHighContrast;
                const renderResult = render(<HeaderIconComponent {...props} />);
                expect(renderResult.asFragment()).toMatchSnapshot();
            });
        });
    });
});
