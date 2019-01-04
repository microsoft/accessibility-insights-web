// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import * as React from 'react';

import {
    ActionAndCancelButtonsComponent,
    IActionAndCancelButtonsComponentProps,
} from '../../../../DetailsView/components/action-and-cancel-buttons-component';

describe('ActionAndCancelButtonsComponent', () => {
    test('constructor', () => {
        expect(new ActionAndCancelButtonsComponent({} as IActionAndCancelButtonsComponentProps)).toBeDefined();
    });

    test('render', () => {
        const primaryButtonOnClickStub = () => {};
        const cancelButtonOnClickStub = () => {};
        const props: IActionAndCancelButtonsComponentProps = {
            isHidden: false,
            primaryButtonDisabled: false,
            primaryButtonText: 'Test',
            primaryButtonOnClick: primaryButtonOnClickStub,
            cancelButtonOnClick: cancelButtonOnClickStub,
        };
        const testSubject = new ActionAndCancelButtonsComponent(props);

        const expected = (
            <div className="action-and-cancel-buttons-component" hidden={props.isHidden}>
                <div className="button ms-Grid-col ms-sm2 action-cancel-button-col">
                    <DefaultButton
                        primary={true}
                        text={props.primaryButtonText}
                        onClick={props.primaryButtonOnClick}
                        disabled={props.primaryButtonDisabled}
                    />
                </div>
                <div className="button ms-Grid-col ms-sm2 action-cancel-button-col">
                    <DefaultButton text="Cancel" onClick={props.cancelButtonOnClick} />
                </div>
            </div>
        );

        expect(testSubject.render()).toEqual(expected);
    });
});
