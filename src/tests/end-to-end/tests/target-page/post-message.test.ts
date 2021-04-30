// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { entries, groupBy, pickBy } from 'lodash';
import { Browser } from 'tests/end-to-end/common/browser';
import { launchBrowser } from 'tests/end-to-end/common/browser-factory';
import {
    NestedIframeTargetPage,
    NestedIframeWindowMessageRecord,
    sortMessages,
} from 'tests/end-to-end/common/page-controllers/nested-iframe-target-page';
import { PopupPage } from 'tests/end-to-end/common/page-controllers/popup-page';
import {
    DEFAULT_E2E_TEST_TIMEOUT_MS,
    DEFAULT_TARGET_PAGE_SCAN_TIMEOUT_MS,
} from 'tests/end-to-end/common/timeouts';

// This file constitutes the success criteria for feat(web-postmessage)
describe('Target Page window.postMessage behavior', () => {
    let browser: Browser;
    let targetPage: NestedIframeTargetPage;
    let popupPage: PopupPage;

    beforeEach(async () => {
        browser = await launchBrowser({
            suppressFirstTimeDialog: true,
            addExtraPermissionsToManifest: 'all-origins',
        });
        targetPage = await browser.newNestedIframeTargetPage();
        popupPage = await browser.newPopupPage(targetPage);
        await popupPage.gotoAdhocPanel();
    });

    afterEach(async () => {
        await browser?.close();
    });

    // We're doing one combined test rather than an it.each(spoofingScenarios) only for performance
    // and reliability's sake; this test is unusually slow because it requires that we wait for a
    // duration rather than a specific event.
    it(
        'does not respond to spoofed messages',
        async () => {
            await enableSomeCrossFrameVisualizer();

            await targetPage.resetWindowMessageRecording();

            for (const message of spoofingScenarios) {
                await targetPage.sendWindowPostMessage(message);
            }

            await targetPage.waitForTimeout(DEFAULT_TARGET_PAGE_SCAN_TIMEOUT_MS);

            // We should see the messages we spoofed in each corresponding receiver window, but no
            // additional response messages.
            const recordedMessages = await targetPage.getRecordedWindowMessages();
            expect(sortMessages(recordedMessages)).toEqual(sortMessages(spoofingScenarios));
        },
        DEFAULT_E2E_TEST_TIMEOUT_MS + DEFAULT_TARGET_PAGE_SCAN_TIMEOUT_MS,
    );

    it(
        'does not respond to replay attacks',
        async () => {
            await targetPage.resetWindowMessageRecording();
            await enableSomeCrossFrameVisualizer();
            const messagesToEnableVisualizer = await targetPage.getRecordedWindowMessages();

            await targetPage.resetWindowMessageRecording();
            for (const message of messagesToEnableVisualizer) {
                await targetPage.sendWindowPostMessage(message);
            }

            await targetPage.waitForTimeout(DEFAULT_TARGET_PAGE_SCAN_TIMEOUT_MS);

            // We should see the messages we spoofed in each corresponding receiver window, but no
            // additional response messages.
            const messagesRecordedDuringSpoofing = await targetPage.getRecordedWindowMessages();
            expect(sortMessages(messagesRecordedDuringSpoofing)).toEqual(
                sortMessages(messagesToEnableVisualizer),
            );
        },
        DEFAULT_E2E_TEST_TIMEOUT_MS + DEFAULT_TARGET_PAGE_SCAN_TIMEOUT_MS,
    );

    it(
        'does not respond to reflected replay attacks',
        async () => {
            await targetPage.resetWindowMessageRecording();
            await enableSomeCrossFrameVisualizer();
            const legitimateMessages = await targetPage.getRecordedWindowMessages();

            await targetPage.resetWindowMessageRecording();

            const reflectedMessages = legitimateMessages.map(m => ({
                source: m.dest,
                dest: m.source,
                data: m.data,
            }));

            for (const message of reflectedMessages) {
                await targetPage.sendWindowPostMessage(message);
            }

            await targetPage.waitForTimeout(DEFAULT_TARGET_PAGE_SCAN_TIMEOUT_MS);

            // We should see the messages we spoofed in each corresponding receiver window, but no
            // additional response messages.

            const messagesRecordedDuringSpoofing = await targetPage.getRecordedWindowMessages();
            expect(sortMessages(messagesRecordedDuringSpoofing)).toEqual(
                sortMessages(reflectedMessages),
            );
        },
        DEFAULT_E2E_TEST_TIMEOUT_MS + DEFAULT_TARGET_PAGE_SCAN_TIMEOUT_MS,
    );

    // This is a regression test for a known-bad case, and verifies that we aren't sending any
    // problematic "raw" axe-core messages through window.postMessage. This intentionally doesn't
    // verify a full snapshot of each message (unit tests cover that)
    it('avoids leaking page contents in window messages', async () => {
        await targetPage.resetWindowMessageRecording();
        await enableSomeCrossFrameVisualizer();
        const recordedMessages = await targetPage.getRecordedWindowMessages();

        // Smoke test to ensure we're successfully recording at all.
        //
        // For each of [axe.ping, axe.start-scan, insights.draw], there
        // should be a request-response pair (2 messages) for each of the top-child and
        // child-grandchild relationships, ie, 3 * 2 * 2 = 12.
        expect(recordedMessages.length).toBe(12);

        // The important test (that no messages contain HTML snippets)
        const mayContainHtmlSnippet = (msg: NestedIframeWindowMessageRecord) =>
            JSON.stringify(msg.data).includes('<');

        expect(recordedMessages.filter(mayContainHtmlSnippet)).toEqual([]);
    });

    // We have some customers that normally intercept and drop unrecognized window messages. To
    // enable them to avoid dropping legitimate messages from us, we guarantee that all of our
    // messages should use a very specific signature pattern that they recognize. If this pattern
    // were to change, it would be a breaking change for those customers.
    it('includes the required stable signature in all messages', async () => {
        await targetPage.resetWindowMessageRecording();
        await enableSomeCrossFrameVisualizer();
        const recordedMessages = await targetPage.getRecordedWindowMessages();

        for (const message of recordedMessages) {
            expect(tryJsonParse(message.data)).toHaveProperty(
                'messageStableSignature',
                'e467510c-ca1f-47df-ace1-a39f7f0678c9',
            );
        }
    });

    it('does not reuse the same message data twice, even across frames', async () => {
        await targetPage.resetWindowMessageRecording();
        await enableSomeCrossFrameVisualizer();
        const recordedMessages = await targetPage.getRecordedWindowMessages();

        // The rest of this is just verifying that each element of recordedMessages.map(m => m.data)
        // is unique in a way that presents the complete set of errors if the test fails.

        const messagesByData = groupBy(recordedMessages, m => m.data);
        const repeatedMessagesByData = pickBy(messagesByData, messages => messages.length > 1);
        const pickDirectionFromMessage = (message: NestedIframeWindowMessageRecord) => ({
            source: message.source,
            dest: message.dest,
        });
        const repeatedMessagesWithDirections = entries(repeatedMessagesByData).map(
            ([data, messages]) => ({
                data,
                directions: messages.map(pickDirectionFromMessage),
            }),
        );

        expect(repeatedMessagesWithDirections).toEqual([]);
    });

    const spoofedAxeMessage = JSON.stringify({
        uuid: '00000000-0000-0000-0000-0000000000001',
        topic: 'axe.start',
        message: {
            options: {
                runOnly: ['hidden-content'],
                excludeHidden: false,
                resultTypes: ['passes', 'violations', 'incomplete', 'inapplicable'],
            },
            command: 'rules',
            parameter: null,
            context: {
                initiator: false,
                page: true,
                include: [],
                exclude: [],
            },
        },
        _respondable: true,
        _source: 'axeAPI.x.y.z',
        _axeuuid: '00000000-0000-0000-0000-0000000000002',
    });

    const spoofedInsightsPingMessage = JSON.stringify({
        messageId: '00000000-0000-0000-0000-0000000000001',
        command: 'insights.ping',
        message: null,
        messageStableSignature: 'e467510c-ca1f-47df-ace1-a39f7f0678c9',
        messageSourceId: 'Accessibility Insights for Web - Dev',
        messageVersion: '1.0.4',
    });

    const spoofedInsightsDrawMessage = JSON.stringify({
        messageId: '00000000-0000-0000-0000-0000000000001',
        command: 'insights.draw',
        message: {
            elementResults: [],
            isEnabled: false,
            featureFlagStoreData: {},
            configId: 'headings',
        },
        messageStableSignature: 'e467510c-ca1f-47df-ace1-a39f7f0678c9',
        messageSourceId: 'Accessibility Insights for Web - Dev',
        messageVersion: '1.0.4',
    });

    // The cases are based on which sending patterns legitimate messages follow
    const spoofingScenarios: NestedIframeWindowMessageRecord[] = [
        { source: 'top', dest: 'child', data: spoofedInsightsPingMessage },
        { source: 'top', dest: 'child', data: spoofedInsightsDrawMessage },
        { source: 'child', dest: 'top', data: spoofedInsightsDrawMessage },
        { source: 'grandchild', dest: 'top', data: spoofedInsightsDrawMessage },
        { source: 'top', dest: 'child', data: spoofedAxeMessage },
        { source: 'child', dest: 'top', data: spoofedAxeMessage },
    ];

    async function enableSomeCrossFrameVisualizer() {
        await popupPage.enableToggleByAriaLabel('Headings');

        await Promise.all(
            targetPage.allFrames().map(
                async frame =>
                    await frame.waitForSelector('#insights-shadow-host .insights-highlight-box', {
                        timeout: DEFAULT_TARGET_PAGE_SCAN_TIMEOUT_MS,
                    }),
            ),
        );
    }

    function tryJsonParse(maybeJsonString: any): any | null {
        if (typeof maybeJsonString !== 'string') {
            return null;
        }
        try {
            return JSON.parse(maybeJsonString);
        } catch {
            return null;
        }
    }
});
