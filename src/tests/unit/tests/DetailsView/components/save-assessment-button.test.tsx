// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Checkbox, Dialog, PrimaryButton } from '@fluentui/react';
import * as reactHooks from '@fluentui/react-hooks';
import { useBoolean } from '@fluentui/react-hooks';
import { InsightsCommandButton } from 'common/components/controls/insights-command-button';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import {
    SaveAssessmentButton,
    SaveAssessmentButtonProps,
} from 'DetailsView/components/save-assessment-button';
import { shallow } from 'enzyme';
import * as React from 'react';
import { EventStubFactory } from 'tests/unit/common/event-stub-factory';
import { IMock, It, Mock } from 'typemoq';

jest.mock('@fluentui/react-hooks', () => ({
    __esModule: true,
    ...jest.requireActual('@fluentui/react-hooks'),
}));

describe('SaveAssessmentButton', () => {
    let propsStub: SaveAssessmentButtonProps;
    let detailsViewActionMessageCreatorMock: IMock<DetailsViewActionMessageCreator>;
    let eventStub: any;

    beforeEach(() => {
        detailsViewActionMessageCreatorMock = Mock.ofType<DetailsViewActionMessageCreator>();
        propsStub = {
            deps: { detailsViewActionMessageCreator: detailsViewActionMessageCreatorMock.object },
            download: 'download',
            href: 'url',
        };
        eventStub = new EventStubFactory().createMouseClickEvent();
    });

    it('should render per the snapshot', () => {
        const rendered = shallow(<SaveAssessmentButton {...propsStub} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });

    it('should call saveAssessment and dialog on click', async () => {
        const rendered = shallow(<SaveAssessmentButton {...propsStub} />);
        // Click "Save assessment", Dialog should be visible and telemetry event is tracked
        const saveAssessmentButton = rendered.find(InsightsCommandButton);
        detailsViewActionMessageCreatorMock.setup(m => m.saveAssessment(It.isAny())).verifiable();

        saveAssessmentButton.prop('onClick')(eventStub);
        expect(rendered.find(Dialog).props().hidden).toEqual(false);
        detailsViewActionMessageCreatorMock.verifyAll();
    });

    it('should handle onDismiss properly', () => {
        jest.spyOn(reactHooks, 'useBoolean');
        const rendered = shallow(<SaveAssessmentButton {...propsStub} />);
        // Click "Save assessment", Dialog should be visible
        const saveAssessmentButton = rendered.find(InsightsCommandButton);
        saveAssessmentButton.prop('onClick')(eventStub);
        expect(rendered.find(Dialog).props().hidden).toEqual(false);

        // Close Dialog, Dialog should be hidden
        rendered.find(PrimaryButton).simulate('click');
        expect(useBoolean).toHaveBeenCalled();
        expect(rendered.find(Dialog).props().hidden).toEqual(true);

        // Click "Save assessment" again, Dialog should be visible
        rendered.find(InsightsCommandButton).prop('onClick')(eventStub);
        expect(rendered.find(Dialog).props().hidden).toEqual(false);
    });

    it("should handle don't show again checkbox properly", () => {
        jest.spyOn(reactHooks, 'useBoolean');
        const rendered = shallow(<SaveAssessmentButton {...propsStub} />);
        // Click "Save assessment"
        const saveAssessmentButton = rendered.find(InsightsCommandButton);
        saveAssessmentButton.prop('onClick')(eventStub);

        // Click "don't show again"
        rendered.find(Checkbox).simulate('change', { target: { checked: true } });
        expect(useBoolean).toHaveBeenCalled();

        // Close dialog
        rendered.find(PrimaryButton).simulate('click');

        // Click "Save assessment" again,  Dialog should be hidden
        rendered.find(InsightsCommandButton).prop('onClick')(eventStub);
        expect(rendered.find(Dialog).props().hidden).toEqual(true);
    });
});
