// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Axe from 'axe-core';

export class AxeInfo {
    constructor(private axe: typeof Axe) {}
    public get version(): string {
        return this.axe.version;
    }
}
