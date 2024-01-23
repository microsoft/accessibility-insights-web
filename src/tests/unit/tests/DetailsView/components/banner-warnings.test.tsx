// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { BannerWarnings } from 'DetailsView/components/banner-warnings';
import { InjectionFailedWarning } from 'DetailsView/components/injection-failed-warning';
import { ScanIncompleteWarning } from 'DetailsView/components/scan-incomplete-warning';

import * as React from 'react';
import { mockReactComponents } from 'tests/unit/mock-helpers/mock-module-helpers';

jest.mock('DetailsView/components/scan-incomplete-warning');
jest.mock('DetailsView/components/injection-failed-warning')

describe('BannerWarning', () => {
    mockReactComponents([ScanIncompleteWarning, InjectionFailedWarning]);
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
