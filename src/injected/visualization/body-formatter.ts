// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
/// <reference path="./iformatter.d.ts" />
/// <reference path="./heading-formatter.ts" />
import { BodyDrawerConfiguration, IFormatter } from './iformatter';

export class BodyFormatter implements IFormatter {
    constructor(private injectedClassName: string) {}

    public getDrawerConfiguration(): BodyDrawerConfiguration {
        const config: BodyDrawerConfiguration = {
            injectedClassName: this.injectedClassName,
        };
        return config;
    }

    public getDialogRenderer(): void {
        return;
    }
}
