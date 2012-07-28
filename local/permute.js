        permutator = window.permutator;
        //used to temporarily store the value during page refreshes reqd for adding empty answer fields
        permutator.stringSeparator = '###permuteAddingFields###';
        permutator.tabs = 0;
        permutator.debug = false;
        permutator.timeout;

        //Build the form
        var formNode = Y.Node.create('<div id="permutator_panel"> \
    <div class="yui3-widget-bd"> \
    <p>This tool will output all possible combinations of those words, including partials and singles, ready for pasting into a Moodle short answer question.</p> \
    <p>Enter a few words separated by commas (e.g. lies, damned lies, statistics).  More than 4 words will probably cause your browser to crash.</p> \
    <form id="frm_permutations"> \
        <fieldset> \
            <span>Word list:&nbsp;&nbsp;<input id="permutator_input" size="40" type="text" onkeyup="window.permutator.timeAndGo();" /></span> \
            <span style="float:right">Limit to grades above&nbsp;&nbsp;<input id="permutator_limit" size="2" maxlength="2" type="text" onkeyup="window.permutator.limitResults();" />%</span> \
        </fieldset> \
    </form> \
    <div id="permutator_output"></div> \
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
        
        permutator.input=document.getElementById('permutator_input');
        permutator.limit=document.getElementById('permutator_limit');
        permutator.output=document.getElementById('permutator_output');

        /**
        * Utility functions============================================================
        */
       
       /**
        * Reduce an array to unique values
        */
        permutator.unique = function(arr) {
            var o = {}, i, l = arr.length, r = [];
            for(i=0; i<l;i+=1) o[arr[i]] = arr[i];
            for(i in o) r.push(o[i]);
            return r;
        };

       /**
        * Recursive flatten each sub-array in the array to a string
        */
        permutator.flatten = function (array){
            if(!permutator.is_array(array)) {
                return array;
            }
            var flat = [];
            for (var i = 0, l = array.length; i < l; i++){
                var type = Object.prototype.toString.call(array[i]).split(' ').pop().split(']').shift().toLowerCase();
                if (type) {
                    flat = flat.concat(/^(array|collection|arguments|object)$/.test(type) ? permutator.flatten(array[i]) : array[i]);
                }
            }
            return flat;
        }
        
       /**
        * Tab output for easier reading of recursive debugging
        */
        permutator.tabIt = function () {
            var tabSpace = '';
            var tab = '&nbsp;&nbsp;&nbsp;&nbsp;';
            for(i=0;i<permutator.tabs;i++) {
                tabSpace += tab;
            }
            return tabSpace;
        }

       /**
        * Print out an array
        * @note JSON.stringify compatibility is outlined at http://caniuse.com/json
        */
        permutator.print_r = function (array) {
            return JSON.stringify(array);
        }

        //@source http://andrewpeace.com/javascript-is-array.html
        permutator.is_array = function (arr){
            return typeof(arr)=='object'&&(arr instanceof Array);
        }

        /**
        * App functions============================================================
        */
 
        permutator.clearOutput = function () {
            permutator.output.innerHTML = "";
        }

        permutator.printout = function (str) {
            permutator.output.innerHTML += str+"<br />\n";
        //console.log(str);
        }

        //@source Adapted from http://bytes.com/topic/php/answers/776663-generating-permutations-combinations
        //This is NOT an efficient method -- I think it's O^n time complexity, so don't aim to permute more than 4 items
        permutator.permute = function (rest) {
            permutator.debug && console.log(permutator.tabIt()+'Started permute with rest='+permutator.print_r(rest));
            var results = new Array();
            if(rest.length===0) {
                permutator.debug && console.log(permutator.tabIt()+'rest.length is zero, so return false');
                return false;
            }

            if(rest.length===1) {
                permutator.debug && console.log(permutator.tabIt()+'rest.length is one, so return it as-is ('+permutator.print_r(rest)+')');
                return rest;
            }

            for(var i=0; i<rest.length; i++) {
                permutator.debug && console.log(permutator.tabIt()+'Top of the for loop; i='+i+'; rest='+permutator.print_r(rest));
                //take the ith item off a copy of the list, keep the remainder
                var restCopy = rest.slice();
                var thisItem = restCopy.splice(i, 1).pop();
                var otherItems = restCopy;
                permutator.debug && console.log(permutator.tabIt()+'After copy and splice, thisItem='+permutator.print_r(thisItem)+'; rest='+permutator.print_r(rest)+'; restCopy='+permutator.print_r(restCopy));

                //add the ith item itself to the result list
                results.push(thisItem);
                permutator.debug && console.log(permutator.tabIt()+'Added the current ith (i='+i+') item to the results; restCopy='+permutator.print_r(restCopy)+'; results='+permutator.print_r(results));

                //Add the rest of the results to the list as a unit
                //results.push(otherItems);
                //permutator.debug && console.log(permutator.tabIt()+'Added the current ith (i='+i+') restCopy to the results (restCopy='+permutator.print_r(restCopy)+'; results='+permutator.print_r(results));

                //get all permutations of the remainder of the list
                permutator.debug && console.log(permutator.tabIt()+'Before recurse; rest='+permutator.print_r(rest)+'; i='+i+'; results='+permutator.print_r(results));
                permutator.debug && permutator.tabs++;
                var permutedResults = permutator.permute(otherItems);
                permutator.debug && permutator.tabs--;
                permutator.debug && console.log(permutator.tabIt()+'After recurse; rest='+permutator.print_r(rest)+'; i='+i+'; permutedResults='+permutator.print_r(permutedResults));

                if(permutedResults===false) {
                    continue;
                }

                results.concat(permutedResults);

                //put the ith item back in at each possible position of each permutedResults variant and add those combos to the final results set
                for(var k=0; k<permutedResults.length; k++) {
                    permutator.debug && console.log(permutator.tabIt()+'For loop k='+k+'; permutedResults[k]='+permutedResults[k]);

                    for(var j=1; j<=permutedResults[k].length; j++) {
                        var prItem = permutedResults[k].slice();
                        if(!permutator.is_array(prItem)) {
                            prItem = new Array(prItem);
                        }
                        prItem.splice(j, 0, thisItem);
                        results.push(prItem);
                        permutator.debug && console.log(permutator.tabIt()+'After putting thisItem ('+permutator.print_r(thisItem)+') into the jth (j='+j+') position of prItem, the results (prItem)='+permutator.print_r(prItem)+'); results='+permutator.print_r(results));
                    }
                }
            }

            results = Array.prototype.slice.call(permutator.unique(results));
            permutator.debug && console.log(permutator.tabIt()+'About to return result=='+permutator.print_r(rest));
            return results;
        }

        permutator.limitResults = function() {
            permutator.limit=permutator.getLimit();
            permutator.startPermute();
        }

        permutator.timeAndGo = function () {
            clearTimeout(permutator.timeout);
            permutator.timeout = setTimeout("window.permutator.startPermute()", 1000);//Function will be called 1 second after user types anything. Feel free to change this value.
        }

        permutator.startPermute = function () {
            permutator.input=document.getElementById('permutator_input');
            permutator.output=document.getElementById('permutator_output');
            if(permutator.input.value.trim().charAt(permutator.input.value.trim().length-1)==',') {
                return false;
            }
            inputArr = permutator.input.value.split(',');
            for(var i=0; i< inputArr.length; i++) {
                inputArr[i] = inputArr[i].trim();
            }
            inputArr = Array.prototype.slice.call(permutator.unique(inputArr));
            //permutator.printout(permutator.print_r(inputArr));
            //return;

            if(inputArr.length===1) {
                //permutator.printout(inputArr.pop());
                //do nothing
                console.log('Waiting for more than one word to be input');
            } else {
                permutator.clearOutput();
                permutator.printout('Calculating. Please wait...');
                var results = (permutator.permute(inputArr));
                //window.permutator.testme = results.slice();
                for(var i=0; i< results.length; i++) {
                    if(permutator.is_array(results[i])) {
                        results[i] = permutator.flatten(results[i]);
                    } else {
                        results[i] = new Array(results[i]);
                    }
                }
                results.sort(function(a,b) {
                    return a.length-b.length
                }).reverse();
                //console.log(results);
                var table='';

                
                var limit = window.permutator.limit;
                
                permutator.clearOutput();
                table+="<p>Here are the possible answers.  Each line is one possible answer set + its grade value.  <a target=\"blank\" href=\"http://docs.moodle.org/20/en/Short-Answer_question_type#Wildcard_usage\">More info&gt;</a></p>\n";
                table+="<table width=\"50%\">\n<tr><th width=\"40%\" align=\"left\">Answer #</th><th width=\"40%\" align=\"left\">Answer</th><th width=\"40%\" align=\"left\">Grade</th></tr>\n";
                var outputSoFar=0;
                var limitedResults = new Array;
                for(var i=0; i< results.length; i++) {
                    var thisGrade = (results[i].length / inputArr.length).toFixed(7);
                    if(thisGrade*100<limit) {
                        continue;
                    }
                    var thisItem = '*'+results[i].join('*')+'*';
                    table+='<tr><td>'+outputSoFar+'</td><td>'+thisItem+'</td><td>'+((thisGrade*100).toFixed(2))+"%</td></tr>\n";
                    limitedResults[outputSoFar] = {
                        answer:thisItem,
                        grade:thisGrade
                    };
                    
                    outputSoFar++;
                }

                //Add the 0% item to catch all other entries
                var thisItem = '*';
                permutator.printout(table+'<tr><td>'+(outputSoFar)+'</td><td>'+thisItem+"</td><td>None</td></tr>\n");
                limitedResults[outputSoFar] = {
                    answer:thisItem,
                    grade:'0.0'
                };
                permutator.results = limitedResults;
            }
        }

        //Y.on('domready', function(e) { //Keep for Moodle 2.3

        //Y.log('domready fired');

        /**
         * Set the select box (s) selected item to the matching float value (v)
         */
        permutator.setSelectedIndex = function (s, v) {
            for ( var i = 0; i < s.options.length; i++ ) {
                if ( parseFloat(s.options[i].value) == parseFloat(v) ) {
                    s.options[i].selected = true;
                    return;
                }
            }
        };

        /**
         * The form only gives us 5 answer fields to start, but permutations of 3 items = ~16 items
         */
        permutator.addMoreAnswerFields = function() {
            Y.one('#id_answer_0').set('value', window.permutator.stringSeparator+Y.JSON.stringify(window.permutator.results));
            Y.one('#id_addanswers').simulate('click');
        }

        /**
         * During the page refreshes when adding answer fields to the form, this checks if we can stop adding answer fields
         */
        permutator.startupCheckEnoughAnswerFields = function() {
            if(Y.one('#id_answer_0').get('value').match('^'+window.permutator.stringSeparator)) {
                window.permutator.results = Y.JSON.parse(Y.one('#id_answer_0').get('value').slice(window.permutator.stringSeparator.length));

                if(window.permutator.checkEnoughAnswerFields()) {
                    window.permutator.populateAnswers();
                }
            }
        }

        /**
         * Counts the # of answer fields and compares to the permutator result count
         */
        permutator.checkEnoughAnswerFields = function() {
            if(window.document.getElementById('id_fraction_'+(window.permutator.results.length-1))==null) {
                window.permutator.addMoreAnswerFields();
                return;
            } else {
                return true;
            }
        }


        permutator.getLimit = function() {
            var limit = window.document.getElementById('permutator_limit').value;
            if(limit==null || limit==undefined || limit==false || limit==0) {
                limit=-1;
            }
            return limit;
        }

        /**
         * Populate the answers into the Moodle form answer + grade fields
         */
        permutator.populateAnswers = function() {
            window.permutator.checkEnoughAnswerFields();
            var limit = window.permutator.limit;
            //Y.log('populateAnswers()::limit='+limit+'; results='+window.permutator.print_r(window.permutator.results));
            
            var outputSoFar=0;
            for(var i=0;i<window.permutator.results.length;i++) {
                if(window.permutator.results[i].grade*100<limit) {
                    continue;
                }
                Y.one('#id_answer_'+outputSoFar).set('value', window.permutator.results[i].answer);
                var select = window.document.getElementById('id_fraction_'+outputSoFar);
                window.permutator.setSelectedIndex(select, window.permutator.results[i].grade);
                outputSoFar++;
            }
            window.permutator.panel.hide();
        };

        /**
         * Inline code =========================================================
         */
        permutator.startupCheckEnoughAnswerFields();
        //});

        //Build + insert the link to this new permutator functionality
        var permutatorLinkNode = Y.Node.create('<div id="permutator_launcher"><a href="#" onclick="window.permutator.panel.render();window.permutator.panel.show();return false;">Use the word list permutator...<a></div>');
        Y.one('#answerhdr_0').insert(permutatorLinkNode, 'before');
