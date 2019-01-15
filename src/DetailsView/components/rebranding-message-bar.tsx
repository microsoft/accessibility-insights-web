// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { MessageBar } from 'office-ui-fabric-react/lib/MessageBar';
import * as React from 'react';

import { NewTabLink } from '../../common/components/new-tab-link';
import { NamedSFC } from '../../common/react/named-sfc';

const url = 'https://idwebelements/GroupManagement.aspx?Group=a11yInsightsUpdates&Operation=join';

export const RebrandingMessageBar = NamedSFC('RebrandingMessageBar', () =>

    <MessageBar className="info-message-bar">
        Keros for Web has been rebranded to Accessibility Insights for Web.{' '}
        <NewTabLink href={url}>Join Accessibility Insights Updates and Discussions</NewTabLink> to receive email announcements.
    </MessageBar>);
