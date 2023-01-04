// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BannerWarnings } from 'DetailsView/components/banner-warnings';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('BannerWarning', () => {
    test('render', () => {
        const wrapper = shallow(
            <BannerWarnings
                deps={null}
                warnings={null}
                warningConfiguration={null}
                test={null}
                visualizationStoreData={null}
            />,
        );
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
