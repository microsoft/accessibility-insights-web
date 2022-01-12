// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { configure } from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import { setIconOptions } from '@fluentui/react';

configure({ adapter: new Adapter() });
setIconOptions({
    disableWarnings: true,
});
