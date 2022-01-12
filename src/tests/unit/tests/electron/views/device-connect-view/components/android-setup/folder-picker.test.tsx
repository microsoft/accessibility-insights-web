// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Logger } from 'common/logging/logger';
import { OpenDialogOptions } from 'electron';
import {
    FolderPicker,
    FolderPickerProps,
} from 'electron/views/device-connect-view/components/android-setup/folder-picker';
import { shallow } from 'enzyme';
import { PrimaryButton, TextField } from '@fluentui/react';
import * as React from 'react';
import { tick } from 'tests/unit/common/tick';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

describe('FolderPicker', () => {
    let loggerMock: IMock<Logger>;
    let props: FolderPickerProps;

    beforeEach(() => {
        loggerMock = Mock.ofType<Logger>();
        props = {
            deps: {
                showOpenFileDialog: null,
                logger: loggerMock.object,
            },
            instructionsText: 'some instructions',
            value: '/path/to/folder',
            onChange: null,
        };
    });

    it('renders per snapshot', () => {
        const rendered = shallow(<FolderPicker {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });

    it("coordinates the instructions' id with the TextField's aria-describedby", () => {
        const rendered = shallow(<FolderPicker {...props} />);
        expect(rendered.find('.instructions').prop('id')).toBe(
            rendered.find(TextField).prop('aria-describedby'),
        );
    });

    describe('onChange behavior', () => {
        let onChangeMock: IMock<typeof props.onChange>;
        let showOpenFileDialogMock: IMock<typeof props.deps.showOpenFileDialog>;
        const stubFormEvent = {} as React.FormEvent<any>;
        const stubMouseEvent = {} as React.MouseEvent<any>;

        beforeEach(() => {
            onChangeMock = Mock.ofType<typeof props.onChange>();
            props.onChange = onChangeMock.object;

            showOpenFileDialogMock = Mock.ofType<typeof props.deps.showOpenFileDialog>(
                undefined,
                MockBehavior.Strict,
            );
            props.deps.showOpenFileDialog = showOpenFileDialogMock.object;
        });

        it('invokes onChange when the TextField is changed', () => {
            const rendered = shallow(<FolderPicker {...props} />);
            rendered.find(TextField).prop('onChange')(stubFormEvent, 'new text');

            onChangeMock.verify(m => m('new text'), Times.once());
        });

        const expectedShowOpenFileDialogOptions: OpenDialogOptions = {
            properties: ['openDirectory'],
        };

        it('flows through showOpenFileDialog to onChange when browse button is clicked', async () => {
            showOpenFileDialogMock
                .setup(m => m(expectedShowOpenFileDialogOptions))
                .returns(() => Promise.resolve({ canceled: false, filePaths: ['/path/to/adb'] }))
                .verifiable(Times.once());

            const rendered = shallow(<FolderPicker {...props} />);
            rendered.find(PrimaryButton).prop('onClick')(stubMouseEvent);

            await tick();

            showOpenFileDialogMock.verifyAll();
            onChangeMock.verify(m => m('/path/to/adb'), Times.once());
        });

        // This is an unexpected case; cancellation of the dialog is not an error
        it('does not invoke onChange if showOpenFileDialog throws an error', async () => {
            const showOpenFileDialogError = new Error('mock error from showOpenFileDialog');
            showOpenFileDialogMock
                .setup(m => m(expectedShowOpenFileDialogOptions))
                .returns(() => Promise.reject(showOpenFileDialogError))
                .verifiable(Times.once());

            const rendered = shallow(<FolderPicker {...props} />);
            rendered.find(PrimaryButton).prop('onClick')(stubMouseEvent);

            await tick();

            showOpenFileDialogMock.verifyAll();
            onChangeMock.verify(m => m(It.isAny()), Times.never());
            loggerMock.verify(
                m => m.error(It.is(msg => msg.includes(showOpenFileDialogError.message))),
                Times.once(),
            );
        });

        it('does not invoke onChange if showOpenFileDialog returns in a cancelled state', async () => {
            showOpenFileDialogMock
                .setup(m => m(expectedShowOpenFileDialogOptions))
                .returns(() => Promise.resolve({ canceled: true, filePaths: ['/path/to/adb'] }))
                .verifiable(Times.once());

            const rendered = shallow(<FolderPicker {...props} />);
            rendered.find(PrimaryButton).prop('onClick')(stubMouseEvent);

            await tick();

            showOpenFileDialogMock.verifyAll();
            onChangeMock.verify(m => m(It.isAny()), Times.never());
        });

        it('does not invoke onChange if showOpenFileDialog returns without any selected folders', async () => {
            showOpenFileDialogMock
                .setup(m => m(expectedShowOpenFileDialogOptions))
                .returns(() => Promise.resolve({ canceled: false, filePaths: [] }))
                .verifiable(Times.once());

            const rendered = shallow(<FolderPicker {...props} />);
            rendered.find(PrimaryButton).prop('onClick')(stubMouseEvent);

            await tick();

            showOpenFileDialogMock.verifyAll();
            onChangeMock.verify(m => m(It.isAny()), Times.never());
        });
    });
});
