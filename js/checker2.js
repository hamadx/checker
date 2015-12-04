$(document).ready(function () {
    var pwdFlags= {
        length:0,
        complexity:0,
        unpredictability: false
    };

    var dictionary;
    var terms;
    $("#dictionary").load("https://raw.githubusercontent.com/danielmiessler/SecLists/master/Passwords/10_million_password_list_top_1000000.txt", function(){
        var text = $("#dictionary").text();
        var words = text.split("\n");
        dictionary = new Array();
        for(var i=0; i < words.length; i++) {
            dictionary[i] = words[i];
        }
        $("#loader").fadeOut();
        $("#pwdInput").fadeIn();
        var ns= document.getElementById('pwdInput').offsetHeight + "px";
        $("#inputBox").animate({height: ns },1000)
    });


    function dic(displayComment) {
        var word = document.getElementById("pwdInput").value;
        // var dictionary = new Array("Java","Python","Swift","HTML","PHP");
        // This line is unnecessary; use the dictionary var already created.
        var flag = 0;
        for(var i = 0; i < dictionary.length; i++) {
            if(dictionary[i] == word) {
                if (displayComment)
                    $("#outputMessage").append("&#149; Woah, your password is such a cliche. Just try googling it and you will find many people use it.<br>");
                flag = 1;
                break;
            }
/*            if(i == dictionary.length - 1) {
                if(displayComment)
                $("#outputMessage").append("Ha! Original password! Good one <br>");
            }*/
        }
    }

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

    var target1 = document.getElementById('lengthGauge');
    var gauge1 = new Gauge(target1).setOptions(opts);
    gauge1.maxValue = 14;
    gauge1.animationSpeed = 32;

    var target2 = document.getElementById('complexityGauge');
    var gauge2 = new Gauge(target2).setOptions(opts);
    gauge2.maxValue = 2;
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

    function lookupDict(word,index,callback,displayComment) {
        var dictAPI = "http://api.wordnik.com:80/v4/words.json/search/" + word + "?caseSensitive=false&minCorpusCount=5&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=1&maxLength=-1&skip=0&limit=10&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5";
        $.getJSON(dictAPI, function (data) {
                console.log("success");
                var inDict = (data.totalResults > 0); // if word is found in dictionary
                callback(inDict,index,displayComment);
            })
            .done(function () {
                console.log("second success");
            })
            .fail(function () {
                console.log("Error with API Call");
                callback("Error with API Call");
            })
            .always(function () {
                console.log("complete");
            });
    }
    function unpTest(displayComment) {

        var i = $('#pwdInput');
        terms = splitToWords(i.val());
       // var removeItem = "";

        terms = jQuery.grep(terms, function(value) {
            return value.length > 2;// remove empty and 2 letter items
        });
        console.log(terms);
        termsCount=terms.length;
        dictTermsCount=termsCount;

        if(terms.length>0){
        $.each(terms, function( index, value ) {
            lookupDict(value,index,updateDict,displayComment);
        });
        }
        else
        {
            var gauge3 = new Gauge(target3).setOptions(opts);
            gauge3.animationSpeed = 32;
            gauge3.set(0);
        }
       dic(displayComment);

    }
    var pwdInput = $('#pwdInput');

    function getWiseCatMessage(){
        switch (true)
        {
            case(pwdFlags.length<=3): // Length 1-3
                if (pwdFlags.complexity==0)  // Low Complexity
                    return outMessages[0];
                else                        // Medium and High Complexity
                    return (pwdFlags.unpredictability?outMessages[1]:outMessages[2]);
            case (pwdFlags.length>=4 && pwdFlags.length<=7): // length 4-7
                switch(pwdFlags.complexity){
                    case 0: /// Low Complexity
                        return (pwdFlags.unpredictability?outMessages[3]:outMessages[4]);
                    case 1: // Medium Complexity
                        return (pwdFlags.unpredictability?outMessages[5]:outMessages[6]);
                    case 2: // High Complexity
                        return (pwdFlags.unpredictability?outMessages[7]:outMessages[8]);
                }
            case (pwdFlags.length>=8 && pwdFlags.length<=10): // Length 8-10
                switch(pwdFlags.complexity){
                    case 0: /// Low Complexity
                        return (pwdFlags.unpredictability?outMessages[9]:outMessages[10]);
                    case 1: // Medium Complexity
                        return (pwdFlags.unpredictability?outMessages[11]:outMessages[12]);
                    case 2: // High Complexity
                        return (pwdFlags.unpredictability?outMessages[13]:outMessages[14]);
                }
            case (pwdFlags.length>=8 && pwdFlags.length<=10): // Length 11-12
                switch(pwdFlags.complexity){
                    case 0: /// Low Complexity
                        return (pwdFlags.unpredictability?outMessages[15]:outMessages[16]);
                    case 1: // Medium Complexity
                        return (pwdFlags.unpredictability?outMessages[17]:outMessages[18]);
                    case 2: // High Complexity
                        return (pwdFlags.unpredictability?outMessages[19]:outMessages[20]);
                }
            case (pwdFlags.length>=13 ): // Length >= 13
                switch(pwdFlags.complexity){
                    case 0: /// Low Complexity
                        return (pwdFlags.unpredictability?outMessages[21]:outMessages[22]);
                    case 1: // Medium Complexity
                    case 2: // High Complexity
                        return (pwdFlags.unpredictability?outMessages[23]:outMessages[24]);
                }
        }
    }

    pwdInput.lastValue = "";
    var timeout;
    pwdInput.keyup(function (event) {
        if(event.keyCode == 13){
            //alert(getWiseCatMessage());
            $("#outputMessage").text("");
            console.log(pwdFlags);
            $("#outputMessage").append(getWiseCatMessage()).append(" <a href='generator.html'>Help me create a safe password</a><hr>");
            unpTest(true);
        }
        var i = pwdInput.val();
       //if(i !=  pwdInput.lastValue) {
            // Save the "last" value
            $('#pwdInput').lastValue = i;
            // Delay before search in the case of typing
            if(timeout) { clearTimeout(timeout); }
            // Start new time out
            timeout = setTimeout(function() {
                unpTest(false);
            },1000);
        //}
/*        if(pwdInput.val().length==0) {
            termsCount=dictTermsCount=0;
            gauge3.set(0);
        }*/
        var s=getPasswordStrength(i);
        /**switch(s){
            case 0: m.text('Weak'); break;
            case 1: m.text('Medium'); break;
            case 2: m.text('Strong'); break;
            default: m.text('Error');
        }*/
        var l= i.length;
        if (l>14) l=14;
       // console.log("Length="+l, "Complexity"+s)
        gauge1.set(l);
        gauge2.set(s);
        pwdFlags.length=l;
        pwdFlags.complexity=s;
    });


    $("#btn1").click(function () {
        var m = $('#outputMessage');
        var i = $('#pwdInput');

        m.text(stripPassword(i.val()));
    });

    function updateDict(ret,index,displayComment){
    //alert(ret);
        var m = $('#outputMessage');
        switch (ret) {
            case true:
                if (displayComment)
                m.append("&#149; I found the word <em><b>" + terms[index] + "</b></em> in your password that is easily found in English dictionary, bad idea!<br>");
                break;
            case false:
               // m.append("Password is not found in a dictionary, good thing!<br>");
                --dictTermsCount;
                break;
            default:
                m.append("Error with Dictionary API!");
        }

        var target3 = document.getElementById('unpredictabilityGauge');
        var gauge3 = new Gauge(target3).setOptions(opts);

        gauge3.animationSpeed = 32;
        gauge3.render();
        gauge3.maxValue = termsCount;
        gauge3.set(termsCount-dictTermsCount)
       // console.log("Text: " + $("#pwdInput").val());

        pwdFlags.unpredictability=((termsCount-dictTermsCount)>=gauge3.maxValue);
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
