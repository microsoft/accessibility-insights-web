// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { getRTL } from '@uifabric/utilities';
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock } from 'typemoq';

import { FeatureFlags } from '../../../../common/feature-flags';
import {
    LayeredDetailsDialogComponent,
    LayeredDetailsDialogProps,
} from '../../../../injected/layered-details-dialog-component';
import { DictionaryStringTo } from '../../../../types/common-types';

describe('LayeredDetailsDialogComponent', () => {
    let featureFlagStoreData: DictionaryStringTo<boolean>;
    let props: LayeredDetailsDialogProps;
    let getRTLMock: IMock<typeof getRTL>;

    beforeEach(() => {
        featureFlagStoreData = {};
        getRTLMock = Mock.ofInstance(() => null);

        props = createLayeredDetailsDialogProps();
    });

    it('render component when shadow dom is disabled', () => {
        featureFlagStoreData[FeatureFlags.shadowDialog] = false;

        const wrapper = shallow(<LayeredDetailsDialogComponent {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });

    test.each([true, false])('render component when shadow dom is enabled - isRTL - %p', isRTL => {
        featureFlagStoreData[FeatureFlags.shadowDialog] = true;

        getRTLMock.setup(g => g()).returns(() => isRTL);

        const wrapper = shallow(<LayeredDetailsDialogComponent {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });

    function createLayeredDetailsDialogProps(): LayeredDetailsDialogProps {
        return {
            featureFlagStoreData: featureFlagStoreData,
            deps: {
                getRTL: getRTLMock.object,
            },
            devToolActionMessageCreator: 'devToolActionMessageCreator' as any,
        } as LayeredDetailsDialogProps;
    }
});
