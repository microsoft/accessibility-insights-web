// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Shell } from 'electron';
import {
    ElectronExternalLink,
    ElectronExternalLinkProps,
} from 'electron/views/device-connect-view/components/electron-external-link';
import { shallow } from 'enzyme';
import * as React from 'react';
import { flushSettledPromises } from 'tests/common/flush-settled-promises';
import { Mock, Times } from 'typemoq';

describe('ElectronExternalLink', () => {
    const testHref = 'test-href';
    const testText = 'test-text';

    test('render', () => {
        const props: ElectronExternalLinkProps = {
            href: testHref,
            children: testText,
            shell: null,
        };

        const rendered = shallow(<ElectronExternalLink {...props} />);

        expect(rendered.getElement()).toMatchSnapshot();
    });

    test('click', async () => {
        const mockShell = Mock.ofType<Shell>();
        const mockPreventDefault = Mock.ofInstance(() => {});
        const mockStopPropagation = Mock.ofInstance(() => {});
        const mockEvent = {
            preventDefault: mockPreventDefault.object,
            stopPropagation: mockStopPropagation.object,
        } as React.MouseEvent<unknown>;

        mockShell.setup(shell => shell.openExternal(testHref)).verifiable(Times.once());
        mockPreventDefault.setup(m => m()).verifiable(Times.once());
        mockStopPropagation.setup(m => m()).verifiable(Times.once());

        const props: ElectronExternalLinkProps = {
            href: testHref,
            children: testText,
            shell: mockShell.object,
        };

        const rendered = shallow(<ElectronExternalLink {...props} />);
        rendered.simulate('click', mockEvent);

        await flushSettledPromises();

        mockShell.verifyAll();
        mockPreventDefault.verifyAll();
        mockStopPropagation.verifyAll();
    });
});
