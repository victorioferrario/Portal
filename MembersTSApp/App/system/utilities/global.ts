export module system.utilities.global {
    export function removeSuperLoader() {
        var superAppLoader = $("#superAppLoader"),
            superAppLogo = $("#superAnimationLogo"),
            superAppText = $("#superAnimationText");
        superAppLoader.velocity(
            "fadeOut", {
                delay: 1,
                duration: 300,
                begin(elements) {
                    superAppLogo.removeClass("zoomIn animated-200-delay");
                    superAppLogo.addClass("zoomOut animated-500-delay");
                    superAppText.removeClass("fadeInDown animated-500-delay");
                    superAppText.addClass("fadeOutDown animated-500-delay");
                },
                complete(elements) {
                    $("body").removeClass("no-scroll");
                    $("#page-container").css("overflow-y", "auto!important");
                    superAppLoader.replaceWith("");
                }
            });
    }
}
    