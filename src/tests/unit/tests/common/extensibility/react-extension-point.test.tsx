// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from 'enzyme';
import * as React from 'react';

import {
    Extension,
    reactExtensionPoint,
} from '../../../../../common/extensibility/react-extension-point';

describe('ReactExtensionPoint', () => {
    type Props = { title: string };

    const TestExtensionPoint = reactExtensionPoint<Props>('TestExtensionPoint');
    const OtherExtensionPoint = reactExtensionPoint<{}>('OtherExtensionPoint');
    const FakeExtensionPoint = { other: 'stuff' } as Partial<Extension<any>> as Extension<any>;

    const TestExtension = props => {
        const { title, children } = props;

        return (
            <>
                <h1>{title}</h1>
                <>{children}</>
            </>
        );
    };

    const OtherExtension = props => {
        const { children } = props;

        return (
            <>
                <h3>Other</h3>
                <>{children}</>
            </>
        );
    };

    const extensions = [
        TestExtensionPoint.create(TestExtension),
        OtherExtensionPoint.create(OtherExtension),
        FakeExtensionPoint,
    ];

    const myTitle = 'My Title';
    const myChild = 'My Child';

    function componentWithExtensions(ext): JSX.Element {
        return (
            <div>
                <TestExtensionPoint.component extensions={ext} title={myTitle}>
                    <h2>{myChild}</h2>
                </TestExtensionPoint.component>
            </div>
        );
    }

    it('renders extension when specified', () => {
        const rendered = render(componentWithExtensions(extensions));
        expect(rendered.html()).toEqual('<h1>My Title</h1><h2>My Child</h2>');
    });

    it('renders children only when not specified', () => {
        const rendered = render(componentWithExtensions([]));
        expect(rendered.html()).toEqual('<h2>My Child</h2>');
    });
});
