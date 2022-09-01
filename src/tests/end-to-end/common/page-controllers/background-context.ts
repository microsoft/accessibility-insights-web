// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { PageFunction } from 'tests/end-to-end/common/playwright-option-types';

export interface BackgroundContext {
    waitForInitialization(): Promise<void>;

    setHighContrastMode(enableHighContrast: boolean): Promise<void>;

    setTelemetryState(enableTelemetry: boolean): Promise<void>;

    enableFeatureFlag(flag: string): Promise<void>;

    disableFeatureFlag(flag: string): Promise<void>;

    evaluate<R, Arg>(fn: PageFunction<Arg, R>, arg: Arg): Promise<R>;

    url(): URL;
}
