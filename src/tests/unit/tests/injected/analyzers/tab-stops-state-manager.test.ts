// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { TabStopsStateManager } from 'injected/analyzers/tab-stops-state-manager';
import { TabStopsRequirementEvaluator } from 'injected/tab-stops-requirement-evaluator';
import { TabbableElementGetter } from 'injected/tabbable-element-getter';
import { IMock } from 'typemoq';

describe(TabStopsStateManager, () => {
    let tabbableElementGetterMock: IMock<TabbableElementGetter>;
    let requirementEvaluatorMock: IMock<TabStopsRequirementEvaluator>;

    const tabbabbleElementsStub = [
        { innerText: 'tabbabble element 1' },
        { innerText: 'tabbabble element 2' },
    ] as HTMLElement[];
});
