// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { setIconOptions } from '@fluentui/react';
import { configure } from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
setIconOptions({
    disableWarnings: true,
});
