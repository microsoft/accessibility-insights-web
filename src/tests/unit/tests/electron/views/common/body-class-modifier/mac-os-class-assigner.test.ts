// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IsMacOsClassName, MacOsClassAssigner } from 'electron/views/common/body-class-modifier/mac-os-class-assigner';
import { PlatformInfo } from 'electron/window-management/platform-info';
import { IMock, Mock } from 'typemoq';

describe('MacOsClassAssigner', () => {
    let platformInfoMock: IMock<PlatformInfo>;

    let testSubject: MacOsClassAssigner;

    beforeEach(() => {
        platformInfoMock = Mock.ofType<PlatformInfo>();

        testSubject = new MacOsClassAssigner(platformInfoMock.object);
    });

    describe('assigns', () => {
        it('when platform is mac os', () => {
            platformInfoMock.setup(info => info.isMac()).returns(() => true);

            const result = testSubject.assign();

            expect(result).toEqual(IsMacOsClassName);
        });

        it('when platform is NOT mac os', () => {
            platformInfoMock.setup(info => info.isMac()).returns(() => false);

            const result = testSubject.assign();

            expect(result).toBeNull();
        });
    });
});
