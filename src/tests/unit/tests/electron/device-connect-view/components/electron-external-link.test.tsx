// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Shell } from 'electron';
import { ElectronExternalLink, ElectronExternalLinkProps } from 'electron/device-connect-view/components/electron-external-link';
import { shallow } from 'enzyme';
import { Button } from 'office-ui-fabric-react/lib/Button';
import * as React from 'react';
import { EventStubFactory } from 'tests/unit/common/event-stub-factory';
import { IMock, It, Mock } from 'typemoq';

describe('ElectronExternalLinkTest', () => {
    test('render', () => {
        const props: ElectronExternalLinkProps = {
            href: 'www.bing.com',
            children: 'Bing',
            shell: null,
        };

        const rendered = shallow(<ElectronExternalLink {...props} />);

        expect(rendered.getElement()).toMatchSnapshot();
    });

    test('click', () => {
        const renderMock: IMock<Shell> = Mock.ofType<Shell>();
        const eventStub = new EventStubFactory().createMouseClickEvent() as React.MouseEvent<Button>;
        const href = 'www.bing.com';
        renderMock.setup(r => r.openExternal(It.isValue(href))).verifiable();

        const props: ElectronExternalLinkProps = {
            href: href,
            children: 'Bing',
            shell: renderMock.object,
        };

        const rendered = shallow(<ElectronExternalLink {...props} />);
        rendered.simulate('click', eventStub);

        renderMock.verifyAll();
    });
});
