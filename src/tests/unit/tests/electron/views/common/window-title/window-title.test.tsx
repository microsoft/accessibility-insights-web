// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { WindowStateStoreData } from 'electron/flux/types/window-state-store-data';
import { WindowTitle, WindowTitleProps } from 'electron/views/common/window-title/window-title';
import { PlatformInfo } from 'electron/window-management/platform-info';
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock } from 'typemoq';

describe('WindowTitleTest', () => {
    let platformInfoMock: IMock<PlatformInfo>;
    let windowStateStoreData: WindowStateStoreData;
    let props: WindowTitleProps;

    beforeEach(() => {
        platformInfoMock = Mock.ofType(PlatformInfo);
        windowStateStoreData = { currentWindowState: 'maximized', routeId: 'deviceConnectView' };

        props = {
            pageTitle: 'page title 1',
            deps: { platformInfo: platformInfoMock.object },
            children: <span>logo</span>,
            actionableIcons: [<div key="key1">icon1</div>, <div key="key2">icon2</div>],
            windowStateStoreData,
        };
    });

    it('renders without actionable icons', () => {
        props.children = <span>logo</span>;
        props.actionableIcons = undefined;

        const rendered = shallow(<WindowTitle {...props} />);

        expect(rendered.getElement()).toMatchSnapshot();
    });

    it('renders nothing if fullscreen', () => {
        windowStateStoreData.currentWindowState = 'fullScreen';

        const rendered = shallow(<WindowTitle {...props} />);

        expect(rendered.getElement()).toMatchSnapshot();
    });

    it('renders nothing for mac', () => {
        platformInfoMock.setup(p => p.isMac()).returns(() => true);

        const rendered = shallow(<WindowTitle {...props} />);

        expect(rendered.getElement()).toMatchSnapshot();
    });

    it('renders with actionable icons', () => {
        const rendered = shallow(<WindowTitle {...props} />);

        expect(rendered.getElement()).toMatchSnapshot();
    });

    it('renders without children & actionable icon', () => {
        props.children = undefined;
        props.actionableIcons = undefined;

        const rendered = shallow(<WindowTitle {...props} />);

        expect(rendered.getElement()).toMatchSnapshot();
    });

    it('renders with custom class name', () => {
        props.className = 'custom-class-name';

        const rendered = shallow(<WindowTitle {...props} />);

        expect(rendered.getElement()).toMatchSnapshot();
    });

    it('renders with custom header text class name', () => {
        props.headerTextClassName = 'custom-class-name';

        const rendered = shallow(<WindowTitle {...props} />);

        expect(rendered.getElement()).toMatchSnapshot();
    });
});
