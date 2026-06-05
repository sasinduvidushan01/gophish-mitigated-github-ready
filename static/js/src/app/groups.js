let groups = []

// Save attempts to POST or PUT to /groups/
function save(id) { // NOSONAR
    let targets = []
    $.each($("#targetsTable").DataTable().rows().data(), function (i, target) { // NOSONAR
        targets.push({
            first_name: unescapeHtml(target[0]),
            last_name: unescapeHtml(target[1]),
            email: unescapeHtml(target[2]),
            position: unescapeHtml(target[3])
        })
    })
    let group = {
        name: $("#name").val(),
        targets: targets
    }
    // Submit the group
    if (id != -1) { // NOSONAR
        // If we're just editing an existing group,
        // we need to PUT /groups/:id
        group.id = id
        api.groupId.put(group)
            .success(function (data) { // NOSONAR
                successFlash("Group updated successfully!")
                load()
                dismiss()
                $("#modal").modal('hide')
            })
            .error(function (data) { // NOSONAR
                modalError(data.responseJSON.message)
            })
    } else {
        // Else, if this is a new group, POST it
        // to /groups
        api.groups.post(group)
            .success(function (data) { // NOSONAR
                successFlash("Group added successfully!")
                load()
                dismiss()
                $("#modal").modal('hide')
            })
            .error(function (data) { // NOSONAR
                modalError(data.responseJSON.message)
            })
    }
}

function dismiss() { // NOSONAR
    $("#targetsTable").dataTable().DataTable().clear().draw()
    $("#name").val("")
    $("#modal\\.flashes").empty()
}

function edit(id) { // NOSONAR
    let targets = $("#targetsTable").dataTable({
        destroy: true, // Destroy any other instantiated table - http://datatables.net/manual/tech-notes/3#destroy
        columnDefs: [{
            orderable: false,
            targets: "no-sort"
        }]
    })
    $("#modalSubmit").unbind('click').click(function () { // NOSONAR
        save(id)
    })
    if (id == -1) {
        $("#groupModalLabel").text("New Group");
    } else {
        $("#groupModalLabel").text("Edit Group");
        api.groupId.get(id)
            .success(function (group) { // NOSONAR
                $("#name").val(group.name)
                let targetRows = []
                $.each(group.targets, function (i, record) { // NOSONAR
                  targetRows.push([
                      escapeHtml(record.first_name),
                      escapeHtml(record.last_name),
                      escapeHtml(record.email),
                      escapeHtml(record.position),
                      '<span style="cursor:pointer;"><i class="fa fa-trash-o"></i></span>'
                  ])
                });
                targets.DataTable().rows.add(targetRows).draw()
            })
            .error(function () { // NOSONAR
                errorFlash("Error fetching group")
            })
    }
    // Handle file uploads
    $("#csvupload").fileupload({
        url: "/api/import/group",
        dataType: "json",
        beforeSend: function (xhr) { // NOSONAR
            xhr.setRequestHeader('Authorization', 'Bearer ' + user.api_key);
        },
        add: function (e, data) { // NOSONAR
            $("#modal\\.flashes").empty()
            let acceptFileTypes = /(csv|txt)$/i;
            let filename = data.originalFiles[0]['name']
            if (filename && !acceptFileTypes.test(filename.split(".").pop())) {
                modalError("Unsupported file extension (use .csv or .txt)")
                return false;
            }
            data.submit();
        },
        done: function (e, data) { // NOSONAR
            $.each(data.result, function (i, record) { // NOSONAR
                addTarget(
                    record.first_name,
                    record.last_name,
                    record.email,
                    record.position);
            });
            targets.DataTable().draw();
        }
    })
}

let downloadCSVTemplate = function () { // NOSONAR
    let csvScope = [{
        'First Name': 'Example',
        'Last Name': 'User',
        'Email': 'foobar@example.com',
        'Position': 'Systems Administrator'
    }]
    let filename = 'group_template.csv'
    let csvString = Papa.unparse(csvScope, {})
    let csvData = new Blob([csvString], {
        type: 'text/csv;charset=utf-8;'
    });
    if (navigator.msSaveBlob) {
        navigator.msSaveBlob(csvData, filename);
    } else {
        let csvURL = globalThis.URL.createObjectURL(csvData);
        let dlLink = document.createElement('a');
        dlLink.href = csvURL;
        dlLink.setAttribute('download', filename)
        document.body.appendChild(dlLink)
        dlLink.click();
        dlLink.remove()
    }
}


