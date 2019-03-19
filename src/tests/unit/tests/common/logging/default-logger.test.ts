// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { createDefaultLogger } from '../../../../../common/logging/default-logger';

describe('createDefaultLogger', () => {
    // Normally, we would be mocking console.log/error and verifying that a call to the mock
    // happens, rather than verifying that the implementation is exactly a direct pass-through.
    // However, in this case, it is a part of the contract of the default logger that it must
    // not wrap the console.* functions at all, since wrapping them would break devtools console
    // debug display of file/line numbers to show the wrapper instead of the actual message source.
    it('should log with a direct, unwrapped call to console.log', () => {
        expect(createDefaultLogger().log).toBe(console.log);
    });

    it('should error with a direct, unwrapped call to console.error', () => {
        expect(createDefaultLogger().error).toBe(console.error);
    });
});
