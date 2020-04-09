// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import * as React from 'react';

import { ToolData } from 'common/types/store-data/unified-data-interface';
import { shallow } from 'enzyme';
import { FooterTextForUnified } from 'reports/components/report-sections/footer-text-for-unified';
import { FooterTextProps } from 'reports/components/report-sections/footer-text-props';

describe('FooterTextForUnified', () => {
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

        const footerTextProps: FooterTextProps = {
            toolData: toolData,
        };
        const footerWrapper = shallow(<FooterTextForUnified {...footerTextProps} />);
        expect(footerWrapper.getElement()).toMatchSnapshot();
    });
});
