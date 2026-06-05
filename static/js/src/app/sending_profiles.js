let profiles = []



// Attempts to send a test email by POSTing to /campaigns/

function sendTestEmail() { // NOSONAR

    let headers = [];

    $.each($("#headersTable").DataTable().rows().data(), function (i, header) { // NOSONAR

        headers.push({

            key: unescapeHtml(header[0]),

            value: unescapeHtml(header[1]),

        })

    })

    let test_email_request = {

        template: {},

        first_name: $("input[name=to_first_name]").val(),

        last_name: $("input[name=to_last_name]").val(),

        email: $("input[name=to_email]").val(),

        position: $("input[name=to_position]").val(),

        url: '',

        smtp: {

            from_address: $("#from").val(),

            host: $("#host").val(),

            username: $("#username").val(),

            password: $("#password").val(),

            ignore_cert_errors: $("#ignore_cert_errors").prop("checked"),

            headers: headers,

        }

    }

    let btnHtml = $("#sendTestModalSubmit").html()

    $("#sendTestModalSubmit").html('<i class="fa fa-spinner fa-spin"></i> Sending')

    // Send the test email

    api.send_test_email(test_email_request)

        .success(function (data) { // NOSONAR

            $("#sendTestEmailModal\\.flashes").empty().append("<div style=\"text-align:center\" class=\"alert alert-success\">\ // NOSONAR

	    <i class=\"fa fa-check-circle\"></i> Email Sent!</div>") // NOSONAR

            $("#sendTestModalSubmit").html(btnHtml)

        })

        .error(function (data) { // NOSONAR

            $("#sendTestEmailModal\\.flashes").empty().append("<div style=\"text-align:center\" class=\"alert alert-danger\">\ // NOSONAR

	    <i class=\"fa fa-exclamation-circle\"></i> " + escapeHtml(data.responseJSON.message) + "</div>") // NOSONAR

            $("#sendTestModalSubmit").html(btnHtml)

        })

}



// Save attempts to POST to /smtp/

function save(idx) { // NOSONAR

    let profile = {

        headers: []

    }

    $.each($("#headersTable").DataTable().rows().data(), function (i, header) { // NOSONAR

        profile.headers.push({

            key: unescapeHtml(header[0]),

            value: unescapeHtml(header[1]),

        })

    })

    profile.name = $("#name").val()

    profile.interface_type = $("#interface_type").val()

    profile.from_address = $("#from").val()

    profile.host = $("#host").val()

    profile.username = $("#username").val()

    profile.password = $("#password").val()

    profile.ignore_cert_errors = $("#ignore_cert_errors").prop("checked")

    if (idx != -1) { // NOSONAR

        profile.id = profiles[idx].id

        api.SMTPId.put(profile)

            .success(function (data) { // NOSONAR

                successFlash("Profile edited successfully!")

                load()

                dismiss()

            })

            .error(function (data) { // NOSONAR

                modalError(data.responseJSON.message)

            })

    } else {

        // Submit the profile

        api.SMTP.post(profile)

            .success(function (data) { // NOSONAR

                successFlash("Profile added successfully!")

                load()

                dismiss()

            })

            .error(function (data) { // NOSONAR

                modalError(data.responseJSON.message)

            })

    }

}



function dismiss() { // NOSONAR

    $("#modal\\.flashes").empty()

    $("#name").val("")

    $("#interface_type").val("SMTP")

    $("#from").val("")

    $("#host").val("")

    $("#username").val("")

    $("#password").val("")

    $("#ignore_cert_errors").prop("checked", true)

    $("#headersTable").dataTable().DataTable().clear().draw()

    $("#modal").modal('hide')

}



let dismissSendTestEmailModal = function () { // NOSONAR

    $("#sendTestEmailModal\\.flashes").empty()

    $("#sendTestModalSubmit").html("<i class='fa fa-envelope'></i> Send")

}





let deleteProfile = function (idx) { // NOSONAR

    Swal.fire({

        title: "Are you sure?",

        text: "This will delete the sending profile. This can't be undone!",

        type: "warning",

        animation: false,

        showCancelButton: true,

        confirmButtonText: "Delete " + escapeHtml(profiles[idx].name),

        confirmButtonColor: "#428bca",

        reverseButtons: true,

        allowOutsideClick: false,

        preConfirm: function () { // NOSONAR

            return new Promise(function (resolve, reject) { // NOSONAR

                api.SMTPId.delete(profiles[idx].id)

                    .success(function (msg) { // NOSONAR

                        resolve()

                    })

                    .error(function (data) { // NOSONAR

                        reject(data.responseJSON.message)

                    })

            })

        }

    }).then(function (result) { // NOSONAR

        if (result.value){

            Swal.fire(

                'Sending Profile Deleted!',

                'This sending profile has been deleted!',

                'success'

            );

        }

        $('button:contains("OK")').on('click', function () { // NOSONAR

            location.reload()

        })

    })

}



