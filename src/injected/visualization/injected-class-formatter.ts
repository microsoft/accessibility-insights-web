// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DialogRenderer } from '../dialog-renderer';
import { Formatter, InjectedClassDrawerConfiguration } from './formatter';
import { TargetType } from '../../common/types/target-type';

export class InjectedClassFormatter implements Formatter {
    constructor(private injectedClassName: string, private targetType = TargetType.Single) {}

    public getDrawerConfiguration(): InjectedClassDrawerConfiguration {
        const config: InjectedClassDrawerConfiguration = {
            injectedClassName: this.injectedClassName,
            targetType: this.targetType,
        };
        return config;
    }

    public getDialogRenderer(): DialogRenderer {
        return;
    }
}
