// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import { ActionButton } from 'office-ui-fabric-react/lib/Button';
import { ContextualMenu } from 'office-ui-fabric-react/lib/ContextualMenu';
import * as React from 'react';
import { IMock, Mock, Times } from 'typemoq';

import { VisualizationType } from '../../../../../common/types/visualization-type';
import { DetailsViewActionMessageCreator } from '../../../../../DetailsView/actions/details-view-action-message-creator';
import { GenericDialog } from '../../../../../DetailsView/components/generic-dialog';
import { StartOverProps, StartOverDropdown } from '../../../../../DetailsView/components/start-over-dropdown';

describe('StartOverDropdownTest', () => {
    let defaultProps: StartOverProps;
    let actionCreatorMock: IMock<DetailsViewActionMessageCreator>;

    const event = {
        currentTarget: 'test target',
    } as React.MouseEvent<any>;

    beforeEach(() => {
        actionCreatorMock = Mock.ofType<DetailsViewActionMessageCreator>();
        defaultProps = {
            testName: 'test name',
            actionMessageCreator: actionCreatorMock.object,
            test: -1 as VisualizationType,
            requirementKey: 'test key',
        };
    });

    it('render', () => {
        const rendered = shallow(<StartOverDropdown {...defaultProps} />);

        expect(rendered.debug()).toMatchSnapshot();
    });

    it('render ContextualMenu', () => {
        const rendered = shallow(<StartOverDropdown {...defaultProps} />);
        rendered.find(ActionButton).simulate('click', event);
        expect(rendered.debug()).toMatchSnapshot();
        expect(rendered.state().target).toBe(event.currentTarget);
    });

    it('render GenericDialog for start over a test', () => {
        const rendered = shallow(<StartOverDropdown {...defaultProps} />);
        rendered.find(ActionButton).simulate('click', event);
        rendered
            .find(ContextualMenu)
            .prop('items')
            .find(elem => elem.key === 'test')
            .onClick();
        expect(rendered.debug()).toMatchSnapshot();
    });

    it('render GenericDialog for start over the whole assessment', () => {
        const rendered = shallow(<StartOverDropdown {...defaultProps} />);
        rendered.find(ActionButton).simulate('click', event);
        rendered
            .find(ContextualMenu)
            .prop('items')
            .find(elem => elem.key === 'assessment')
            .onClick();
        expect(rendered.debug()).toMatchSnapshot();
    });

    it('should dissmiss the start test over dialog', () => {
        actionCreatorMock
            .setup(creator => creator.cancelStartOver(event, defaultProps.test, defaultProps.requirementKey))
            .verifiable(Times.once());

        const rendered = shallow(<StartOverDropdown {...defaultProps} />);
        rendered.find(ActionButton).simulate('click', event);
        rendered
            .find(ContextualMenu)
            .prop('items')
            .find(elem => elem.key === 'test')
            .onClick();
        rendered.find(GenericDialog).prop('onCancelButtonClick')(event);

        expect(rendered.state().dialogState).toEqual('none');
        actionCreatorMock.verifyAll();
    });

    it('should dissmiss the start assessment over dialog', () => {
        actionCreatorMock.setup(creator => creator.cancelStartOverAllAssessments(event)).verifiable(Times.once());

        const rendered = shallow(<StartOverDropdown {...defaultProps} />);
        rendered.find(ActionButton).simulate('click', event);
        rendered
            .find(ContextualMenu)
            .prop('items')
            .find(elem => elem.key === 'assessment')
            .onClick();
        rendered.find(GenericDialog).prop('onCancelButtonClick')(event);

        expect(rendered.state().dialogState).toEqual('none');
        actionCreatorMock.verifyAll();
    });

    it('should start over a test', () => {
        actionCreatorMock
            .setup(creator => creator.startOverAssessment(event, defaultProps.test, defaultProps.requirementKey))
            .verifiable(Times.once());

        const rendered = shallow(<StartOverDropdown {...defaultProps} />);
        rendered.find(ActionButton).simulate('click', event);
        rendered
            .find(ContextualMenu)
            .prop('items')
            .find(elem => elem.key === 'test')
            .onClick();
        rendered.find(GenericDialog).prop('onPrimaryButtonClick')(event);

        expect(rendered.state().dialogState).toEqual('none');
        actionCreatorMock.verifyAll();
    });

    it('should start over the whole assessment', () => {
        actionCreatorMock.setup(creator => creator.startOverAllAssessments(event)).verifiable(Times.once());

        const rendered = shallow(<StartOverDropdown {...defaultProps} />);
        rendered.find(ActionButton).simulate('click', event);
        rendered
            .find(ContextualMenu)
            .prop('items')
            .find(elem => elem.key === 'assessment')
            .onClick();
        rendered.find(GenericDialog).prop('onPrimaryButtonClick')(event);

        expect(rendered.state().dialogState).toEqual('none');
        actionCreatorMock.verifyAll();
    });

    it('should dissmiss the contextMenu', () => {
        const rendered = shallow(<StartOverDropdown {...defaultProps} />);
        rendered.find(ActionButton).simulate('click', event);
        rendered.find(ContextualMenu).prop('onDismiss')();

        expect(rendered.state().isContextMenuVisible).toBe(false);
        expect(rendered.state().target).toBeNull();
    });
});
