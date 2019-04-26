// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IssueFilingService } from './types/issue-filing-service';

export class IssueFilingServiceProvider {
    constructor(private readonly services: IssueFilingService[]) {}
    public all(): IssueFilingService[] {
        return this.services.slice();
    }

    public allVisible(): IssueFilingService[] {
        return this.all().filter(service => !service.isHidden);
    }

    public forKey(key: string): IssueFilingService {
        return this.all().find(service => service.key === key);
    }
}
