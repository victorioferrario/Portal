
/// <reference path="../knockout/knockout.d.ts" />

interface KnockoutObservableArrayFunctions<T> {

    map<TResult>(mapping: (value: T) => TResult): KnockoutObservableArray<TResult>;
    filter(predicate: (value: T) => boolean): KnockoutObservableArray<T>;
}