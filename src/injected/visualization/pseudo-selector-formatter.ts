// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
/// <reference path="./iformatter.d.ts" />
/// <reference path="./heading-formatter.ts" />
import { IFormatter, IPseudoSelectorDrawerConfiguration } from './iformatter';

export class PseudoSelectorFormatter implements IFormatter {
    public getDrawerConfiguration(): IPseudoSelectorDrawerConfiguration {
        const config: IPseudoSelectorDrawerConfiguration = {
            pseudoSelectorClassName: 'pseudo-selector-style-container',
        };
        return config;
    }

    public getDialogRenderer(): void {
        return;
    }
}
