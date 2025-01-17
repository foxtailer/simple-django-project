$(document).ready(function () {
    const csrfToken = $('meta[name="csrf-token"]').attr('content');


    $.ajaxSetup({
        headers: {
            'X-CSRFToken': csrfToken
        }
    });


    $(document).on("click", "#next_btn", function (e) {
        e.preventDefault();

        var wisdom_id = $("#wisdom").data("wisdom-id");
        var $container = $("#wisdom");

        $.ajax({
            type: "POST",
            url: "",
            data: {
                wisdom_id: wisdom_id,
            },
        
            success: function (data) {
                $container.html(data.wisdom);

                $container.attr("data-wisdom-id", data.wisdom_id);
                $container.removeData("wisdom-id"); 
                
                const post = JSON.parse(data.post)
                
                if (userId) {
                    // Bookmark button
                    document.getElementById("like_btn").setAttribute("data-like", data.is_accepted);

                    if (post[0].fields.author == userId) {
                        document.getElementById("like_btn").setAttribute("class", "control-element " + "off");
                    } else {
                        if (data.is_accepted) {
                            document.getElementById("like_btn").setAttribute("class", "control-element " + "active " + "used");
                        } else {
                            document.getElementById("like_btn").setAttribute("class", "control-element " + "active");
                        }
                    };

                    // Report button 
                    if (post[0].fields.author != userId && !data.is_accepted) {
                        document.getElementById("report_btn").setAttribute("class", "control-element " + "active " + "report");
                    } else {
                        document.getElementById("report_btn").setAttribute("class", "control-element " + "report " + "off");
                    };

                    // Mail button
                    document.getElementById("mail_btn").setAttribute("href", "mailto:" + data.email);

                    if (data.reply) {
                        document.getElementById("mail_btn").setAttribute("class", "control-element " + "active ");
                    } else {
                        document.getElementById("mail_btn").setAttribute("class", "control-element " + "off");
                        document.getElementById("mail_btn").setAttribute("href", "#");
                    };

                } else {
                    document.getElementById("like_btn").setAttribute("class", "control-element " + "off");
                    document.getElementById("report_btn").setAttribute("class", "control-element " + "report " + "off");
                    document.getElementById("mail_btn").setAttribute("class", "control-element " + "off");
                    document.getElementById("mail_btn").setAttribute("href", "#");
                };
            },

            error: function (data) {
                console.log(data);
                console.log("Ошибка");
            },
        });
    });


    $(document).on("click", "#like_btn", function (e) {
        e.preventDefault();

        if (!$(this).hasClass("active")) {
            return;
        }

        var wisdom_id = $("#wisdom").data("wisdom-id");
        var button = $(this);
        var is_accepted = button.data("like"); 

        $(this).toggleClass("used"); 
        
        $.ajax({
            type: "PATCH",
            url: "",
            contentType: 'application/json',
            data: JSON.stringify({
                user_id: userId,
                post_id: wisdom_id,
                is_accepted: is_accepted,
            }),
        
            success: function (data) {
                console.log(data)
                button.removeData("like"); 
                button.attr("data-like", data.is_accepted);
            },

            error: function (data) {
                console.log("Ошибка");
            },
        });
    });


    $(document).on("click", "#report_btn", function (e) {
        e.preventDefault();

        if (!$(this).hasClass("active")) {
            return;
        }

        var wisdom_id = $("#wisdom").data("wisdom-id");

        $.ajax({
            type: "PUT",
            url: "",
            contentType: 'application/json',
            data: JSON.stringify({
                user_id: userId,
                post_id: wisdom_id,
            }),
        
            success: function (data) {
                document.getElementById("report_btn").setAttribute("class", "control-element " + "off " + "used");
            },

            error: function (data) {
                console.log("Ошибка");
            },
        });
    });
});