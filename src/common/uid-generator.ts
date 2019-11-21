// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as uuid4 from 'uuid/v4';

export type UUIDGenerator = () => string;

export let generateUID: UUIDGenerator = uuid4;
