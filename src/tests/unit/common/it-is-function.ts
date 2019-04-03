// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { isFunction } from 'lodash';
import { It } from 'typemoq';

export const itIsFunction = It.is<Function>(isFunction);
