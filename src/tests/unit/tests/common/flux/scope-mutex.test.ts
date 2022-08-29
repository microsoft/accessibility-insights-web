// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ScopeMutex } from 'common/flux/scope-mutex';

describe(ScopeMutex, () => {
    const testScope = 'test_scope';

    let testSubject: ScopeMutex;

    beforeEach(() => {
        testSubject = new ScopeMutex();
    });

    it('Should not allow locking the default scope twice', () => {
        testSubject.tryLockScope();

        expect(() => testSubject.tryLockScope()).toThrowError(/.*DEFAULT_SCOPE.*/);

        testSubject.unlockScope();
    });

    it('Should not allow locking the same non-default scope twice', () => {
        testSubject.tryLockScope(testScope);

        expect(() => testSubject.tryLockScope(testScope)).toThrowError(/.*test_scope.*/);

        testSubject.unlockScope(testScope);
    });

    it.each([undefined, testScope])('Should allow locking %s scope after an unlock', scope => {
        testSubject.tryLockScope(scope);
        testSubject.unlockScope(scope);

        expect(() => testSubject.tryLockScope(scope)).not.toThrow();

        testSubject.unlockScope(scope);
    });

    it('Should allow locking different scopes consecutively', () => {
        const anotherScope = 'another_test_scope';

        testSubject.tryLockScope();
        expect(() => testSubject.tryLockScope(testScope)).not.toThrow();
        expect(() => testSubject.tryLockScope(anotherScope)).not.toThrow();

        testSubject.unlockScope();
        testSubject.unlockScope(testScope);
        testSubject.unlockScope(anotherScope);
    });
});
