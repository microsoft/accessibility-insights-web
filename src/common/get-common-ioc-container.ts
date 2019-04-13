// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import 'reflect-metadata';

import { Container } from 'inversify';

let container = new Container({ autoBindInjectable: true });

export function getCommonIocContainer(): Container {
    return container;
}
