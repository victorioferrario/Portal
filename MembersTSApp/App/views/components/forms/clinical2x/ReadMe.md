
# Notes Component
The component contains the core elements to insert & editing notes. What actualy gets implemented is a secondary template structure that wraps the component between splitters, to give the form style.

*Notes component has two templates for different states*
##   Notes Component  
        <script type="text/html" id="template_health_records_combination___splitter__notes__splitter">
            <!-- ko template:{ name:'template_health_records__field___splitter'} --><!-- /ko -->
            <!-- ko template:{ name:'template_health_records_note__add', data:$data}--><!--/ko-->
            <!-- ko template:{ name:'template_health_records__field___splitter'} --><!-- /ko -->
        </script>
     
##   Notes / Active Record Component
        <script type="text/html" id="template_health_records_combination___notes___active">
            <!-- ko template:{ name:'template_health_records__field___splitter'} --><!-- /ko -->
            <!-- ko template:{ name:'template_health_records_note__edit', data:$data}--><!--/ko-->
            <!-- ko template:{ name:'template_health_records__field___splitter'} --><!-- /ko -->
            <!-- ko template:{ name:'template_health_records_active'}--><!-- /ko -->
         </script>
     

##   Html Template
          <script type="text/html" id="template_health_records_note__add">
            <div class="field" id="divAddNote" style="margin-bottom: 10px;">
                <a href="javascript:void(0);"
                   class="btn btn-flat blue white-text"
                   data-bind="click:function(data,event){ return $root.showNotes(data,event);}">+ Add Note</a>
            </div>
            <div class="field fadeIn animated-200-delay m-hide" id="divNote" style="margin-top: 10px; position: relative;">
                <label>
                    Notes
                </label>
                <a href="javascript:void(0)"
                   data-bind="click:function(data,event){ return $root.hideNotes(data,event);}"
                   style="position: absolute; right: 10px; top: 55px;">
                    <i class="material-icons red-text ">
                        delete
                    </i>
                </a>
                <textarea data-bind="value:$data.Notes,valueUpdate:'keypress'" style="height: 80px !important;"></textarea>
            </div>
        </script>
        <!-- For editing use template name: 'template_health_records_note__edit'-->
   
To learn more about the markdown syntax, refer to these links:
 - [Markdown Syntax Guide](http://daringfireball.net/projects/markdown/syntax)
