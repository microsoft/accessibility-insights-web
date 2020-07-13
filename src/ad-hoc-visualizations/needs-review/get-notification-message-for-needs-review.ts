// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ScanIncompleteWarningId } from 'common/types/scan-incomplete-warnings';
import { isEmpty } from 'lodash';
import { DictionaryStringTo } from 'types/common-types';

export const getNotificationMessage = (
    selectorMap: DictionaryStringTo<any>,
    warnings: ScanIncompleteWarningId[],
) => {
    if (isEmpty(selectorMap) && isEmpty(warnings)) {
        return 'Congratulations!\n\nNeeds review found no instances to review on this page.';
    }

    let baseMessage = 'No instances to review found.';

    if (!isEmpty(selectorMap)) {
        baseMessage = 'Needs review found instances to review.';
    }

    const prefix = getMessagePrefix(warnings);

    return `${prefix}${baseMessage}`;
};

const getMessagePrefix = (warnings: ScanIncompleteWarningId[]): string => {
    if (warnings.indexOf('missing-required-cross-origin-permissions') >= 0) {
        return 'There are iframes in the target page. Use FastPass or Assessment to provide additional permissions.\n';
    }

    return '';
};
