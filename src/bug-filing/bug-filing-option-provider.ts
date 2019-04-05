// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BugFilingOption } from './types/bug-filing-option';
export class BugFilingOptionProvider {
    constructor(private readonly options: BugFilingOption[]) {}
    public all(): BugFilingOption[] {
        return this.options.slice();
    }
}
