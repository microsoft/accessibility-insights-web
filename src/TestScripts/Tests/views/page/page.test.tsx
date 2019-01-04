// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { configMutator } from '../../../../common/configuration';
import { shallowRender } from '../../../../TestScripts/Common/shallow-render';
import { Page } from '../../../../views/page/page';

configMutator.setOption('extensionFullName', 'EXTENSION_NAME');

describe('page view', () => {
    it('renders', () => {
        expect(shallowRender(<Page>INSIDE</Page>)).toMatchSnapshot();
    });
});
