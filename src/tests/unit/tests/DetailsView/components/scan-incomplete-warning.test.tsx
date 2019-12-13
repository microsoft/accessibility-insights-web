// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ScanIncompleteWarningId } from 'common/types/scan-incomplete-warnings';
import { ScanIncompleteWarning, ScanIncompleteWarningProps } from 'DetailsView/components/scan-incomplete-warning';
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock, Times } from 'typemoq';

describe('ScanIncompleteWarning', () => {
    let onRenderMock: IMock<() => void>;

    beforeEach(() => {
        onRenderMock = Mock.ofInstance(() => {});
    });
    test(`notRendered: where no warnings were provided`, () => {
        const componentProps: ScanIncompleteWarningProps = {
            warnings: [],
            onRender: onRenderMock.object,
        };

        onRenderMock.setup(orm => orm()).verifiable(Times.never());

        const testSubject = shallow(<ScanIncompleteWarning {...componentProps} />);

        expect(testSubject.getElement()).toMatchSnapshot();
        onRenderMock.verifyAll();
    });

    test(`rendered: where warnings were provided`, () => {
        const componentProps: ScanIncompleteWarningProps = {
            warnings: ['missing-required-cross-origin-permissions', 'missing-required-cross-origin-permissions'],
            onRender: onRenderMock.object,
        };

        onRenderMock.setup(orm => orm()).verifiable(Times.once());

        const testSubject = shallow(<ScanIncompleteWarning {...componentProps} />);
        expect(testSubject.getElement()).toMatchSnapshot();
        onRenderMock.verifyAll();
    });

    test(`rendered: where warnings were provided, with one warning not supported`, () => {
        const componentProps: ScanIncompleteWarningProps = {
            warnings: ['missing-required-cross-origin-permissions', 'not a real warning' as ScanIncompleteWarningId],
            onRender: onRenderMock.object,
        };

        onRenderMock.setup(orm => orm()).verifiable(Times.once());

        const testSubject = shallow(<ScanIncompleteWarning {...componentProps} />);

        expect(testSubject.getElement()).toMatchSnapshot();
        onRenderMock.verifyAll();
    });
});
