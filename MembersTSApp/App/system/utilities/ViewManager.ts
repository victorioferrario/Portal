import ko = require( "knockout" );
import AppContext = require( "core/AppContext" );
import IAppContext = require( "core/IAppContext" );
import IViewModel = require( "core/IViewModel" );
import Env = require( "system/events/EventCommand" );
declare var Materialize;
export module utilities.Components.Views {
    export class Settings {
        static CSS_HIDE: string = "m-hide";
    }
    export class DOM {
        static css( prop: string,
            value: string,
            dom: JQuery ) {
            dom.css( prop, value );
        }
        static add( dom: JQuery ) {
            // if()
            dom.removeClass( Settings.CSS_HIDE );
        }
        static remove( dom: JQuery , classoveride?:string) {
            if ( !dom.hasClass( classoveride !== null && classoveride !== undefined ? classoveride:Settings.CSS_HIDE ) ) {
                dom.addClass( classoveride !== null && classoveride !== undefined ? classoveride : Settings.CSS_HIDE  );
            }
        }
    }
    export interface IManager {
        //[@ modal      @]
        modal: JQuery;
        modalContent: JQuery;
        //[@ buttons    @]
        buttonNext: JQuery;
        buttonCancel: JQuery;
        buttonUpdate: JQuery;
        buttonXDetails_Next: JQuery;
        buttonXDetails_Cancel: JQuery;
        clear: () => void;
        databind: () => void;
        // state changes
        modalState: ( state: Env.system.events.LayoutCommands.ModalHR ) => void;
        buttonState: ( state: Env.system.events.LayoutCommands.FormButtonsHR ) => void;
    }
    export class Manager implements IManager {
       
         //[@ modal      @]
        modal: JQuery;
        modalContent: JQuery;
      
          //[@ buttons    @]
        buttonNext: JQuery;
        buttonCancel: JQuery;
        buttonUpdate: JQuery;
        buttonXDetails_Next: JQuery;
        buttonXDetails_Cancel: JQuery;

        constructor() {
            var self = this;
            self.databind();
        }

        clear() {
            var self = this;
            self.modal.closeModal();
            DOM.remove( self.modalContent );
            DOM.css( "display", "none", self.modal );
        }

        databind() {
            var self = this;
            // modal    
            self.modal = $( "#modalFrmManager2" );
            self.modalContent = $( "#modalContentFrmManager2" );
            self.clear();
            // buttons  
            self.buttonNext = $( "#nextCommandButton" );
            self.buttonCancel = $( "#canelCommandButton" );
            self.buttonUpdate = $( "#updateCommandButton" );
            self.buttonXDetails_Next = $( "#formButton_insert__DeaitlCommandButton" );
            self.buttonXDetails_Cancel = $( "#formButton_cancel__DeaitlCommandButton" );
        }

        modalState( state: Env.system.events.LayoutCommands.ModalHR) {
            var self = this;
            switch(state) {
                case Env.system.events.LayoutCommands.ModalHR.Close:
                    self.clear();
                    break;
                case Env.system.events.LayoutCommands.ModalHR.Reset:
                    DOM.remove(self.modal, "large");
                    break;
            }
        }

        buttonState( state: Env.system.events.LayoutCommands.FormButtonsHR ) {
            var self = this;
            console.warn(state);
            switch ( state ) {
                case Env.system.events.LayoutCommands.FormButtonsHR.Search:
                    // add      
                    DOM.add( self.buttonCancel );
                    // remove   
                    DOM.remove( self.buttonNext );
                    DOM.remove( self.buttonUpdate );
                    DOM.remove( self.buttonXDetails_Next );
                    DOM.remove( self.buttonXDetails_Cancel );
                    break;
                case Env.system.events.LayoutCommands.FormButtonsHR.SearchItems:
                    // add      
                    DOM.add( self.buttonCancel );
                    DOM.add( self.buttonNext );
                    // remove   
                    DOM.remove( self.buttonUpdate );
                    DOM.remove( self.buttonXDetails_Next );
                    DOM.remove( self.buttonXDetails_Cancel );
                    // tool tips
                    $( ".tooltipped" ).tooltip( { delay: 50 });
                    break;
                case Env.system.events.LayoutCommands.FormButtonsHR.Insert:
                    // add      
                    DOM.add( self.buttonCancel );
                    DOM.remove( self.buttonNext );
                    // remove   
                    DOM.remove( self.buttonUpdate );
                    DOM.remove( self.buttonXDetails_Next );
                    DOM.remove( self.buttonXDetails_Cancel );
                    break;
                case Env.system.events.LayoutCommands.FormButtonsHR.Details:
                    // add      
                    DOM.remove( self.buttonNext );
                    DOM.remove( self.buttonCancel );
                    // remove   
                    DOM.add( self.buttonXDetails_Next );
                    DOM.add( self.buttonXDetails_Cancel );
                    break;
                case Env.system.events.LayoutCommands.FormButtonsHR.Update:
                    DOM.add( self.buttonCancel );
                    DOM.add( self.buttonUpdate );
                    // remove   
                    DOM.remove( self.buttonNext );
                    DOM.remove( self.buttonXDetails_Next );
                    DOM.remove( self.buttonXDetails_Cancel );
                    break;
                case Env.system.events.LayoutCommands.FormButtonsHR.Reset:
                   // self.buttonState( Env.system.events.LayoutCommands.FormButtonsHR.Insert );
                    break;
            }
        }
    }
}