// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ToolData } from 'common/types/store-data/unified-data-interface';
import { shallow } from 'enzyme';
import * as React from 'react';
import { FooterTextForUnified } from 'reports/components/report-sections/footer-text-for-unified';

describe('FooterText', () => {
    it('renders', () => {
        const toolData: ToolData = {
            scanEngineProperties: {
                name: 'engine-name',
                version: 'engine-version',
            },
            applicationProperties: {
                name: 'app-name',
                version: 'app-version',
                environmentName: 'environmentName',
            },
        };

        const footerWrapper = shallow(<FooterTextForUnified {...{ toolData }} />);
        expect(footerWrapper.getElement()).toMatchSnapshot();
    });
});
