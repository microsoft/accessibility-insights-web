import { It } from 'typemoq';
import { isFunction as checkIsFunction } from 'lodash';

// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export const isFunction = It.is<Function>(checkIsFunction);
