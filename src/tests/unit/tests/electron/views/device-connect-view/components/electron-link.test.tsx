// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shell } from 'electron';
import { ElectronExternalLink } from 'electron/views/device-connect-view/components/electron-external-link';
import { ElectronLink } from 'electron/views/device-connect-view/components/electron-link';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('ElectronLink', () => {
    it('renders and uses electron shell', () => {
        const wrapped = shallow(<ElectronLink href="test-href">test-text</ElectronLink>);

        expect(wrapped.getElement()).toMatchSnapshot();

        expect(wrapped.find(ElectronExternalLink).prop('shell')).toEqual(shell);
    });
});
