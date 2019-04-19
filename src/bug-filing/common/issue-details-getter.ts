import { EnvironmentInfo } from '../../common/environment-info-provider';
import { CreateIssueDetailsTextData } from '../../common/types/create-issue-details-text-data';
import { IssueUrlCreationUtils } from './issue-filing-url-string-utils';
export type IssueDetailsGetter = (
    stringUtils: IssueUrlCreationUtils,
    environmentInfo: EnvironmentInfo,
    data: CreateIssueDetailsTextData,
) => string;
