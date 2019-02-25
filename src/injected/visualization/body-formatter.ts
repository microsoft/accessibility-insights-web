// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
/// <reference path="./iformatter.d.ts" />
/// <reference path="./heading-formatter.ts" />
import { IBodyDrawerConfiguration, IFormatter } from './iformatter';

export class BodyFormatter implements IFormatter {
    constructor(private injectedClassName: string) {}

    public getDrawerConfiguration(): IBodyDrawerConfiguration {
        const config: IBodyDrawerConfiguration = {
            injectedClassName: this.injectedClassName,
        };
        return config;
    }

    public getDialogRenderer(): void {
        return;
    }
}
