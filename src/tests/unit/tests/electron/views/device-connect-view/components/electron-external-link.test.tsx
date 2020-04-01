// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Shell } from 'electron';
import {
    ElectronExternalLink,
    ElectronExternalLinkProps,
} from 'electron/views/device-connect-view/components/electron-external-link';
import { shallow } from 'enzyme';
import { Button } from 'office-ui-fabric-react';
import * as React from 'react';
import { EventStubFactory } from 'tests/unit/common/event-stub-factory';
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

    test('click', () => {
        const shellMock = Mock.ofType<Shell>();
        const eventStub = new EventStubFactory().createMouseClickEvent() as React.MouseEvent<
            Button
        >;
        shellMock.setup(shell => shell.openExternal(testHref)).verifiable(Times.once());

        const props: ElectronExternalLinkProps = {
            href: testHref,
            children: testText,
            shell: shellMock.object,
        };

        const rendered = shallow(<ElectronExternalLink {...props} />);
        rendered.simulate('click', eventStub);

        shellMock.verifyAll();
    });
});
