// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { flushResolvedPromises } from './flush-resolved-promises';

// This is here to force Jest to flush any pending resolved Promises that a test might
// have forgotten to handle *before* Jest considers that test to be completed. That way,
// if a test leaks a Promise, the resulting error message gets logged as a failure in the
// responsible test and includes a nice, Jest-formatted stack, instead of test "passing"
// and the error as a Node UnhandledProjmiseRejectionWarning with no stack or test context.
//
// See https://github.com/facebook/jest/issues/10784#issuecomment-988400890
afterEach(flushResolvedPromises);
