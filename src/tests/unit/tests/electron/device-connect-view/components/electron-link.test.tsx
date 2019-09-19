// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shell } from 'electron';
import { shallow } from 'enzyme';
import * as React from 'react';
import { ElectronExternalLink } from '../../../../../../electron/device-connect-view/components/electron-external-link';
import { ElectronLink } from '../../../../../../electron/device-connect-view/components/electron-link';

describe('ElectronLink', () => {
    it('renders and uses electron shell', () => {
        const wrapped = shallow(<ElectronLink href="test-href">test-text</ElectronLink>);

        expect(wrapped.getElement()).toMatchSnapshot();

        expect(wrapped.find(ElectronExternalLink).prop('shell')).toEqual(shell);
    });
});
