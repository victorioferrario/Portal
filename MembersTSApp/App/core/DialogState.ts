export module core {
    export class DialogStateTracker {
        isDialogDependents: boolean = false;
        closeDependentDialog() {
            var self = this;
            self.isDialogDependents = false;
            $( ".modal-content" ).addClass( "m-hide" );
            $( "#modalFrmManager4" ).closeModal();
            $( "#modalFrmManager4" ).css( "display", "none" );
        }
    }
}