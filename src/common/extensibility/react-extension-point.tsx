// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { NamedFC } from '../react/named-fc';
import { AnyExtension } from './extension-point';

export type Extension<C> = {
    // tslint:disable-next-line: no-reserved-keywords
    type: 'Extension';
    extensionPointKey: string;
    extensionType: string;
    component: C;
};

type ExtensionPoint<C> = {
    // tslint:disable-next-line: no-reserved-keywords
    type: 'ExtensionPoint';
    extensionPointKey: string;
    extensionType: string;
    apply: (component: C) => Extension<C>;
};

type ReactExtension<P> = Extension<React.FC<React.PropsWithChildren<P>>> & {
    extensionType: 'reactComponent';
};

type ReactExtensionPoint<P extends {}> = ExtensionPoint<React.FC<React.PropsWithChildren<P>>> & {
    extensionType: 'reactComponent';
    create: (component: React.FC<React.PropsWithChildren<P>>) => ReactExtension<P>;
    component: React.FC<React.PropsWithChildren<P & { extensions: AnyExtension[] }>>;
};

function isReactExtension(extension: Extension<any>): extension is ReactExtension<any> {
    return (extension as AnyExtension).extensionType === 'reactComponent';
}

export function reactExtensionPoint<P extends {}>(
    extensionPointKey: string,
): ReactExtensionPoint<P> {
    const component = NamedFC<P & { extensions: Extension<any>[] }>(extensionPointKey, props => {
        const { children, extensions } = props;

        let result = <>{children}</>;

        if (extensions) {
            extensions
                .filter(isReactExtension)
                .filter(e => e.extensionPointKey === extensionPointKey)
                .forEach(e => {
                    const Outside = e.component;
                    result = <Outside {...props}>{result}</Outside>;
                });
        }

        return result;
    });

    function create(extensionComponent: React.FC<React.PropsWithChildren<P>>): ReactExtension<P> {
        const Wrap = extensionComponent;
        const wrapComponent = NamedFC<P>(extensionPointKey, props => <Wrap {...props} />);
        wrapComponent.displayName = extensionPointKey;

        return {
            type: 'Extension',
            extensionPointKey: extensionPointKey,
            extensionType: 'reactComponent',
            component: extensionComponent,
        };
    }

    return { component, extensionPointKey, create } as ReactExtensionPoint<P>;
}
