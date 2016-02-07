import ko = require("knockout");
export namespace components.grid.settings {
    export enum PageView {
        Add,
        List = 1,
        Details = 2,
        EditLicense = 3,
        UpdateLicense = 4,
        ScheduleViewer = 5
    }
   
    export interface IPagerMetrics {
        limit: number;
        totalPages: number;
        totalCount: number;
        update(pageCount: number);
    }
    export class PagerMetrics implements IPagerMetrics {
        limit: number;
        totalPages: number;
        totalCount: number;
        constructor(dsLength: number) {
            var self = this;
            self.limit = 10;
            self.totalCount = dsLength;
            self.totalPages = Math.ceil(self.totalCount / self.limit);
            console.log(self.totalCount / self.limit, self.totalPages);
        }
        update(pageCount: number) {
            var self = this;
            self.limit = pageCount;
            self.totalPages = Math.ceil(self.totalCount / self.limit);
        }
    }
    export class PagerButton {
        pageIndex: KnockoutObservable<number>;
        label: KnockoutObservable<number>;
        value: KnockoutObservable<number>;
        isActive: KnockoutComputed<string>;
        constructor(ref: number, arg: number) {
            var self = this;
            self.label = ko.observable(arg);
            self.value = ko.observable(arg);
            self.pageIndex = ko.observable(ref);
            self.isActive = ko.pureComputed(
                () => self.pageIndex() === self.value() ? "active" : "no", self);
        }
    }
}