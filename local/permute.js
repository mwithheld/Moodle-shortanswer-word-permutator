permutator = window.permutator;
permutator.input=document.getElementById('permutator_input');
permutator.output=document.getElementById('permutator_output');
permutator.tabs = 0;
permutator.debug = false;
permutator.timeout;

permutator.unique = function(arr) {
    var o = {}, i, l = arr.length, r = [];
    for(i=0; i<l;i+=1) o[arr[i]] = arr[i];
    for(i in o) r.push(o[i]);
    return r;
};

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

permutator.clearOutput = function () {
    permutator.output.innerHTML = "";
}

permutator.printout = function (str) {
    permutator.output.innerHTML += str+"<br />\n";
//console.log(str);
}

permutator.tabIt = function () {
    var tabSpace = '';
    var tab = '&nbsp;&nbsp;&nbsp;&nbsp;';
    for(i=0;i<permutator.tabs;i++) {
        tabSpace += tab;
    }
    return tabSpace;
}

//JSON.stringify compatibility is outlined at http://caniuse.com/json
permutator.print_r = function (array) {
    return JSON.stringify(array);
}

//@source http://andrewpeace.com/javascript-is-array.html
permutator.is_array = function (arr){
    return typeof(arr)=='object'&&(arr instanceof Array);
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

permutator.makeItArray = function (a) {
    if(!permutator.is_array(a)) {
        a = new Array(a);
    }
    return a;
}

permutator.customSort = function (a,b) {
    return permutator.makeItArray(a).length - permutator.makeItArray(b).length;
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

        permutator.clearOutput();
        table+="<p>Here are the possible answers.  Each line is one possible answer set + its grade value.  <a target=\"blank\" href=\"http://docs.moodle.org/20/en/Short-Answer_question_type#Wildcard_usage\">More info&gt;</a></p>\n";
        table+="<table width=\"50%\">\n<tr><th width=\"40%\" align=\"left\">Answer #</th><th width=\"40%\" align=\"left\">Answer</th><th width=\"40%\" align=\"left\">Grade</th></tr>\n";
        for(var i=0; i< results.length; i++) {
            //console.log(permutator.print_r('i='+i+'; results='+results[i]));
            var thisGrade = (results[i].length / inputArr.length).toFixed(7);
            var thisItem = '*'+results[i].join('*')+'*';
            table+='<tr><td>'+(i+1)+'</td><td>'+thisItem+'</td><td>'+((thisGrade*100).toFixed(2))+"%</td></tr>\n";
            results[i] = {
                answer:thisItem,
                grade:thisGrade
            };
        }

        //Add the 0% item to catch all other entries
        var thisItem = '*';
        permutator.printout(table+'<tr><td>'+(results.length+1)+'</td><td>'+thisItem+"</td><td>None</td></tr>\n");
        results[results.length] = {
            answer:thisItem,
            grade:'0.0'
        };
        permutator.results = results;
    }
}

