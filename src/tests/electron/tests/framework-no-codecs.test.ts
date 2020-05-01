// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as path from 'path';
import { createAppController } from 'tests/electron/common/create-application';
import { AppController } from 'tests/electron/common/view-controllers/app-controller';
import { CodecTestViewController } from 'tests/electron/common/view-controllers/codecs-test-view-controller';

/*
We bundle a mirrored version of electron with minimal
audio/video codecs to avoid shipping proprietary codecs
we don't need in the release build. This e2e test checks
to ensure we have the right codecs. If this test fails,
it's likely node_modules/electron/dist was not replaced
with the appropriate electron mirror.
*/

const releaseTests = process.env.RUN_RELEASE_TESTS === 'true';
(releaseTests ? describe : describe.skip)(
    'electron bundled with minimal audio-video codecs',
    () => {
        let appController: AppController;
        let viewContoller: CodecTestViewController;

        beforeEach(async () => {
            appController = await createAppController(
                path.resolve(__dirname, '..', '..', 'miscellaneous', 'codecs', 'codecs-test.js'),
            );
            viewContoller = new CodecTestViewController(appController.client);
            await viewContoller.waitForAudioVisible();
        });

        afterEach(async () => await appController.stop());

        // https://html.spec.whatwg.org/multipage/media.html#error-codes:dom-mediaerror-media_err_src_not_supported
        it('has error when loading mp3 <audio> in renderer process', async () => {
            expect(await viewContoller.client.getAttribute('#audio', 'data-err')).toEqual('4');
        });
    },
);
