let templates = []

let icons = {

    "application/vnd.ms-excel": "fa-file-excel-o",

    "text/plain": "fa-file-text-o",

    "image/gif": "fa-file-image-o",

    "image/png": "fa-file-image-o",

    "application/pdf": "fa-file-pdf-o",

    "application/x-zip-compressed": "fa-file-archive-o",

    "application/x-gzip": "fa-file-archive-o",

    "application/vnd.openxmlformats-officedocument.presentationml.presentation": "fa-file-powerpoint-o",

    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "fa-file-word-o",

    "application/octet-stream": "fa-file-o",

    "application/x-msdownload": "fa-file-o"

}



// Save attempts to POST to /templates/

function save(idx) { // NOSONAR

    let template = {

        attachments: []

    }

    template.name = $("#name").val()

    template.subject = $("#subject").val()

    template.envelope_sender = $("#envelope-sender").val()

    template.html = CKEDITOR.instances["html_editor"].getData();

    // Fix the URL Scheme added by CKEditor (until we can remove it from the plugin)

    template.html = template.html.replace(/https?:\/\/{{\.URL}}/gi, "{{.URL}}")

    // If the "Add Tracker Image" checkbox is checked, add the tracker

    if ($("#use_tracker_checkbox").prop("checked")) {

        if (template.html!.includes("{{.Tracker}}") &&

            template.html.indexOf("{{.TrackingUrl}}") == -1) {

            template.html = template.html.replace("</body>", "{{.Tracker}}</body>")

        }

    } else {

        // Otherwise, remove the tracker

        template.html = template.html.replace("{{.Tracker}}</body>", "</body>")

    }

    template.text = $("#text_editor").val()

    // Add the attachments

    $.each($("#attachmentsTable").DataTable().rows().data(), function (i, target) { // NOSONAR

        template.attachments.push({

            name: unescapeHtml(target[1]),

            content: target[3],

            type: target[4],

        })

    })



    if (idx != -1) { // NOSONAR

        template.id = templates[idx].id

        api.templateId.put(template)

            .success(function (data) { // NOSONAR

                successFlash("Template edited successfully!")

                load()

                dismiss()

            })

            .error(function (data) { // NOSONAR

                modalError(data.responseJSON.message)

            })

    } else {

        // Submit the template

        api.templates.post(template)

            .success(function (data) { // NOSONAR

                successFlash("Template added successfully!")

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

    $("#attachmentsTable").dataTable().DataTable().clear().draw()

    $("#name").val("")

    $("#subject").val("")

    $("#text_editor").val("")

    $("#html_editor").val("")

    $("#modal").modal('hide')

}



let deleteTemplate = function (idx) { // NOSONAR

    Swal.fire({

        title: "Are you sure?",

        text: "This will delete the template. This can't be undone!",

        type: "warning",

        animation: false,

        showCancelButton: true,

        confirmButtonText: "Delete " + escapeHtml(templates[idx].name),

        confirmButtonColor: "#428bca",

        reverseButtons: true,

        allowOutsideClick: false,

        preConfirm: function () { // NOSONAR

            return new Promise(function (resolve, reject) { // NOSONAR

                api.templateId.delete(templates[idx].id)

                    .success(function (msg) { // NOSONAR

                        resolve()

                    })

                    .error(function (data) { // NOSONAR

                        reject(data.responseJSON.message)

                    })

            })

        }

    }).then(function (result) { // NOSONAR

        if(result.value) {

            Swal.fire(

                'Template Deleted!',

                'This template has been deleted!',

                'success'

            );

        }

        $('button:contains("OK")').on('click', function () { // NOSONAR

            location.reload()

        })

    })

}



// deleteTemplate defined above



function attach(files) { // NOSONAR

    let attachmentsTable = $("#attachmentsTable").DataTable({

        destroy: true,

        "order": [

            [1, "asc"]

        ],

        columnDefs: [{

            orderable: false,

            targets: "no-sort"

        }, {

            sClass: "datatable_hidden",

            targets: [3, 4]

        }]

    });

    $.each(files, function (i, file) { // NOSONAR

        let reader = new FileReader();

        /* Make this a datatable */

        reader.onload = function (e) { // NOSONAR

            let icon = icons[file.type] || "fa-file-o"

            // Add the record to the modal

            attachmentsTable.row.add([

                '<i class="fa ' + icon + '"></i>',

                escapeHtml(file.name),

                '<span class="remove-row"><i class="fa fa-trash-o"></i></span>',

                reader.result.split(",")[1],

                file.type || "application/octet-stream"

            ]).draw()

        }

        reader.onerror = function (e) { // NOSONAR

            console.log(e)

        }

        reader.readAsDataURL(file)

    })

}



function edit(idx) { // NOSONAR

    $("#modalSubmit").unbind('click').click(function () { // NOSONAR

        save(idx)

    })

    $("#attachmentUpload").unbind('click').click(function () { // NOSONAR

        this.value = null

    })

    $("#html_editor").ckeditor()

    setupAutocomplete(CKEDITOR.instances["html_editor"])

    $("#attachmentsTable").show()

    let attachmentsTable = $('#attachmentsTable').DataTable({

        destroy: true,

        "order": [

            [1, "asc"]

        ],

        columnDefs: [{

            orderable: false,

            targets: "no-sort"

        }, {

            sClass: "datatable_hidden",

            targets: [3, 4]

        }]

    });

    let template = {

        attachments: []

    }

    if (idx != -1) { // NOSONAR

        $("#templateModalLabel").text("Edit Template")

        template = templates[idx]

        $("#name").val(template.name)

        $("#subject").val(template.subject)

        $("#envelope-sender").val(template.envelope_sender)

        $("#html_editor").val(template.html)

        $("#text_editor").val(template.text)

        let attachmentRows = []

        $.each(template.attachments, function (i, file) { // NOSONAR

            let icon = icons[file.type] || "fa-file-o"

            // Add the record to the modal

            attachmentRows.push([

                '<i class="fa ' + icon + '"></i>',

                escapeHtml(file.name),

                '<span class="remove-row"><i class="fa fa-trash-o"></i></span>',

                file.content,

                file.type || "application/octet-stream"

            ])

        })

        attachmentsTable.rows.add(attachmentRows).draw()

        if (template.html.includes("{{.Tracker}}")) {

            $("#use_tracker_checkbox").prop("checked", true)

        } else {

            $("#use_tracker_checkbox").prop("checked", false)

        }



    } else {

        $("#templateModalLabel").text("New Template")

    }

    // Handle Deletion

    $("#attachmentsTable").unbind('click').on("click", "span>i.fa-trash-o", function () { // NOSONAR

        attachmentsTable.row($(this).parents('tr'))

            .remove()

            .draw();

    })

}



function copy(idx) { // NOSONAR

    $("#modalSubmit").unbind('click').click(function () { // NOSONAR

        save(-1)

    })

    $("#attachmentUpload").unbind('click').click(function () { // NOSONAR

        this.value = null

    })

    $("#html_editor").ckeditor()

    $("#attachmentsTable").show()

    let attachmentsTable = $('#attachmentsTable').DataTable({

        destroy: true,

        "order": [

            [1, "asc"]

        ],

        columnDefs: [{

            orderable: false,

            targets: "no-sort"

        }, {

            sClass: "datatable_hidden",

            targets: [3, 4]

        }]

    });

    let template = templates[idx]

    $("#name").val("Copy of " + template.name)

    $("#subject").val(template.subject)

    $("#envelope-sender").val(template.envelope_sender)

    $("#html_editor").val(template.html)

    $("#text_editor").val(template.text)

    $.each(template.attachments, function (i, file) { // NOSONAR

        let icon = icons[file.type] || "fa-file-o"

        // Add the record to the modal

        attachmentsTable.row.add([

            '<i class="fa ' + icon + '"></i>',

            escapeHtml(file.name),

            '<span class="remove-row"><i class="fa fa-trash-o"></i></span>',

            file.content,

            file.type || "application/octet-stream"

        ]).draw()

    })

    // Handle Deletion

    $("#attachmentsTable").unbind('click').on("click", "span>i.fa-trash-o", function () { // NOSONAR

        attachmentsTable.row($(this).parents('tr'))

            .remove()

            .draw();

    })

    if (template.html.includes("{{.Tracker}}")) {

        $("#use_tracker_checkbox").prop("checked", true)

    } else {

        $("#use_tracker_checkbox").prop("checked", false)

    }

}



function importEmail() { // NOSONAR

    let raw = $("#email_content").val()

    let convert_links = $("#convert_links_checkbox").prop("checked")

    if (!raw) { // NOSONAR

        modalError("No Content Specified!")

    } else {

        api.import_email({

                content: raw,

                convert_links: convert_links

            })

            .success(function (data) { // NOSONAR

                $("#text_editor").val(data.text)

                $("#html_editor").val(data.html)

                $("#subject").val(data.subject)

                // If the HTML is provided, let's open that view in the editor

                if (data.html) {

                    CKEDITOR.instances["html_editor"].setMode('wysiwyg')

                    $('.nav-tabs a[href="#html"]').click()

                }

                $("#importEmailModal").modal("hide")

            })

            .error(function (data) { // NOSONAR

                modalError(data.responseJSON.message)

            })

    }

}



function load() { // NOSONAR

    $("#templateTable").hide()

    $("#emptyMessage").hide()

    $("#loading").show()

    api.templates.get()

        .success(function (ts) { // NOSONAR

            templates = ts

            $("#loading").hide()

            if (templates.length > 0) {

                $("#templateTable").show()

                let templateTable = $("#templateTable").DataTable({

                    destroy: true,

                    columnDefs: [{

                        orderable: false,

                        targets: "no-sort"

                    }]

                });

                templateTable.clear()

                let templateRows = []

                $.each(templates, function (i, template) { // NOSONAR

                    templateRows.push([

                        escapeHtml(template.name),

                        moment(template.modified_date).format('MMMM Do YYYY, h:mm:ss a'),

                        "<div class='pull-right'><span data-toggle='modal' data-backdrop='static' data-target='#modal'><button class='btn btn-primary' data-toggle='tooltip' data-placement='left' title='Edit Template' onclick='edit(" + i + ")'>\ // NOSONAR

                    <i class='fa fa-pencil'></i>\ // NOSONAR

                    </button></span>\

		    <span data-toggle='modal' data-target='#modal'><button class='btn btn-primary' data-toggle='tooltip' data-placement='left' title='Copy Template' onclick='copy(" + i + ")'>\ // NOSONAR

                    <i class='fa fa-copy'></i>\ // NOSONAR

                    </button></span>\

                    <button class='btn btn-danger' data-toggle='tooltip' data-placement='left' title='Delete Template' onclick='deleteTemplate(" + i + ")'>\ // NOSONAR

                    <i class='fa fa-trash-o'></i>\ // NOSONAR

                    </button></div>"

                    ])

                })

                templateTable.rows.add(templateRows).draw()

                $('[data-toggle="tooltip"]').tooltip()

            } else {

                $("#emptyMessage").show()

            }

        })

        .error(function () { // NOSONAR

            $("#loading").hide()

            errorFlash("Error fetching templates")

        })

}



$(document).ready(function () { // NOSONAR

    // Setup multiple modals

    setupMultipleModals();

    $('#modal').on('hidden.bs.modal', function (event) { // NOSONAR

        dismiss()

    });

    $("#importEmailModal").on('hidden.bs.modal', function (event) { // NOSONAR

        $("#email_content").val("")

    })

    CKEDITOR.on('dialogDefinition', function (ev) { // NOSONAR

        // Take the dialog name and its definition from the event data.

        let dialogName = ev.data.name;

        let dialogDefinition = ev.data.definition;



        // Check if the definition is from the dialog window you are interested in (the "Link" dialog window).

        if (dialogName == 'link') {

            dialogDefinition.minWidth = 500

            dialogDefinition.minHeight = 100



            // Remove the linkType field

            let infoTab = dialogDefinition.getContents('info');

            infoTab.get('linkType').hidden = true;

        }

    });

    load()



})

