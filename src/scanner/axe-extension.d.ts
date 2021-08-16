// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ICheckConfiguration, IRuleConfiguration } from './iruleresults';

declare module 'axe-core/axe' {
    const commons: {
        aria: {
            label: Function;
            implicitRole: Function;
            getRolesByType: Function;
            lookupTable: any;
        };
        dom: {
            isVisible: Function;
            idrefs: (node: HTMLElement, attr: string) => HTMLElement[];
        };
        text: {
            accessibleText: Function;
        };
    };

    interface Utils {
        toArray: Function;
        matchesSelector: Function;

        // this must be surrounded by axe.setup and axe.teardown calls
        getSelector: (element: HTMLElement) => string;
    }

    const _audit: {
        rules: IRuleConfiguration[];
        checks: { [checkId: string]: ICheckConfiguration };
    };

    const setup: (element: HTMLElement) => void;
    const teardown: () => void;
}
