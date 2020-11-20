// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ResultsFilter } from 'common/types/results-filter';

export const automatedChecksResultsFilter: ResultsFilter = result => result.status === 'fail';
