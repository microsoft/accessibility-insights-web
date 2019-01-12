// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ElementHandle } from 'puppeteer';

// ensure this is parsed as a module, necessary to encapsulate the expect.extend in this file
export {};

declare global {
    namespace jest {
        interface Matchers<R> {
            toHaveTextContent: (expected: string) => Promise<CustomMatcherResult>;
        }
    }
}

async function toHaveTextContent(
    this: jest.MatcherUtils,
    received: ElementHandle<Element>,
    expected: string,
): Promise<jest.CustomMatcherResult> {
    const textContentProperty = await received.getProperty('textContent');
    const textJson = await textContentProperty.jsonValue();

    if (this.isNot) {
        const pass = textJson !== expected;
        return {
            pass,
            message: () => `expected element not to have textContent '${expected}', found '${textJson}'`,
        };
    } else {
        const pass = textJson === expected;
        return {
            pass,
            message: () => `expected element to have textContent '${expected}', found '${textJson}'`,
        };
    }
}

expect.extend({
    toHaveTextContent,
});
