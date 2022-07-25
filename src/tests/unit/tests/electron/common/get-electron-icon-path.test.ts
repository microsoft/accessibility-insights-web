// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import path from 'path';
import { FileSystemConfiguration } from 'common/configuration/file-system-configuration';
import { getElectronIconPath } from 'electron/common/get-electron-icon-path';
import { OSType } from 'electron/window-management/platform-info';
import { It, Mock, MockBehavior } from 'typemoq';

describe('getElectronIconPath', () => {
    const fakeBase = 'base';
    const fakeJoinedPath = 'fakeJoinedPath';

    it.each([
        [`.ico`, OSType.Windows],
        [`.icns`, OSType.Mac],
        [`.png`, OSType.Linux],
    ])('returns icon with extension %p', (extension: string, os: OSType) => {
        const configMock = Mock.ofType(FileSystemConfiguration, MockBehavior.Strict);
        configMock
            .setup(m => m.getOption('electronIconBaseName'))
            .returns(_ => fakeBase)
            .verifiable();

        const pathMock = Mock.ofInstance(path);
        pathMock
            .setup(m => m.join(It.isAnyString(), '..', fakeBase))
            .returns(_ => fakeJoinedPath)
            .verifiable();

        const actual = getElectronIconPath(configMock.object, os, pathMock.object);
        const expected = `${fakeJoinedPath}${extension}`;
        expect(actual).toEqual(expected);

        configMock.verifyAll();
        pathMock.verifyAll();
    });

    it.each([
        [`.ico`, OSType.Windows],
        [`.icns`, OSType.Mac],
        [`.png`, OSType.Linux],
    ])('returns undefined for undefined option', (extension: string, os: OSType) => {
        const configMock = Mock.ofType(FileSystemConfiguration, MockBehavior.Strict);
        configMock
            .setup(m => m.getOption('electronIconBaseName'))
            .returns(_ => undefined)
            .verifiable();

        const actual = getElectronIconPath(configMock.object, os);
        expect(actual).toBeUndefined();

        configMock.verifyAll();
    });
});
