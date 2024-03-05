// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { ScanMetadata, ToolData } from 'common/types/store-data/unified-data-interface';
import * as React from 'react';
import { ToolLink } from 'reports/components/report-sections/tool-link';
import { FooterTextForService } from 'reports/package/footer-text-for-service';
import { mockReactComponents } from 'tests/unit/mock-helpers/mock-module-helpers';

jest.mock('reports/components/report-sections/tool-link');
describe('FooterTextForService', () => {
 mockReactComponents([ToolLink]);
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
                resolution: '800x600',
            },
        };
        const scanMetadata = {
            toolData,
        } as ScanMetadata;


        const renderResult = render(<FooterTextForService  {...{ scanMetadata }} />);
        expect(renderResult.asFragment()).toMatchSnapshot('footer');
    });
});
