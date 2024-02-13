// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { NewTabLink } from 'common/components/new-tab-link';
import {
    FileUrlUnsupportedMessagePanel,
    FileUrlUnsupportedMessagePanelDeps,
    FileUrlUnsupportedMessagePanelProps,
} from 'popup/components/file-url-unsupported-message-panel';
import * as React from 'react';
import { flushSettledPromises } from 'tests/common/flush-settled-promises';
import {
    mockReactComponents,
    getMockComponentClassPropsForCall,
} from 'tests/unit/mock-helpers/mock-module-helpers';
import { Mock, MockBehavior } from 'typemoq';
import { Tabs } from 'webextension-polyfill';

jest.mock('common/components/new-tab-link');

describe('FileUrlUnsupportedMessagePanel', () => {
    mockReactComponents([NewTabLink]);
    it('renders', () => {
        const header = <span>TEST HEADER</span>;
        const title = 'test-title';

        const props: FileUrlUnsupportedMessagePanelProps = {
            deps: {} as FileUrlUnsupportedMessagePanelDeps,
            title,
            header,
        };

        const wrapper = render(<FileUrlUnsupportedMessagePanel {...props} />);

        expect(wrapper.asFragment()).toMatchSnapshot();
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

        render(<FileUrlUnsupportedMessagePanel {...props} />);

        getMockComponentClassPropsForCall(NewTabLink).onClick(event);

        await flushSettledPromises();
        browserAdapterMock.verifyAll();
    });
});
