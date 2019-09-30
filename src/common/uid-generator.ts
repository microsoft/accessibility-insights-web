// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as uuid4 from 'uuid/v4';

export type UUIDGeneratorType = () => string;

export let generateUID: UUIDGeneratorType = uuid4;
