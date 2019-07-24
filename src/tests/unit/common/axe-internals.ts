// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as axe from 'axe-core';

export function setAxeGlobalTreeTo(element: HTMLElement): void {
    const axeInternals: AxeInternals = axe as any;
    axeInternals._tree = axeInternals.utils.getFlattenedTree(element);
}

type AxeInternals = {
    _tree: any;
    utils: {
        getFlattenedTree: (root: HTMLElement) => any;
    };
};
