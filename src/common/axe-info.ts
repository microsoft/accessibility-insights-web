// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Axe from 'axe-core';

export class AxeInfo {
    public static get Default(): AxeInfo {
        return new AxeInfo(Axe);
    }

    constructor(private axe: typeof Axe) {}

    public get version(): string {
        return (this.axe as any).version;
    }
}
