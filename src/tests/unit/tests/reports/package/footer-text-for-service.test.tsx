// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ScanMetadata } from 'common/types/store-data/scan-meta-data';
import { ToolData } from 'common/types/store-data/unified-data-interface';
import { shallow } from 'enzyme';
import * as React from 'react';
import { FooterTextForService } from 'reports/package/footer-text-for-service';

describe('FooterTextForService', () => {
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
        const scanMetadata = {
            toolData,
        } as ScanMetadata;

        const FooterText = FooterTextForService('ClientService');

        const footerWrapper = shallow(<FooterText {...{ scanMetadata }} />);
        expect(footerWrapper.getElement()).toMatchSnapshot('footer');
    });
});
