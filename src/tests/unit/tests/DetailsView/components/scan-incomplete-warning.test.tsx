// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC, ReactFCWithDisplayName } from 'common/react/named-fc';
import { ScanIncompleteWarningId } from 'common/types/scan-incomplete-warnings';
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
import { shallow } from 'enzyme';
import * as React from 'react';

describe('ScanIncompleteWarning', () => {
    let warningConfiguration: WarningConfiguration;
    let testStub: VisualizationType;

    beforeEach(() => {
        testStub = -1;

        const scanIncompleteWarningStub: ReactFCWithDisplayName<ScanIncompleteWarningMessageBarProps> =
            NamedFC<ScanIncompleteWarningMessageBarProps>('test', _ => null);
        warningConfiguration = {
            'missing-required-cross-origin-permissions': scanIncompleteWarningStub,
        };
    });

    test(`notRendered: where no warnings were provided`, () => {
        const componentProps: ScanIncompleteWarningProps = {
            warnings: [],
            warningConfiguration,
            test: testStub,
            deps: {} as ScanIncompleteWarningDeps,
        };

        const testSubject = shallow(<ScanIncompleteWarning {...componentProps} />);

        expect(testSubject.getElement()).toMatchSnapshot();
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

        const testSubject = shallow(<ScanIncompleteWarning {...componentProps} />);
        expect(testSubject.getElement()).toMatchSnapshot();
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

        const testSubject = shallow(<ScanIncompleteWarning {...componentProps} />);

        expect(testSubject.getElement()).toMatchSnapshot();
    });
});
