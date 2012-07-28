/**
 * This is part of the Moodle short answer word permutator
 * See https://github.com/mwithheld/Moodle-shortanswer-word-permutator
 */

// Create a new YUI instance and populate it with the required modules
var permutator = {}; // this holds the permutate object, vars and functions
window.permutator = permutator;
YUI().use('node', 'get', 'panel', 'event', 'array-extras', 'node-event-simulate', 'json', function (Y) {
    // Node is available and ready for use. Add implementation code here.
    window.Y = Y;
    var bodyTag = Y.one('body');
    if(bodyTag.getAttribute('id') == 'page-question-type-shortanswer') {
        //console.log('Hey!  You are adding or editing a shortanswer Q.  Let me enhance that functionality for you...');

        Y.Get.script('../local/permute.js');
    /* Keep for Moodle 2.3
         * Y.get.js('../local/permute.js', function (err) {
                                if (err) {

                Y.log('Error loading JS: ' + err[0].error, 'error');
                return;
            }

            Y.log('file.js loaded successfully!');

         */
    }
});