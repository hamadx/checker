$(document).ready(function () {
    $("#statement").keyup(function () {
        var step2 = $("#step2");
        var step3 = $("#step3");
        var statement = $(this).val().split(' ');
        var statement2 = [];
        var password = "";
        statement.forEach(function(entry) {
            if(entry == "")
                return;
            statement2.push("<b>" + entry[0] + "</b>" + entry.substr(1));
            password += entry[0];
        });
        statement2 = statement2.join(' ');
        step2.html(statement2);
        step3.text(password);

        // Strong level (max = 10)
        var level;
        var strength = document.querySelector('#strength');
        var score = computeStrength(password);
        level = score / 5;
        if (level >= 10)
            level = 10;
        strength.MaterialProgress.setProgress(level * 10);

        if (level < 4)
            $(".mdl-progress > .progressbar").css('background-color', '#e74c3c');
        else if (level < 6)
            $(".mdl-progress > .progressbar").css('background-color', '#e67e22');
        else if (level < 8)
            $(".mdl-progress > .progressbar").css('background-color', '#f1c40f');
        else
            $(".mdl-progress > .progressbar").css('background-color', '#2ecc71');
    });

    // Strength Bar
    document.querySelector('#strength').addEventListener('mdl-componentupgraded', function () {
        this.MaterialProgress.setProgress(0);
        this.MaterialProgress.setBuffer(80);
    });

});