
(function (factory) {
    // Module systems magic dance.

    if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
        // CommonJS or Node: hard-coded dependency on "knockout"
        factory(require("knockout"), exports);
    } else if (typeof define === "function" && define["amd"]) {
        // AMD anonymous module with hard-coded dependency on "knockout"
        define(["knockout", "exports"], factory);
    } else {
        // <script> tag: use the global `ko` object, attaching a `mapping` property
        factory(ko, ko.date = {});
    }
}(function (ko, exports) {
    ko.bindingHandlers.date = {
        update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            var value = valueAccessor();
            var allBindings = allBindingsAccessor();
            var valueUnwrapped = ko.utils.unwrapObservable(value);

            // Date formats: http://momentjs.com/docs/#/displaying/format/
            var pattern = allBindings.format || 'MM/DD/YYYY';

            var output = "NA";
            if (valueUnwrapped !== null && valueUnwrapped !== undefined && valueUnwrapped.length > 0) {
                output = moment(valueUnwrapped).format(pattern);
            }

            if ($(element).is("input") === true) {
                $(element).val(output);
            } else {
                $(element).text(output);
            }
        }
    };
}));
(function (factory) {
    // Module systems magic dance.

    if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
        // CommonJS or Node: hard-coded dependency on "knockout"
        factory(require("knockout"), exports);
    } else if (typeof define === "function" && define["amd"]) {
        // AMD anonymous module with hard-coded dependency on "knockout"
        define(["knockout", "exports"], factory);
    } else {
        // <script> tag: use the global `ko` object, attaching a `mapping` property
        factory(ko, ko.time = {});
    }
}(function (ko, exports) {
    ko.bindingHandlers.time = {
        update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            var value = valueAccessor();
            var allBindings = allBindingsAccessor();
            var valueUnwrapped = ko.utils.unwrapObservable(value);
            var output = "";
            if (valueUnwrapped !== null && valueUnwrapped !== undefined && valueUnwrapped.length > 0) {
                var d = new Date(valueUnwrapped);
                output = d.toLocaleTimeString();
            }
            if ($(element).is("input") === true) {
                $(element).val(output);
            } else {
                $(element).text(output);
            }
        }
    };
}));

function toTimeAgo(dt) {
    var secs = (((new Date()).getTime() - dt.getTime()) / 1000),
        days = Math.floor(secs / 86400);
    return days === 0 && (
        secs < 60 && "just now" ||
            secs < 120 && "a minute ago" ||
            secs < 3600 && Math.floor(secs / 60) + " minutes ago" ||
            secs < 7200 && "an hour ago" ||
            secs < 86400 && Math.floor(secs / 3600) + " hours ago") ||
        days === 1 && "yesterday" ||
        days < 31 && days + " days ago" ||
        days < 60 && "one month ago" ||
        days < 365 && Math.ceil(days / 30) + " months ago" ||
        days < 730 && "one year ago" ||
        Math.ceil(days / 365) + " years ago";
};
ko.bindingHandlers.timeAgo = {
    update: function (element, valueAccessor) {
        var value = valueAccessor();
        var val = ko.utils.unwrapObservable(value()),
            date = new Date(val), // WARNING: this is not compatibile with IE8
            timeAgo = toTimeAgo(date);
        return ko.bindingHandlers.html.update(element, function () {
            return '<time datetime="' + encodeURIComponent(val) + '">' + timeAgo + '</time>';
        });
    }
};
var formatNumber = function (element, valueAccessor, allBindingsAccessor, format) {
    // Provide a custom text value
    var value = valueAccessor(), allBindings = allBindingsAccessor();
    var numeralFormat = allBindingsAccessor.numeralFormat || format;
    var strNumber = ko.utils.unwrapObservable(value);
    if (strNumber) {
        return numeral(strNumber).format(numeralFormat);
    }
    return '';
};
ko.bindingHandlers.numeraltext = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        //$(element).text(formatNumber(element, valueAccessor, allBindingsAccessor, "(0,000.00)"));
        if ($(element).val() !== 0) {
            $(element).text(formatNumber(element, valueAccessor, allBindingsAccessor, "(0,000)"));
        } else {
            $(element).text($(element).val());
        }
    },
    update: function (element, valueAccessor, allBindingsAccessor) {
        if ($(element).val() !== 0) {
            $(element).text(formatNumber(element, valueAccessor, allBindingsAccessor, "(0,000)"));
        } else {
            $(element).text($(element).val());
        }

    }
};

ko.bindingHandlers.numeralvalue = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        $(element).val(formatNumber(element, valueAccessor, allBindingsAccessor, "(0,0.00)"));

        //handle the field changing
        ko.utils.registerEventHandler(element, "change", function () {
            var observable = valueAccessor();
            observable($(element).val());
        });
    },
    update: function (element, valueAccessor, allBindingsAccessor) {
        $(element).val(formatNumber(element, valueAccessor, allBindingsAccessor, "(0,0.00)"));
    }
};

ko.bindingHandlers.percenttext = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        $(element).text(formatNumber(element, valueAccessor, allBindingsAccessor, "(0.000 %)"));
    },
    update: function (element, valueAccessor, allBindingsAccessor) {
        $(element).text(formatNumber(element, valueAccessor, allBindingsAccessor, "(0.000 %)"));
    }
};

ko.bindingHandlers.percentvalue = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        $(element).val(formatNumber(element, valueAccessor, allBindingsAccessor, "(0.000 %)"));

        //handle the field changing
        ko.utils.registerEventHandler(element, "change", function () {
            var observable = valueAccessor();
            observable($(element).val());
        });
    },
    update: function (element, valueAccessor, allBindingsAccessor) {
        $(element).val(formatNumber(element, valueAccessor, allBindingsAccessor, "(0.000 %)"));
    }
};