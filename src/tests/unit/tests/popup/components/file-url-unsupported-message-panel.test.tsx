// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { Mock, MockBehavior, Times } from 'typemoq';

import { BrowserAdapter } from '../../../../../common/browser-adapters/browser-adapter';
import { NewTabLink } from '../../../../../common/components/new-tab-link';
import {
    FileUrlUnsupportedMessagePanel,
    FileUrlUnsupportedMessagePanelDeps,
    FileUrlUnsupportedMessagePanelProps,
} from '../../../../../popup/components/file-url-unsupported-message-panel';

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

    it('has a NewTabLink that uses createTab to open the manage extension page', () => {
        const stubExtensionPageUrl = 'protocol://extension-page';
        const browserAdapterMock = Mock.ofType<BrowserAdapter>(null, MockBehavior.Strict);
        browserAdapterMock.setup(adapter => adapter.getManageExtensionUrl()).returns(() => stubExtensionPageUrl);
        browserAdapterMock.setup(adapter => adapter.createTab(stubExtensionPageUrl)).verifiable(Times.once());

        const props: FileUrlUnsupportedMessagePanelProps = {
            deps: {
                browserAdapter: browserAdapterMock.object,
            },
            title: 'irrelevant',
            header: <>irrelevant</>,
        };

        const wrapper = shallow(<FileUrlUnsupportedMessagePanel {...props} />);

        wrapper.find(NewTabLink).simulate('click');

        browserAdapterMock.verifyAll();
    });
});
