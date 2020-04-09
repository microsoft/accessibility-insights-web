// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import * as React from 'react';

import { ToolData } from 'common/types/store-data/unified-data-interface';
import { shallow } from 'enzyme';
import { FooterText } from 'reports/components/report-sections/footer-text';
import { FooterTextProps } from 'reports/components/report-sections/footer-text-props';

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

        const footerTextProps: FooterTextProps = {
            toolData: toolData,
        };
        const footerWrapper = shallow(<FooterText {...footerTextProps} />);
        expect(footerWrapper.getElement()).toMatchSnapshot();
    });
});
