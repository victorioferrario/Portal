/*
*   Knockout Validation
*   Created By Eric M. Barnard (https://github.com/ericmbarnard)
*
*   Source: https://github.com/ericmbarnard/Knockout-Validation
*   MIT License: http://www.opensource.org/licenses/MIT
*/
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
        factory(ko, ko.upload = {});
    }
}(function (ko, exports) {
    ko.bindingHandlers.fileUpload = {
        init: function (element, valueAccessor) {
            $(element).after(
                '<div id="progressBar" class="progress hidden"><div class="bar"></div><div class="percent">0%</div></div><div class="progressError"></div>');
        },
        update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var options = ko.utils.unwrapObservable(valueAccessor()),
                property = ko.utils.unwrapObservable(options.property),
                url = ko.utils.unwrapObservable(options.url);
            console.log("url:", url);
            if (property && url) {
                $(element).change(function () {
                    if (element.files.length) {
                        var $this = $(this),
                            fileName = $this.val();
                        $(element.form).ajaxSubmit({
                            url: url,
                            type: "POST",
                            headers: { "Content-Disposition": "attachment; filename=" + fileName },
                            beforeSubmit: function () {
                                $(".progress").fadeIn(100);
                                $(".progressError").hide();
                                $(".bar").width("0%");
                                $(".percent").html("0%");
                                console.log(bindingContext.$root);
                                bindingContext.$root.beforeCommand();
                            },
                            uploadProgress: function (event, position, total, percentComplete) {
                                var percentVal = percentComplete + "%";
                                $(".bar").width(percentVal);
                                $(".percent").html(percentVal);
                            },
                            success: function (data) {
                                $(".progress").hide();
                                $(".progressError").hide();
                                for (var k = 0; k < element.files.length; k++) {
                                    console.log(element.files[k]);
                                    element.files[k] = null;
                                }
                                //element.files.
                                bindingContext.$root.updateCommand(data);
                            },
                            error: function (jqXhr, textStatus, errorThrown) {
                                $(".progress").hide();
                                $("div.progressError").html(jqXhr.responseText);
                            }
                        });
                    }
                });
            }
        }
    };
}));