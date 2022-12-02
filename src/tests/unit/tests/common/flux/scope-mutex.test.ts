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

        try {
            expect(() => testSubject.tryLockScope()).toThrowError(/.*DEFAULT_SCOPE.*/);
        } finally {
            testSubject.unlockScope();
        }
    });

    it('Should not allow locking the same non-default scope twice', () => {
        testSubject.tryLockScope(testScope);

        try {
            expect(() => testSubject.tryLockScope(testScope)).toThrowError(/.*test_scope.*/);
        } finally {
            testSubject.unlockScope(testScope);
        }
    });

    it("Should include the original scope-holder's stack in scope re-use errors", () => {
        function lockingFunctionWithSpecificName() {
            testSubject.tryLockScope();
        }
        lockingFunctionWithSpecificName();

        try {
            expect(() => testSubject.tryLockScope()).toThrowError(
                /lockingFunctionWithSpecificName/,
            );
        } finally {
            testSubject.unlockScope();
        }
    });

    it.each([undefined, testScope])('Should allow locking %s scope after an unlock', scope => {
        testSubject.tryLockScope(scope);
        testSubject.unlockScope(scope);

        try {
            expect(() => testSubject.tryLockScope(scope)).not.toThrow();
        } finally {
            testSubject.unlockScope(scope);
        }
    });

    it('Should allow locking different scopes consecutively', () => {
        const anotherScope = 'another_test_scope';

        try {
            testSubject.tryLockScope();
            expect(() => testSubject.tryLockScope(testScope)).not.toThrow();
            expect(() => testSubject.tryLockScope(anotherScope)).not.toThrow();
        } finally {
            testSubject.unlockScope();
            testSubject.unlockScope(testScope);
            testSubject.unlockScope(anotherScope);
        }
    });
});
