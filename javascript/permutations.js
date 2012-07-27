// Create a new YUI instance and populate it with the required modules.
var permutator = {}; // this holds the permutate object, vars and functions
window.permutator = permutator;
YUI().use('node', 'get', 'panel', 'event', 'array-extras', 'node-event-simulate', 'json', function (Y) {
    // Node is available and ready for use. Add implementation code here.
    window.Y = Y;
    var bodyTag = Y.one('body');
    if(bodyTag.getAttribute('id') == 'page-question-type-shortanswer') {
        //console.log('Hey!  You are adding or editing a shortanswer Q.  Let me enhance that functionality for you...');

        //Build the form
        var formNode = Y.Node.create('<div id="panelContent"> \
    <div class="yui3-widget-bd"> \
    <p>This tool will output all possible combinations of those words, including partials and singles, ready for pasting into a Moodle short answer question.</p> \
    <p>Enter a few words separated by commas (e.g. lies, damned lies, statistics).  More than 4 words will probably cause your browser to crash.</p> \
    <form id="frm_permutations"> \
        <fieldset> \
            <input id="wordinput" type="text" onkeyup="window.permutator.timeAndGo();" /> \
        </fieldset> \
    </form> \
    <div id="result"></div> \
    </div></div>');

        //Add the form to the page, modal
        window.permutator.panel = new Y.Panel({
            srcNode : formNode,
            headerContent: 'Word Permutator Tool',
            zIndex       : 999,
            width   : '60%',
            centered: true,
            render  : false,
            modal : true
        });



        Y.Get.script('../local/permute.js');//, function (err) {

        /*            if (err) {

                Y.log('Error loading JS: ' + err[0].error, 'error');
                return;
            }

         */

        //Y.log('file.js loaded successfully!');
        //Y.on('domready', function(e) {

        //Y.log('domready fired');

        window.permutator.stringSeparator = '###permuteAddingFields###';

        window.permutator.setSelectedIndex = function (s, v) {
            for ( var i = 0; i < s.options.length; i++ ) {
                if ( parseFloat(s.options[i].value) == parseFloat(v) ) {
                    s.options[i].selected = true;
                    return;
                }
            }
        };

        window.permutator.addMoreAnswerFields = function() {
            Y.one('#id_answer_0').set('value', window.permutator.stringSeparator+Y.JSON.stringify(window.permutator.results));
            Y.one('#id_addanswers').simulate('click');
        }
                
        window.permutator.startupCheckEnoughAnswerFields = function() {
            if(Y.one('#id_answer_0').get('value').match('^'+window.permutator.stringSeparator)) {
                window.permutator.results = Y.JSON.parse(Y.one('#id_answer_0').get('value').slice(window.permutator.stringSeparator.length));
                        
                if(window.permutator.checkEnoughAnswerFields()) {
                    window.permutator.populateAnswers();
                }
            }
        }
                
        window.permutator.checkEnoughAnswerFields = function() {
            if(window.document.getElementById('id_fraction_'+window.permutator.results.length)==null) {
                window.permutator.addMoreAnswerFields();
                return;
            } else {
                return true;
            }
        }

        window.permutator.populateAnswers = function() {
            window.permutator.checkEnoughAnswerFields();
            for(var i=0;i<window.permutator.results.length;i++) {
                //console.log('Looking to set '+window.permutator.results[i].answer+' with grade='+window.permutator.results[i].grade);
                Y.one('#id_answer_'+i).set('value', window.permutator.results[i].answer);
                var select = window.document.getElementById('id_fraction_'+i);                        
                window.permutator.setSelectedIndex(select, window.permutator.results[i].grade);
            }
            window.permutator.panel.hide();                    
        };
                
        window.permutator.startupCheckEnoughAnswerFields();
        //});


        window.permutator.panel.addButton({
            value  : 'Use these values',
            section: Y.WidgetStdMod.FOOTER,
            action : function (e) {
                e.preventDefault();
                window.permutator.populateAnswers();
            }
        });

        window.permutator.panel.addButton({
            value  : 'Cancel',
            section: Y.WidgetStdMod.FOOTER,
            action : function (e) {
                e.preventDefault();
                window.permutator.panel.hide();
            }
        });
            
        //Build + insert the link to this new permutator functionality
        var permutatorLinkNode = Y.Node.create('<div id="permutator_launcher"><a href="#" onclick="window.permutator.panel.render();window.permutator.panel.show();return false;">Use the word list permutator...<a></div>');
        Y.one('#answerhdr_0').insert(permutatorLinkNode, 'before');
    }
});