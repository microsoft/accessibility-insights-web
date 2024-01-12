// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { BannerWarnings } from 'DetailsView/components/banner-warnings';

import * as React from 'react';

describe('BannerWarning', () => {
    test('render', () => {
        const wrapper = render(
            <BannerWarnings
                deps={null}
                warnings={null}
                warningConfiguration={null}
                test={null}
                visualizationStoreData={null}
            />,
        );
        expect(wrapper.asFragment()).toMatchSnapshot();
    });
});
