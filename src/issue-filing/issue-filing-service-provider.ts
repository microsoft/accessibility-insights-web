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
        const service = this.all().find(service => service.key === key);
        if (service == null) {
            throw new Error(`Request for issue filing service with unknown key ${key}`);
        }
        return service;
    }
}
