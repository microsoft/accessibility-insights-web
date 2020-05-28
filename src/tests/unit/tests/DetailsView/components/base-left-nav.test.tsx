// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { Mock, MockBehavior } from 'typemoq';

import {
    BaseLeftNav,
    BaseLeftNavLink,
    BaseLeftNavProps,
    onBaseLeftNavItemRender,
} from '../../../../../DetailsView/components/base-left-nav';

class TestableBaseLeftNav extends BaseLeftNav {
    public getOnNavLinkClick(): (
        event: React.MouseEvent<HTMLElement>,
        item: BaseLeftNavLink,
    ) => void {
        return this.onNavLinkClick;
    }

    public getOnRenderLink(): (link: BaseLeftNavLink) => JSX.Element {
        return this.onRenderLink;
    }
}

describe('BaseLeftNav', () => {
    it('should render', () => {
        const props: BaseLeftNavProps = {
            selectedKey: 'some key',
            links: [{} as BaseLeftNavLink],
        } as BaseLeftNavProps;

        const actual = shallow(<BaseLeftNav {...props} />);
        expect(actual.getElement()).toMatchSnapshot();
    });

    it('render side-effect: onNavLinkClick with null item', () => {
        const props = {} as BaseLeftNavProps;
        const actual = new TestableBaseLeftNav(props);

        const onLinkClickCallback = actual.getOnNavLinkClick();
        onLinkClickCallback(null, null);
    });

    it('render side-effect: onNavLinkClick with item', () => {
        const props = {} as BaseLeftNavProps;
        const actual = new TestableBaseLeftNav(props);
        const eventStub = {} as React.MouseEvent<HTMLElement>;
        const onClickNavLinkMock = Mock.ofInstance((event, item) => null, MockBehavior.Strict);
        const itemStub = {
            onClickNavLink: onClickNavLinkMock.object,
        } as BaseLeftNavLink;
        const onLinkClickCallback = actual.getOnNavLinkClick();

        onClickNavLinkMock.setup(ocnlm => ocnlm(eventStub, itemStub)).verifiable();

        onLinkClickCallback(eventStub, itemStub);

        onClickNavLinkMock.verifyAll();
    });

    it('render side-effect: onRenderLink with item', () => {
        const props = {} as BaseLeftNavProps;
        const actual = new TestableBaseLeftNav(props);
        const elemnentStub = {} as JSX.Element;
        const onRenderNavLinkMock = Mock.ofType<onBaseLeftNavItemRender>(null, MockBehavior.Strict);
        const itemStub = {
            onRenderNavLink: onRenderNavLinkMock.object,
        } as BaseLeftNavLink;
        const onRenderLinkCallback = actual.getOnRenderLink();

        onRenderNavLinkMock.setup(ocnlm => ocnlm(itemStub)).returns(() => elemnentStub);

        expect(onRenderLinkCallback(itemStub)).toEqual(elemnentStub);
    });
});
