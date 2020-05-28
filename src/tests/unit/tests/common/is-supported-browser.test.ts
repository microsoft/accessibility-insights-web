// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, Mock } from 'typemoq';
import { UAParser } from 'ua-parser-js';

import { createSupportedBrowserChecker } from '../../../../common/is-supported-browser';

describe('isSupportedBrowser', () => {
    let uaParserMock: IMock<UAParser>;

    beforeEach(() => {
        uaParserMock = Mock.ofType<UAParser>();
    });

    it.each`
        testedBrowser                   | browserName    | engineName      | isSupported
        ${'Microsoft Edge'}             | ${'Edge'}      | ${'EdgeHTML'}   | ${false}
        ${'Microsoft Edge Insider Dev'} | ${'Edge'}      | ${'Blink'}      | ${true}
        ${'Chrome'}                     | ${'Chrome'}    | ${'WebKit'}     | ${true}
        ${'Firefox'}                    | ${'Firefox'}   | ${'Gecko'}      | ${true}
        ${'Ficticious Browser'}         | ${'Ficticius'} | ${'The Engine'} | ${true}
    `('checks if $testedBrowser is supported', ({ browserName, engineName, isSupported }) => {
        setGetBrowser({
            name: browserName,
        } as IUAParser.IBrowser);

        setGetEngine({
            name: engineName,
        } as IUAParser.IEngine);

        const testObject = createSupportedBrowserChecker(uaParserMock.object);

        const result = testObject();

        expect(result).toBe(isSupported);
    });

    const setGetBrowser = (browser: IUAParser.IBrowser) =>
        uaParserMock.setup(parser => parser.getBrowser()).returns(() => browser);

    const setGetEngine = (engine: IUAParser.IEngine) =>
        uaParserMock.setup(parser => parser.getEngine()).returns(() => engine);
});
