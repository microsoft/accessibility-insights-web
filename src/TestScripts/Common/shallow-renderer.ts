// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as ReactShallowRenderer from 'react-test-renderer/shallow';
import * as TestUtils from 'react-dom/test-utils';
import * as React from 'react';

export class ShallowRenderer {
    public static render(componentType, props): React.ReactElement<any> {
        const shallowRenderer = ReactShallowRenderer.createRenderer();
        const component = React.createElement(componentType, props);
        shallowRenderer.render(component);
        return shallowRenderer.getRenderOutput();
    }
}
