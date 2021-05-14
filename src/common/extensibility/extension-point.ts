// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { keys } from 'lodash';
import { Extension as ReactExtension } from './react-extension-point';

// tslint:disable-next-line: no-reserved-keywords
export type AnyExtension = { type: 'Extension'; extensionType: string } & (
    | Extension<string, string, any, any>
    | ReactExtension<any>
);

type Extension<TYPE extends string, KEY extends string, EXT extends {}, OUT extends {}> = {
    // tslint:disable-next-line: no-reserved-keywords
    type: 'Extension';
    extensionType: TYPE;
    extensionPoint: ExtensionPoint<TYPE, KEY, EXT, OUT>;
    component: Partial<EXT>;
};

type ApplyAllExtensions<EXT, OUT> = (list: Partial<EXT>[]) => OUT;

export class ExtensionPoint<
    TYPE extends string,
    KEY extends string,
    EXT extends {},
    OUT extends {},
> {
    constructor(
        private readonly extensionType: TYPE,
        private readonly extensionPointKey: KEY,
        private readonly base: EXT,
        private readonly applyAllExtensions: ApplyAllExtensions<EXT, OUT>,
    ) {}

    public define(component: Partial<EXT>): Extension<TYPE, KEY, EXT, OUT> {
        return {
            type: 'Extension',
            extensionType: this.extensionType,
            extensionPoint: this,
            component,
        };
    }

    private applicable(ext: any): ext is Extension<TYPE, KEY, EXT, OUT> {
        return (
            ext &&
            ext.type === 'Extension' &&
            ext.extensionPoint &&
            ext.extensionPoint.extensionType === this.extensionType &&
            ext.extensionPoint.extensionPointKey === this.extensionPointKey
        );
    }

    public apply(extensions: (AnyExtension | {})[]): OUT {
        const possibleExtensions = extensions || [];

        const applicableExtensions = possibleExtensions.filter(ext =>
            this.applicable(ext),
        ) as Extension<TYPE, KEY, EXT, OUT>[];

        const components = applicableExtensions.map(e => e.component);

        return this.applyAllExtensions([this.base, ...components]);
    }
}

export function createCallChainExtensionPoint<KEY extends string, EXT extends {}>(
    extensionPointKey: KEY,
    base: EXT,
): ExtensionPoint<'CallChain', KEY, EXT, EXT> {
    function applyAllExtensions(list: Partial<EXT>[]): EXT {
        const fnKeys = keys(base);

        const combined = {} as Partial<EXT>;

        fnKeys.forEach(key => {
            const calls = list.map(ext => ext[key]).filter(ext => ext);

            combined[key] = (...args) => {
                calls.forEach(fn => fn(...args));
            };
        });

        return combined as EXT;
    }

    return new ExtensionPoint('CallChain', extensionPointKey, base, applyAllExtensions);
}
