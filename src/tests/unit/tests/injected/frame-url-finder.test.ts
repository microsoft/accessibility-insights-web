// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { HTMLElementUtils } from 'common/html-element-utils';
import { WindowUtils } from 'common/window-utils';
import { FrameUrlFinder } from 'injected/frame-url-finder';
import { LinkedFrameMessenger } from 'tests/unit/common/linked-frame-messenger';
import { IMock, Mock } from 'typemoq';

describe(FrameUrlFinder, () => {
    let parentFrameMessenger: LinkedFrameMessenger;
    let childFrameMessenger: LinkedFrameMessenger;
    let parentFrameUrlFinder: FrameUrlFinder;
    let childFrameUrlFinder: FrameUrlFinder;
    let parentMockHtmlElementUtils: IMock<HTMLElementUtils>;
    let childMockHtmlElementUtils: IMock<HTMLElementUtils>;

    beforeEach(() => {
        [parentFrameMessenger, childFrameMessenger] = LinkedFrameMessenger.createLinkedPair();

        const parentWindowUtils = {
            getWindow: () => parentFrameMessenger.window,
        } as WindowUtils;
        const childWindowUtils = {
            getWindow: () => childFrameMessenger.window,
        } as WindowUtils;

        parentMockHtmlElementUtils = Mock.ofType<HTMLElementUtils>();
        parentMockHtmlElementUtils
            .setup(m => m.querySelector('#child-frame'))
            .returns(() => childFrameMessenger.frameElement)
            .verifiable();
        childMockHtmlElementUtils = Mock.ofType<HTMLElementUtils>();

        parentFrameUrlFinder = new FrameUrlFinder(
            parentFrameMessenger,
            parentWindowUtils,
            parentMockHtmlElementUtils.object,
        );
        parentFrameUrlFinder.initialize();
        childFrameUrlFinder = new FrameUrlFinder(
            childFrameMessenger,
            childWindowUtils,
            childMockHtmlElementUtils.object,
        );
        childFrameUrlFinder.initialize();
    });

    it('finds the current window location href at the current target level', async () => {
        parentFrameMessenger.window.location = { href: 'http://parent.frame' } as Location;

        const result = await parentFrameUrlFinder.getTargetFrameUrl(['#parent-element']);

        expect(result).toBe('http://parent.frame');
    });

    it('finds the child window location href if target points to a child', async () => {
        childFrameMessenger.window.location = { href: 'http://child.frame' } as Location;

        const result = await parentFrameUrlFinder.getTargetFrameUrl([
            '#child-frame',
            '#child-element',
        ]);

        expect(result).toBe('http://child.frame');
    });
});
