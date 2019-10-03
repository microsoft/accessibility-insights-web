// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import { ActionButton, ContextualMenu } from 'office-ui-fabric-react';
import * as React from 'react';
import { IMock, Mock, Times } from 'typemoq';
import { IssueDetailsTextGenerator } from '../../../../../../background/issue-details-text-generator';
import { CardKebabMenuButton, CardKebabMenuButtonProps } from '../../../../../../common/components/cards/card-kebab-menu-button';
import { NavigatorUtils } from '../../../../../../common/navigator-utils';
import { DetailsViewActionMessageCreator } from '../../../../../../DetailsView/actions/details-view-action-message-creator';

describe('CardKebabMenuButtonTest', () => {
    let defaultProps: CardKebabMenuButtonProps;
    let actionCreatorMock: IMock<DetailsViewActionMessageCreator>;
    let navigatorMock: IMock<NavigatorUtils>;

    const event = {
        currentTarget: 'Card View',
    } as React.MouseEvent<any>;

    const data = 'The quick brown fox jumps over the lazy dog';

    beforeEach(() => {
        actionCreatorMock = Mock.ofType<DetailsViewActionMessageCreator>();
        navigatorMock = Mock.ofType<NavigatorUtils>();
        defaultProps = {
            deps: {
                windowUtils: null,
                issueDetailsTextGenerator: {
                    buildText: _ => data,
                } as IssueDetailsTextGenerator,
                detailsViewActionMessageCreator: actionCreatorMock.object,
                navigator: navigatorMock.object,
            },
        } as CardKebabMenuButtonProps;
    });

    it('render', () => {
        const rendered = shallow(<CardKebabMenuButton {...defaultProps} />);

        expect(rendered.getElement()).toMatchSnapshot();
    });

    it('render ContextualMenu', () => {
        const rendered = shallow<CardKebabMenuButton>(<CardKebabMenuButton {...defaultProps} />);
        rendered.find(ActionButton).simulate('click', event);
        expect(rendered.getElement()).toMatchSnapshot();
        expect(rendered.state().target).toBe(event.currentTarget);
    });

    // it('should click copy failure details and show the toast', () => {
    //     actionCreatorMock.setup(creator => creator.copyIssueDetailsClicked(event)).verifiable(Times.once());
    //     navigatorMock.setup(navigator => navigator.copyToClipboard(data)).verifiable(Times.once());

    //     const rendered = shallow<CardKebabMenuButton>(<CardKebabMenuButton {...defaultProps} />);

    //     rendered.find(ActionButton).simulate('click', event);

    //     rendered
    //         .find(ContextualMenu)
    //         .prop('items')
    //         .find(elem => elem.key === 'copyfailuredetails')
    //         .onClick();

    //     expect(rendered.getElement()).toMatchSnapshot();
    //     actionCreatorMock.verifyAll();
    //     navigatorMock.verifyAll();
    // });

    it('should dismiss the contextMenu', () => {
        const rendered = shallow<CardKebabMenuButton>(<CardKebabMenuButton {...defaultProps} />);
        rendered.find(ActionButton).simulate('click', event);
        rendered.find(ContextualMenu).prop('onDismiss')();

        expect(rendered.state().isContextMenuVisible).toBe(false);
        expect(rendered.state().target).toBeNull();
    });
});
