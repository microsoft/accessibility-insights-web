// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Formatter, SingleTargetDrawerConfiguration } from './formatter';

export class SingleTargetFormatter implements Formatter {
    constructor(private injectedClassName: string) {}

    public getDrawerConfiguration(): SingleTargetDrawerConfiguration {
        const config: SingleTargetDrawerConfiguration = {
            injectedClassName: this.injectedClassName,
        };
        return config;
    }

    public getDialogRenderer(): void {
        return;
    }
}
