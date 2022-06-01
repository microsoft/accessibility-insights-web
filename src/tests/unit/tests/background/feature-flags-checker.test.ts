// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {
    FeatureFlagChecker,
    getStoreProxyFeatureFlagChecker,
} from 'background/feature-flag-checker';
import { StoreProxy } from 'common/store-proxy';
import { IMock, Mock } from 'typemoq';
import { DictionaryStringTo } from 'types/common-types';

describe('FeatureFlagChecker', () => {
    describe('getStoreProxyFeatureFlagChecker', () => {
        const featureFlag = 'feature';
        let storeProxyMock: IMock<StoreProxy<DictionaryStringTo<boolean>>>;
        let testSubject: FeatureFlagChecker;

        beforeEach(() => {
            storeProxyMock = Mock.ofType<StoreProxy<DictionaryStringTo<boolean>>>();
            testSubject = getStoreProxyFeatureFlagChecker(storeProxyMock.object);
        });

        it('returns false when store is undefined', () => {
            testSubject = getStoreProxyFeatureFlagChecker(undefined);
            const result = testSubject.isEnabled(featureFlag);
            expect(result).toBe(false);
        });

        it('returns false when store state is undefined', () => {
            const result = testSubject.isEnabled(featureFlag);
            expect(result).toBe(false);
        });

        it('returns false when feature flag is false', () => {
            storeProxyMock
                .setup(s => s.getState())
                .returns(() => {
                    return { feature: false };
                });

            const result = testSubject.isEnabled(featureFlag);
            expect(result).toBe(false);
        });

        it('returns true when feature flag is true', () => {
            storeProxyMock
                .setup(s => s.getState())
                .returns(() => {
                    return { feature: true };
                });

            const result = testSubject.isEnabled(featureFlag);
            expect(result).toBe(true);
        });
    });
});
