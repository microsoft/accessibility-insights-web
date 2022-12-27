// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DialogRenderer } from '../dialog-renderer';
import { Formatter, SingleTargetDrawerConfiguration } from './formatter';

export class SingleTargetFormatter implements Formatter {
    constructor(private injectedClassName: string) {}

    public getDrawerConfiguration(): SingleTargetDrawerConfiguration {
        const config: SingleTargetDrawerConfiguration = {
            injectedClassName: this.injectedClassName,
        };
        return config;
    }

    public getDialogRenderer(): DialogRenderer | null {
        return null;
    }
}
