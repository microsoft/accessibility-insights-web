// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { NewTabLink } from 'common/components/new-tab-link';
import { shallow } from 'enzyme';
import {
    FileUrlUnsupportedMessagePanel,
    FileUrlUnsupportedMessagePanelDeps,
    FileUrlUnsupportedMessagePanelProps,
} from 'popup/components/file-url-unsupported-message-panel';
import * as React from 'react';
import { flushSettledPromises } from 'tests/common/flush-settled-promises';
import { Mock, MockBehavior } from 'typemoq';
import { Tabs } from 'webextension-polyfill';

describe('FileUrlUnsupportedMessagePanel', () => {
    it('renders', () => {
        const header = <span>TEST HEADER</span>;
        const title = 'test-title';

        const props: FileUrlUnsupportedMessagePanelProps = {
            deps: {} as FileUrlUnsupportedMessagePanelDeps,
            title,
            header,
        };

        const wrapper = shallow(<FileUrlUnsupportedMessagePanel {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('has a NewTabLink that uses createActiveTab to open the manage extension page', async () => {
        const stubExtensionPageUrl = 'protocol://extension-page';
        const browserAdapterMock = Mock.ofType<BrowserAdapter>(null, MockBehavior.Strict);
        browserAdapterMock
            .setup(adapter => adapter.getManageExtensionUrl())
            .returns(() => stubExtensionPageUrl);
        browserAdapterMock
            .setup(adapter => adapter.createActiveTab(stubExtensionPageUrl))
            .returns(() => Promise.resolve({} as Tabs.Tab));

        const props: FileUrlUnsupportedMessagePanelProps = {
            deps: {
                browserAdapter: browserAdapterMock.object,
            },
            title: 'irrelevant',
            header: <>irrelevant</>,
        };

        const wrapper = shallow(<FileUrlUnsupportedMessagePanel {...props} />);

        wrapper.find(NewTabLink).simulate('click');

        await flushSettledPromises();
        browserAdapterMock.verifyAll();
    });
});
