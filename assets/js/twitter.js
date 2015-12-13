/********************************/
/* Twitter                       */
/********************************/

function Twitter() {
    this.init();
}

Twitter.prototype = {
    constructor: Twitter,

    //init functions
    init: function(){},

    //store generate poem sentences
    poemSentences: [],

    //generate poems
    generatePoemSentence: function(text){
        var that = this;
        var text = text;

        //first, i just want the content after the key word "I remember"
        text = text.split("i remember ")[1] || text.split("I remember ")[1];

        if(text !== "" && text !== undefined){

            // looks for any characters following a 'http' or 'https', and ending in a space or the end of the tweet
            var  urlPattern = /https?.*?( |$)/g;
            text = text.replace(urlPattern, '');

            //looks for any characters following a @ character, and ending in a space or the end of the tweet
            var handlePattern = /@.*?( |$)/g;
            text = text.replace(handlePattern, '');

            //looks for any characters following a # sign, and ending in a space or the end of the tweet
            var hashtagPattern = /#.*?( |$)/g;
            text = text.replace(hashtagPattern, '');

            //split sentences and choose the first one
            var sentences = RiTa.splitSentences(text);
            text = sentences[0];

            //check the count of the filtered sentences
            var count = RiTa.getWordCount(text);
            if(count < 6){
                return "";
            }

            //remove emoji
            var regexEmoticons = /([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF|\uD83D[\uDE00-\uDE4f])/g;
            text = text.replace(regexEmoticons, ' ');

            //remove repetitive result sentence
            var isRepetitive = false;
            if(that.poemSentences.length > 0){
                isRepetitive = that.poemSentences[that.poemSentences.length-1] == text;
            }
            if(isRepetitive){
                return "";
            }else{
                that.poemSentences.push(text);
            }

            //add dot if the sentence misses one
            var dotEndPattern = /(\.|!|\.\.\.)$/;
            if(!dotEndPattern.test(text)){
                text += '.';
            }

            return text;
        }else{
            return "";
        }
    },

    //get poems according to the city information
    getPoemByCity: function(city, callback){
        var that = this;
        var city = city || 'atlanta';

        //get twitter data with the keyword "I remember $_GET[city]"
        $.getJSON('lib/getTweets.php?city=' + city, function(resp){
            var list = [];

            if(resp && resp.statuses && resp.statuses.length !== 0){
                list = resp.statuses;
                var poem = '';

                $.each(list, function(index){
                    var $this = $(this)[0];

                    //analyze the tweet content and make the data into the structure: I remember ***
                    var text = $this.text;

                    var sentence = that.generatePoemSentence(text);

                    console.log(sentence)

                    if(sentence !== "")
                        poem += "<p>" + "<strong>I remember </strong>" + sentence + "</p>";
                });

                callback({city: city, poem: poem});
            }
        });
    }
};