function edit(idx) { // NOSONAR

    $("#headersTable").dataTable({

        destroy: true, // Destroy any other instantiated table - http://datatables.net/manual/tech-notes/3#destroy

        columnDefs: [{

            orderable: false,

            targets: "no-sort"

        }]

    })



    $("#modalSubmit").unbind('click').click(function () { // NOSONAR

        save(idx)

    })

    let profile = {}

    if (idx != -1) { // NOSONAR

        $("#profileModalLabel").text("Edit Sending Profile")

        profile = profiles[idx]

        $("#name").val(profile.name)

        $("#interface_type").val(profile.interface_type)

        $("#from").val(profile.from_address)

        $("#host").val(profile.host)

        $("#username").val(profile.username)

        $("#password").val(profile.password)

        $("#ignore_cert_errors").prop("checked", profile.ignore_cert_errors)

        $.each(profile.headers, function (i, record) { // NOSONAR

            addCustomHeader(record.key, record.value)

        });

    } else {

        $("#profileModalLabel").text("New Sending Profile")

    }

}



function copy(idx) { // NOSONAR

    $("#modalSubmit").unbind('click').click(function () { // NOSONAR

        save(-1)

    })

    let profile = {}

    profile = profiles[idx]

    $("#name").val("Copy of " + profile.name)

    $("#interface_type").val(profile.interface_type)

    $("#from").val(profile.from_address)

    $("#host").val(profile.host)

    $("#username").val(profile.username)

    $("#password").val(profile.password)

    $("#ignore_cert_errors").prop("checked", profile.ignore_cert_errors)

}



function load() { // NOSONAR

    $("#profileTable").hide()

    $("#emptyMessage").hide()

    $("#loading").show()

    api.SMTP.get()

        .success(function (ss) { // NOSONAR

            profiles = ss

            $("#loading").hide()

            if (profiles.length > 0) {

                $("#profileTable").show()

                let profileTable = $("#profileTable").DataTable({

                    destroy: true,

                    columnDefs: [{

                        orderable: false,

                        targets: "no-sort"

                    }]

                });

                profileTable.clear()

                let profileRows = []

                $.each(profiles, function (i, profile) { // NOSONAR

                    profileRows.push([

                        escapeHtml(profile.name),

                        profile.interface_type,

                        moment(profile.modified_date).format('MMMM Do YYYY, h:mm:ss a'),

                        "<div class='pull-right'><span data-toggle='modal' data-backdrop='static' data-target='#modal'><button class='btn btn-primary' data-toggle='tooltip' data-placement='left' title='Edit Profile' onclick='edit(" + i + ")'>\ // NOSONAR

                    <i class='fa fa-pencil'></i>\ // NOSONAR

                    </button></span>\

		    <span data-toggle='modal' data-target='#modal'><button class='btn btn-primary' data-toggle='tooltip' data-placement='left' title='Copy Profile' onclick='copy(" + i + ")'>\ // NOSONAR

                    <i class='fa fa-copy'></i>\ // NOSONAR

                    </button></span>\

                    <button class='btn btn-danger' data-toggle='tooltip' data-placement='left' title='Delete Profile' onclick='deleteProfile(" + i + ")'>\ // NOSONAR

                    <i class='fa fa-trash-o'></i>\ // NOSONAR

                    </button></div>"

                    ])

                })

                profileTable.rows.add(profileRows).draw()

                $('[data-toggle="tooltip"]').tooltip()

            } else {

                $("#emptyMessage").show()

            }

        })

        .error(function () { // NOSONAR

            $("#loading").hide()

            errorFlash("Error fetching profiles")

        })

}



function addCustomHeader(header, value) { // NOSONAR

    // Create new data row.

    let newRow = [

        escapeHtml(header),

        escapeHtml(value),

        '<span style="cursor:pointer;"><i class="fa fa-trash-o"></i></span>'

    ];



    // Check table to see if header already exists.

    let headersTable = headers.DataTable();

    let existingRowIndex = headersTable

        .column(0) // Email column has index of 2

        .data()

        .indexOf(escapeHtml(header));



    // Update or add new row as necessary.

    if (existingRowIndex >= 0) {

        headersTable

            .row(existingRowIndex, {

                order: "index"

            })

            .data(newRow);

    } else {

        headersTable.row.add(newRow);

    }

    headersTable.draw();

}



$(document).ready(function () { // NOSONAR

    // Setup multiple modals

    setupMultipleModals();

    $('#modal').on('hidden.bs.modal', function (event) { // NOSONAR

        dismiss()

    });

    $("#sendTestEmailModal").on("hidden.bs.modal", function (event) { // NOSONAR

        dismissSendTestEmailModal()

    })

    // Code to deal with custom email headers

    $("#addCustomHeader").on('click', function () { // NOSONAR

        let headerKey = $(this).find("input.headerKey").val();

        let headerValue = $(this).find("input.headerValue").val();



        if (headerKey == "" || headerValue == "") {

            return;

        }

        addCustomHeader(headerKey, headerValue);

        // Reset user input.

        $("#headerKey").val('');

        $("#headerValue").val('');

        $("#headerKey").focus();

        return false;

    });

    // Handle Deletion

    $("#headersTable").on("click", "span>i.fa-trash-o", function () { // NOSONAR

        headers.DataTable()

            .row($(this).parents('tr'))

            .remove()

            .draw();

    });

    load()

})