let deleteGroup = function (id) { // NOSONAR
    let group = groups.find(function (x) { // NOSONAR
        return x.id === id
    })
    if (!group) { // NOSONAR
        return
    }
    Swal.fire({
        title: "Are you sure?",
        text: "This will delete the group. This can't be undone!",
        type: "warning",
        animation: false,
        showCancelButton: true,
        confirmButtonText: "Delete " + escapeHtml(group.name),
        confirmButtonColor: "#428bca",
        reverseButtons: true,
        allowOutsideClick: false,
        preConfirm: function () { // NOSONAR
            return new Promise(function (resolve, reject) { // NOSONAR
                api.groupId.delete(id)
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
                'Group Deleted!',
                'This group has been deleted!',
                'success'
            );
        }
        $('button:contains("OK")').on('click', function () { // NOSONAR
            location.reload()
        })
    })
}

function addTarget(firstNameInput, lastNameInput, emailInput, positionInput) { // NOSONAR
    // Create new data row.
    let email = escapeHtml(emailInput).toLowerCase();
    let newRow = [
        escapeHtml(firstNameInput),
        escapeHtml(lastNameInput),
        email,
        escapeHtml(positionInput),
        '<span style="cursor:pointer;"><i class="fa fa-trash-o"></i></span>'
    ];

    // Check table to see if email already exists.
    let targetsTable = targets.DataTable();
    let existingRowIndex = targetsTable
        .column(2, {
            order: "index"
        }) // Email column has index of 2
        .data()
        .indexOf(email);
    // Update or add new row as necessary.
    if (existingRowIndex >= 0) {
        targetsTable
            .row(existingRowIndex, {
                order: "index"
            })
            .data(newRow);
    } else {
        targetsTable.row.add(newRow);
    }
}

function load() { // NOSONAR
    $("#groupTable").hide()
    $("#emptyMessage").hide()
    $("#loading").show()
    api.groups.summary()
        .success(function (response) { // NOSONAR
            $("#loading").hide()
            if (response.total > 0) {
                groups = response.groups
                $("#emptyMessage").hide()
                $("#groupTable").show()
                let groupTable = $("#groupTable").DataTable({
                    destroy: true,
                    columnDefs: [{
                        orderable: false,
                        targets: "no-sort"
                    }]
                });
                groupTable.clear();
                let groupRows = []
                $.each(groups, function (i, group) { // NOSONAR
                    groupRows.push([
                        escapeHtml(group.name),
                        escapeHtml(group.num_targets),
                        moment(group.modified_date).format('MMMM Do YYYY, h:mm:ss a'),
                        "<div class='pull-right'><button class='btn btn-primary' data-toggle='modal' data-backdrop='static' data-target='#modal' onclick='edit(" + group.id + ")'>\ // NOSONAR
                    <i class='fa fa-pencil'></i>\ // NOSONAR
                    </button>\
                    <button class='btn btn-danger' onclick='deleteGroup(" + group.id + ")'>\ // NOSONAR
                    <i class='fa fa-trash-o'></i>\ // NOSONAR
                    </button></div>"
                    ])
                })
                groupTable.rows.add(groupRows).draw()
            } else {
                $("#emptyMessage").show()
            }
        })
        .error(function () { // NOSONAR
            errorFlash("Error fetching groups")
        })
}

$(document).ready(function () { // NOSONAR
    load()
    // Setup the event listeners
    // Handle manual additions
    $("#targetForm").submit(function () { // NOSONAR
        // Validate the form data
        let targetForm = document.getElementById("targetForm")
        if (!targetForm.checkValidity()) { // NOSONAR
            targetForm.reportValidity()
            return
        }
        addTarget(
            $("#firstName").val(),
            $("#lastName").val(),
            $("#email").val(),
            $("#position").val());
        targets.DataTable().draw();

        // Reset user input.
        $("#targetForm>div>input").val('');
        $("#firstName").focus();
        return false;
    });
    // Handle Deletion
    $("#targetsTable").on("click", "span>i.fa-trash-o", function () { // NOSONAR
        targets.DataTable()
            .row($(this).parents('tr'))
            .remove()
            .draw();
    });
    $("#modal").on("hide.bs.modal", function () { // NOSONAR
        dismiss();
    });
    $("#csv-template").click(downloadCSVTemplate)
});
