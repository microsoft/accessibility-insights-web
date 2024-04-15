// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { MessageBar } from '@fluentui/react';
import { render } from '@testing-library/react';
import { NamedFC, ReactFCWithDisplayName } from 'common/react/named-fc';
import { ScanIncompleteWarningId } from 'common/types/store-data/scan-incomplete-warnings';
import { VisualizationType } from 'common/types/visualization-type';
import {
    ScanIncompleteWarning,
    ScanIncompleteWarningDeps,
    ScanIncompleteWarningProps,
} from 'DetailsView/components/scan-incomplete-warning';
import {
    ScanIncompleteWarningMessageBarProps,
    WarningConfiguration,
} from 'DetailsView/components/warning-configuration';
import * as React from 'react';
import { mockReactComponents } from 'tests/unit/mock-helpers/mock-module-helpers';

jest.mock('@fluentui/react');

describe('ScanIncompleteWarning', () => {
    mockReactComponents([MessageBar]);
    let warningConfiguration: WarningConfiguration;
    let testStub: VisualizationType;

    beforeEach(() => {
        testStub = -1 as VisualizationType;

        const scanIncompleteWarningStub: ReactFCWithDisplayName<ScanIncompleteWarningMessageBarProps> =
            NamedFC<ScanIncompleteWarningMessageBarProps>('test', _ => null);
        warningConfiguration = {
            'missing-required-cross-origin-permissions': scanIncompleteWarningStub,
            'frame-skipped': scanIncompleteWarningStub,
        };
    });

    test(`notRendered: where no warnings were provided`, () => {
        const componentProps: ScanIncompleteWarningProps = {
            warnings: [],
            warningConfiguration,
            test: testStub,
            deps: {} as ScanIncompleteWarningDeps,
        };

        const renderResult = render(<ScanIncompleteWarning {...componentProps} />);

        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    test(`rendered: where warnings were provided`, () => {
        const componentProps: ScanIncompleteWarningProps = {
            warnings: [
                'missing-required-cross-origin-permissions',
                'missing-required-cross-origin-permissions',
            ],
            warningConfiguration,
            test: testStub,
            deps: {} as ScanIncompleteWarningDeps,
        };

        const renderResult = render(<ScanIncompleteWarning {...componentProps} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    test(`rendered: where warnings were provided, with one warning not supported`, () => {
        const componentProps: ScanIncompleteWarningProps = {
            warnings: [
                'missing-required-cross-origin-permissions',
                'not a real warning' as ScanIncompleteWarningId,
            ],
            warningConfiguration,
            test: testStub,
            deps: {} as ScanIncompleteWarningDeps,
        };

        const renderResult = render(<ScanIncompleteWarning {...componentProps} />);

        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
