// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AppiumAdbCreator } from 'electron/platform/android/appium-adb-creator';
import { AppiumAdbWrapper } from 'electron/platform/android/appium-adb-wrapper';
import { AppiumAdbWrapperFactory } from 'electron/platform/android/appium-adb-wrapper-factory';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';

describe('AppiumAdbWrapperFactory tests', () => {
    let adbCreatorMock: IMock<AppiumAdbCreator>;

    beforeEach(() => {
        adbCreatorMock = Mock.ofType<AppiumAdbCreator>(undefined, MockBehavior.Strict);
    });

    it('createValidatedAdbWrapper creates without parameters if no sdkRoot is provided', async () => {
        adbCreatorMock
            .setup(m => m.createADB(undefined))
            .returns(() => null)
            .verifiable(Times.once());
        const factory = new AppiumAdbWrapperFactory(adbCreatorMock.object);

        expect(await factory.createValidatedAdbWrapper(null)).toBeInstanceOf(AppiumAdbWrapper);

        adbCreatorMock.verifyAll();
    });

    it('createValidatedAdbWrapper creates with sdkRoot if it is provided', async () => {
        const expectedSdkRoot = 'path/to/android/sdk';
        adbCreatorMock
            .setup(m => m.createADB({ sdkRoot: expectedSdkRoot }))
            .returns(() => null)
            .verifiable(Times.once());
        const factory = new AppiumAdbWrapperFactory(adbCreatorMock.object);

        expect(await factory.createValidatedAdbWrapper(expectedSdkRoot)).toBeInstanceOf(
            AppiumAdbWrapper,
        );

        adbCreatorMock.verifyAll();
    });

    it('createValidatedAdbWrapper propagates error to caller', async () => {
        const expectedMessage = 'Something bad happened';
        adbCreatorMock
            .setup(m => m.createADB(undefined))
            .throws(new Error(expectedMessage))
            .verifiable(Times.once());
        const factory = new AppiumAdbWrapperFactory(adbCreatorMock.object);

        await expect(factory.createValidatedAdbWrapper(null)).rejects.toThrowError(expectedMessage);

        adbCreatorMock.verifyAll();
    });
});
