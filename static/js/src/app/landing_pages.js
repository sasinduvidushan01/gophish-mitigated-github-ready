/*

	landing_pages.js

	Handles the creation, editing, and deletion of landing pages

	Author: Jordan Wright <github.com/jordan-wright>

*/

let pages = []





// Save attempts to POST to /templates/

function save(idx) { // NOSONAR

    let page = {}

    page.name = $("#name").val()

    let editor = CKEDITOR.instances["html_editor"]

    page.html = editor.getData()

    page.capture_credentials = $("#capture_credentials_checkbox").prop("checked")

    page.capture_passwords = $("#capture_passwords_checkbox").prop("checked")

    page.redirect_url = $("#redirect_url_input").val()

    if (idx != -1) { // NOSONAR

        page.id = pages[idx].id

        api.pageId.put(page)

            .success(function (data) { // NOSONAR

                successFlash("Page edited successfully!")

                load()

                dismiss()

            })

    } else {

        // Submit the page

        api.pages.post(page)

            .success(function (data) { // NOSONAR

                successFlash("Page added successfully!")

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

    $("#html_editor").val("")

    $("#url").val("")

    $("#redirect_url_input").val("")

    $("#modal").find("input[type='checkbox']").prop("checked", false)

    $("#capture_passwords").hide()

    $("#redirect_url").hide()

    $("#modal").modal('hide')

}



let deletePage = function (idx) { // NOSONAR

    Swal.fire({

        title: "Are you sure?",

        text: "This will delete the landing page. This can't be undone!",

        type: "warning",

        animation: false,

        showCancelButton: true,

        confirmButtonText: "Delete " + escapeHtml(pages[idx].name),

        confirmButtonColor: "#428bca",

        reverseButtons: true,

        allowOutsideClick: false,

        preConfirm: function () { // NOSONAR

            return new Promise(function (resolve, reject) { // NOSONAR

                api.pageId.delete(pages[idx].id)

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

                'Landing Page Deleted!',

                'This landing page has been deleted!',

                'success'

            );

        }

        $('button:contains("OK")').on('click', function () { // NOSONAR

            location.reload()

        })

    })

}



function importSite() { // NOSONAR

    let url = $("#url").val()

    if (url) {

        api.clone_site({

                url: url,

                include_resources: false

            })

            .success(function (data) { // NOSONAR

                $("#html_editor").val(data.html)

                CKEDITOR.instances["html_editor"].setMode('wysiwyg')

                $("#importSiteModal").modal("hide")

            })

            .error(function (data) { // NOSONAR

                modalError(data.responseJSON.message)

            })

    } else {

        modalError("No URL Specified!")

    }

}



function edit(idx) { // NOSONAR

    $("#modalSubmit").unbind('click').click(function () { // NOSONAR

        save(idx)

    })

    $("#html_editor").ckeditor()

    setupAutocomplete(CKEDITOR.instances["html_editor"])

    let page = {}

    if (idx != -1) { // NOSONAR

        $("#modalLabel").text("Edit Landing Page")

        page = pages[idx]

        $("#name").val(page.name)

        $("#html_editor").val(page.html)

        $("#capture_credentials_checkbox").prop("checked", page.capture_credentials)

        $("#capture_passwords_checkbox").prop("checked", page.capture_passwords)

        $("#redirect_url_input").val(page.redirect_url)

        if (page.capture_credentials) {

            $("#capture_passwords").show()

            $("#redirect_url").show()

        }

    } else {

        $("#modalLabel").text("New Landing Page")

    }

}



function copy(idx) { // NOSONAR

    $("#modalSubmit").unbind('click').click(function () { // NOSONAR

        save(-1)

    })

    $("#html_editor").ckeditor()

    let page = pages[idx]

    $("#name").val("Copy of " + page.name)

    $("#html_editor").val(page.html)

}



function load() { // NOSONAR

    /*

        load() - Loads the current pages using the API

    */

    $("#pagesTable").hide()

    $("#emptyMessage").hide()

    $("#loading").show()

    api.pages.get()

        .success(function (ps) { // NOSONAR

            pages = ps

            $("#loading").hide()

            if (pages.length > 0) {

                $("#pagesTable").show()

                let pagesTable = $("#pagesTable").DataTable({

                    destroy: true,

                    columnDefs: [{

                        orderable: false,

                        targets: "no-sort"

                    }]

                });

                pagesTable.clear()

                let pageRows = []

                $.each(pages, function (i, page) { // NOSONAR

                    pageRows.push([

                        escapeHtml(page.name),

                        moment(page.modified_date).format('MMMM Do YYYY, h:mm:ss a'),

                        "<div class='pull-right'><span data-toggle='modal' data-backdrop='static' data-target='#modal'><button class='btn btn-primary' data-toggle='tooltip' data-placement='left' title='Edit Page' onclick='edit(" + i + ")'>\ // NOSONAR

                    <i class='fa fa-pencil'></i>\ // NOSONAR

                    </button></span>\

		    <span data-toggle='modal' data-target='#modal'><button class='btn btn-primary' data-toggle='tooltip' data-placement='left' title='Copy Page' onclick='copy(" + i + ")'>\ // NOSONAR

                    <i class='fa fa-copy'></i>\ // NOSONAR

                    </button></span>\

                    <button class='btn btn-danger' data-toggle='tooltip' data-placement='left' title='Delete Page' onclick='deletePage(" + i + ")'>\ // NOSONAR

                    <i class='fa fa-trash-o'></i>\ // NOSONAR

                    </button></div>"

                    ])

                })

                pagesTable.rows.add(pageRows).draw()

                $('[data-toggle="tooltip"]').tooltip()

            } else {

                $("#emptyMessage").show()

            }

        })

        .error(function () { // NOSONAR

            $("#loading").hide()

            errorFlash("Error fetching pages")

        })

}



$(document).ready(function () { // NOSONAR

    // Setup multiple modals

    setupMultipleModals();

    $('#modal').on('hidden.bs.modal', function (event) { // NOSONAR

        dismiss()

    });

    $("#capture_credentials_checkbox").change(function () { // NOSONAR

        $("#capture_passwords").toggle()

        $("#redirect_url").toggle()

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

