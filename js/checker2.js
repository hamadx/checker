$(document).ready(function () {

    var termsCount=0;
    var dictTermsCount=0;
    var opts = {
        lines: 10,
        angle: 0.15,
        lineWidth: 0.34,
        pointer: {
            length: 0.4,
            strokeWidth: 0.055,
            color: '#000000'
        },
        limitMax: 'false',
        percentColors: [[0.0, "#ff0000" ], [0.50, "#ff8000"], [1.0, "#00ff00"]], // !!!!
        strokeColor: '#ff0000',
        generateGradient: true
    };

    var target1 = document.getElementById('complexityGauge');
    var gauge1 = new Gauge(target1).setOptions(opts);
    gauge1.maxValue = 2;
    gauge1.animationSpeed = 32;

    var target2 = document.getElementById('lengthGauge');
    var gauge2 = new Gauge(target2).setOptions(opts);
    gauge2.maxValue = 14;
    gauge2.animationSpeed = 32;

    var target3 = document.getElementById('unpredictabilityGauge');
    var gauge3;
    gauge3 = new Gauge(target3).setOptions(opts);
    gauge3.animationSpeed = 32;


    function stripPassword(pwd) {
        return (pwd.replace(/[^a-zA-Z ]/g, ""));
    }

    function splitToWords(pwd){
        return pwd.split(/[^a-zA-Z]+/g); // Any non-alphabet char is considered a separator
    }

    function getPasswordStrength(pwd) {
        var passwordStrength = -1;

        var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
        var mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");

        if (strongRegex.test(pwd)) {
            passwordStrength = 2; //strong
        } else if (mediumRegex.test(pwd)) {
            passwordStrength = 1; //medium
        } else {
            passwordStrength = 0; //weak
        }

        return passwordStrength;
    }

    function lookupDict(word,callback) {
        var dictAPI = "http://api.wordnik.com:80/v4/words.json/search/" + word + "?caseSensitive=false&minCorpusCount=5&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=1&maxLength=-1&skip=0&limit=10&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5";
        $.getJSON(dictAPI, function (data) {
                console.log("success");
                var inDict = (data.totalResults > 0); // if word is found in dictionary
                //console.log(data.totalResults,inDict);
                callback(inDict);
            })
            .done(function () {
                console.log("second success");
            })
            .fail(function () {
                console.log("error");
                callback(error);
            })
            .always(function () {
                console.log("complete");
            });
    }
    function unpTest() {

        var i = $('#pwdInput');
        var terms = splitToWords(i.val());
        var removeItem = "";

        terms = jQuery.grep(terms, function(value) {
            return value != removeItem;
        });
        termsCount=terms.length;
        dictTermsCount=termsCount;
        console.log(terms);
        $.each(terms, function( index, value ) {
            lookupDict(value,updateDict);
        });

    }
    var pwdInput = $('#pwdInput');
    pwdInput.lastValue = "";
    var timeout;
    pwdInput.keyup(function () {
       // var m = $('#label1');
        var i = pwdInput.val();
        if(i !=  pwdInput.lastValue) {
            // Save the "last" value
            $('#pwdInput').lastValue = i;
            // Delay before search in the case of typing
            if(timeout) { clearTimeout(timeout); }
            // Start new time out
            timeout = setTimeout(function() {
                // Do the search!
                console.warn("Doing search for " + i + ", time waited");
                unpTest();
            },1000);
        }
        var s=getPasswordStrength(i);
        /**switch(s){
            case 0: m.text('Weak'); break;
            case 1: m.text('Medium'); break;
            case 2: m.text('Strong'); break;
            default: m.text('Error');
        }*/

        gauge1.set(s);

        var l= i.length;
        if (l>14) l=14;

        gauge2.set(l);

    });

    $("#btn1").click(function () {
        var m = $('#label2');
        var i = $('#pwdInput');

        m.text(stripPassword(i.val()));
    });

    function updateDict(ret) {
        var m = $('#label2');
        switch (ret) {
            case true:
                m.append("You chose a password that is easily found in English dictionary, bad idea!");

                break;
            case false:
                m.append("Password is not found in a dictionary, good thing!");
                --dictTermsCount;
                console.log("dictTermCount: " + dictTermsCount);
                break;
            default:
                m.append("Error with Dictionary API!");
        }

        var target3 = document.getElementById('unpredictabilityGauge');
        var gauge3 = new Gauge(target3).setOptions(opts);

        gauge3.animationSpeed = 32;
        gauge3.maxValue = termsCount;
        gauge3.set(termsCount-dictTermsCount);
    }



    $("#btn3").click(function () {
        var password = $('#pwdInput').val();
        var re = /[0-9\`\~\!\@\#\$\%\^\&\*\(\)\_\-\+\=\{\}\[\]\\\|\:\;\"\'\<\>\,\.\?\/]$/;
        if (password.match(re)) {
            console.log("Ends with a number or symbol");
        }
    });

    $("#btn4").click(function () {
        var password = $('#pwdInput').val();
        var re = /^[0-9\`\~\!\@\#\$\%\^\&\*\(\)\_\-\+\=\{\}\[\]\\\|\:\;\"\'\<\>\,\.\?\/]/;
        if (password.match(re)) {
            console.log("Starts with a number or symbol");
        }
    });

    $("#btn5").click(function () {
        var password = $('#pwdInput').val();
        var re = /^[0-9\`\~\!\@\#\$\%\^\&\*\(\)\_\-\+\=\{\}\[\]\\\|\:\;\"\'\<\>\,\.\?\/](?:.*)[0-9\`\~\!\@\#\$\%\^\&\*\(\)\_\-\+\=\{\}\[\]\\\|\:\;\"\'\<\>\,\.\?\/]$/;
        if (password.match(re)) {
            console.log("Starts and ends with a number or symbol");
        }
    });
});
