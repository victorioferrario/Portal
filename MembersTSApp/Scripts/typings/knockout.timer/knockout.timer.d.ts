/// <reference path="../knockout/knockout.d.ts" />

   /// <param name="timeLimit" type="integer">Time limit of the timer's countdown (in seconds). Default value is 60.</param>
    /// <param name="options" type="Object">
    /// <para> ---------------------------------------------- </para>
    /// <para> wait:Boolean -> Wait for "start" method to be called or start countdown on Timer's instantiation? False by default. </para>
    /// <para> ---------------------------------------------- </para>            
    /// <para> keepGoing:ko.observable/ko.computed/function -> Delegate that's used to check whether the timer must keep going or stop after each tick. </para>
    /// <para> ---------------------------------------------- </para>
    /// <para> callback:function -> Optional function that will be executed when the countdown reaches zero. </para>
    /// <para> ---------------------------------------------- </para>
    /// <para> notifyTimeMarks:Array -> Optional array of integer time marks (in seconds) that must trigger a 'timeMarkHit' event from the timer. </para>
    /// <para> ---------------------------------------------- </para>
    /// </param>
    /// <returns type="Object">A Timer object instance.</returns>


interface KnockoutTimer {
    timeLimit:number;
    options<T>(wait: boolean, keepGoing: KnockoutStatic, callback: Function, notifyTimeMarks: Array<number>): KnockoutTimer;
}

interface KnockoutStatic {
    timer: KnockoutTimer;
}