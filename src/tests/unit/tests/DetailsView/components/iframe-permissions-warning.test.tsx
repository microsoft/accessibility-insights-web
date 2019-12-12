// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IframePermissionsWarning, IframePermissionsWarningProps } from 'DetailsView/components/iframe-permissions-warning';
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock, Times } from 'typemoq';

describe('IframePermissionsWarning', () => {
    let onRenderMock: IMock<() => void>;

    beforeEach(() => {
        onRenderMock = Mock.ofInstance(() => {});
    });

    [
        {
            pageHasIframes: true,
            allUrlPermissionsGiven: true,
        },
        {
            pageHasIframes: false,
            allUrlPermissionsGiven: false,
        },
        {
            pageHasIframes: false,
            allUrlPermissionsGiven: true,
        },
    ].forEach(params => {
        test(`notRendered: where pageHasIframes is ${params.pageHasIframes} & allUrlPermissionsGiven is ${params.allUrlPermissionsGiven}`, () => {
            const componentProps: IframePermissionsWarningProps = {
                ...params,
                onRender: onRenderMock.object,
            };

            onRenderMock.setup(orm => orm()).verifiable(Times.never());

            const testSubject = shallow(<IframePermissionsWarning {...componentProps} />);

            expect(testSubject.getElement()).toMatchSnapshot();
            onRenderMock.verifyAll();
        });
    });

    [
        {
            pageHasIframes: true,
            allUrlPermissionsGiven: false,
        },
    ].forEach(params => {
        test(`rendered: where pageHasIframes is ${params.pageHasIframes} & allUrlPermissionsGiven is ${params.allUrlPermissionsGiven}`, () => {
            const componentProps: IframePermissionsWarningProps = {
                ...params,
                onRender: onRenderMock.object,
            };

            onRenderMock.setup(orm => orm()).verifiable(Times.once());

            const testSubject = shallow(<IframePermissionsWarning {...componentProps} />);

            expect(testSubject.getElement()).toMatchSnapshot();
            onRenderMock.verifyAll();
        });
    });
});
