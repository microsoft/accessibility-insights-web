// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// How long to allow an entire test to execute
//
// We want this to be greater than default timeout of puppeteer's waitFor* functions (30s),
// because test failures of the form "such and such puppeteer operation timed out" are much
// more actionable than test failures of the form "such and such test timed out".
//
// Every other default timeout should be lower than this!
export const DEFAULT_E2E_TEST_TIMEOUT_MS = 20000;

// How long to wait for a new browser instance to initialize.
export const DEFAULT_BROWSER_LAUNCH_TIMEOUT_MS = 15000;

// How long to wait for an existing page to stop churning in response to a UI action
export const DEFAULT_PAGE_ELEMENT_WAIT_TIMEOUT_MS = 5000;

// How long to wait for a new page to load in response to the UI action that launched it
export const DEFAULT_NEW_PAGE_WAIT_TIMEOUT_MS = 5000;
