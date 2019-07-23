// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock } from 'typemoq';

import { BrowserAdapter } from '../../../../../background/browser-adapters/browser-adapter';
import {
    FileUrlUnsupportedMessagePanel,
    FileUrlUnsupportedMessagePanelProps,
} from '../../../../../popup/components/file-url-unsupported-message-panel';

describe('FileUrlUnsupportedMessagePanel', () => {
    let browserAdapterMock: IMock<BrowserAdapter>;
    const openManageExtensionPageStub = () => {};

    beforeEach(() => {
        browserAdapterMock = Mock.ofType<BrowserAdapter>();
        browserAdapterMock.setup(adapter => adapter.openManageExtensionPage).returns(() => openManageExtensionPageStub);
    });

    it('renders', () => {
        const header = <span>TEST HEADER</span>;
        const title = 'test-title';

        const props: FileUrlUnsupportedMessagePanelProps = {
            deps: {
                browserAdapter: browserAdapterMock.object,
            },
            title,
            header,
        };

        const wrapper = shallow(<FileUrlUnsupportedMessagePanel {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
