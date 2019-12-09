// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { isEqual } from 'lodash';
import { It } from 'typemoq';

export function IsSameObject<T>(object: T): T {
    return It.is(expectedObj => isEqual(expectedObj, object));
}
