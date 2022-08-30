// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { createDefaultPromiseFactory } from 'common/promises/promise-factory';
import * as Playwright from 'playwright';
import { PageFunction } from 'tests/end-to-end/common/playwright-option-types';
import { DEFAULT_PAGE_ELEMENT_WAIT_TIMEOUT_MS } from '../timeouts';

const promiseFactory = createDefaultPromiseFactory();

export class Context {
    constructor(private readonly underlyingContext: Playwright.Page | Playwright.Worker) {}

    public async evaluate<R, Arg>(fn: PageFunction<Arg, R>, arg: Arg): Promise<R> {
        const timeout = DEFAULT_PAGE_ELEMENT_WAIT_TIMEOUT_MS;
        // We don't wrap this in screenshotOnError because Playwright serializes evaluate() and
        // screenshot() such that screenshot() will always time out if evaluate is still running.
        const evalPromise = this.underlyingContext.evaluate<R, Arg>(fn, arg);
        return await promiseFactory.timeout(evalPromise, timeout);
    }
}
