// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
/// <reference path="./iformatter.d.ts" />
/// <reference path="./heading-formatter.ts" />

import { DialogRenderer } from '../dialog-renderer';
import { IHtmlElementAxeResults } from '../scanner-utils';
import { IHeadingStyleConfiguration } from './heading-formatter';
import { FrameCommunicator } from '../frameCommunicators/frame-communicator';
import { WindowUtils } from '../../common/window-utils';
import { IDrawerConfiguration, IFormatter, IColorDrawerConfiguration } from './iformatter';

export class ColorFormatter implements IFormatter {
    public getDrawerConfiguration(): IColorDrawerConfiguration {
        const config: IColorDrawerConfiguration = {
            grayScaleClassName: 'insights-grey-scale-container',
        };
        return config;
    }

    public getDialogRenderer(): void {
        return;
    }
}
