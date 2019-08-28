// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { RuleConfiguration } from '../iruleresults';

const autocompleteCheckId: string = 'autocomplete';
const autocompleteRuleId: string = 'autocomplete';

export const autocompleteRuleConfiguration: RuleConfiguration = {
    checks: [
        {
            id: autocompleteCheckId,
            evaluate: evaluateAutocomplete,
        },
    ],
    rule: {
        id: autocompleteRuleId,
        selector: `input[type="text"],\
input[type="search"],\
input[type="url"],\
input[type="tel"],\
input[type="email"],\
input[type="password"],\
input[type="date"],\
input[type="date-time"],\
input[type="date-time-local"],\
input[type="range"],\
input[type="color"]`,
        any: [autocompleteCheckId],
        enabled: false,
    },
};

function evaluateAutocomplete(node: HTMLElement): boolean {
    const inputType = node.getAttribute('type');
    const autocomplete = node.getAttribute('autocomplete');

    const data = {
        inputType,
        autocomplete,
    };

    // tslint:disable-next-line:no-invalid-this
    this.data(data);

    return true;
}
