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
        };
        text: {
            accessibleText: Function;
            isHumanInterpretable: Function;
            sanitize: Function;
            subtreeText: Function;
        };
    };

    const VirtualNode: any;

    interface Utils {
        toArray: Function;
        matchesSelector: Function;
        getNodeFromTree: Function;
        // this must be surrounded by axe.setup and axe.teardown calls
        getSelector: (element: HTMLElement) => string;
    }
    interface Dom {
        isVisible: Function;
        idrefs: (node: HTMLElement, attr: string) => HTMLElement[];
    }
    interface Aria {
        label: Function;
        implicitRole: Function;
        getRolesByType: Function;
        lookupTable: any;
    }

    interface Text {
        accessibleText: Function;
        isHumanInterpretable: Function;
        sanitize: Function;
        subtreeText: Function;
    }

    const _audit: {
        rules: IRuleConfiguration[];
        checks: { [checkId: string]: ICheckConfiguration };
    };

    const setup: (element: HTMLElement) => void;
    const teardown: () => void;
}
