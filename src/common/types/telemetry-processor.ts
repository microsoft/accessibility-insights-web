// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TelemetryDataFactory } from '../telemetry-data-factory';

export type TelemetryProcessor<T> = (telemetryFactory: TelemetryDataFactory) => T;
