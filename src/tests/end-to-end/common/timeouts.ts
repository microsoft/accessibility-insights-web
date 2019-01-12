// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// We want this to be greater than default timeout of puppeteer's waitFor* functions (30s),
// because test failures of the form "such and such puppeteer operation timed out" are much
// more actionable than test failures of the form "such and such test timed out".
export const E2E_TEST_TIMEOUT = 60000;
export const DEFAULT_PAGE_ELEMENT_WAIT_TIMEOUT_MS = 500;