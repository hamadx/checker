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
    });
});