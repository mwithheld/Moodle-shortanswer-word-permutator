For short answer questions where you are looking for one or more wod matches, this tool generates permutations of a list of these words for automatic marking, and their associated grade. E.g. For the list {cat,dog}, the student could enter "cat, dog", or "dog, cat" and get 100%, and either word alone is worth 50%. This tool will populate the generated permutations and grades into the Moodle form.

Tested in Moodle 2.2

Installation:

-Copy the permute.js file to your <moodleroot>/local/ folder

-Copy the javascript/permutations.js file to your <moodleroot>/local/<themefolder>/javascript/ folder

-Edit your theme's config.php and set 
$THEME->javascripts_footer = array('permutations');

or instead if needed, add it to the existing footer javascripts
$THEME->javascripts_footer = array(<my other javascripts...>, 'permutations');

The tool will show up as a link when you add or edit a short-answer question (screenshot1.png).  Enter your words as directed, scroll to the bottom of the popup window, and click "Use these values" or "Cancel" (screenshot2.png).

Developed by Mark van Hoek vhmark@gmail.com