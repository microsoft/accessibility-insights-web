// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as ReactShallowRenderer from 'react-test-renderer/shallow';

export function shallowRender(el): React.ReactElement<any> {
    const renderer = ReactShallowRenderer.createRenderer();
    renderer.render(el);
    return renderer.getRenderOutput();
}
