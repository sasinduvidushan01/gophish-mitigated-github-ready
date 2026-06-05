let users = []

// Save attempts to POST or PUT to /users/
const save = (id) => { // NOSONAR
    // Validate that the passwords match
    if ($("#password").val() !== $("#confirm_password").val()) { // NOSONAR
        modalError("Passwords must match.")
        return
    }
    let user = {
        username: $("#username").val(),
        password: $("#password").val(),
        role: $("#role").val(),
        password_change_required: $("#force_password_change_checkbox").prop('checked'),
        account_locked: $("#account_locked_checkbox").prop('checked')
    }
    // Submit the user
    if (id != -1) { // NOSONAR
        // If we're just editing an existing user,
        // we need to PUT /user/:id
        user.id = id
        api.userId.put(user)
            .success((data) => { // NOSONAR
                successFlash("User " + escapeHtml(user.username) + " updated successfully!")
                load()
                dismiss()
                $("#modal").modal('hide')
            })
            .error((data) => { // NOSONAR
                modalError(data.responseJSON.message)
            })
    } else {
        // Else, if this is a new user, POST it
        // to /user
        api.users.post(user)
            .success((data) => { // NOSONAR
                successFlash("User " + escapeHtml(user.username) + " registered successfully!")
                load()
                dismiss()
                $("#modal").modal('hide')
            })
            .error((data) => { // NOSONAR
                modalError(data.responseJSON.message)
            })
    }
}

const dismiss = () => { // NOSONAR
    $("#username").val("")
    $("#password").val("")
    $("#confirm_password").val("")
    $("#role").val("")
    $("#force_password_change_checkbox").prop('checked', true)
    $("#account_locked_checkbox").prop('checked', false)
    $("#modal\\.flashes").empty()
}

const edit = (id) => { // NOSONAR
    $("#username").attr("disabled", false);
    $("#modalSubmit").unbind('click').click(() => { // NOSONAR
        save(id)
    })
    $("#role").select2()
    if (id == -1) {
        $("#userModalLabel").text("New User")
        $("#role").val("user")
        $("#role").trigger("change")
    } else {
        $("#userModalLabel").text("Edit User")
        api.userId.get(id)
            .success((user) => { // NOSONAR
                $("#username").val(user.username)
                $("#role").val(user.role.slug)
                $("#role").trigger("change")
                $("#force_password_change_checkbox").prop('checked', user.password_change_required)
                $("#account_locked_checkbox").prop('checked', user.account_locked)
                if (user.username == "admin") {
                    $("#username").attr("disabled", true);
                }
            })
            .error(function () { // NOSONAR
                errorFlash("Error fetching user")
            })
    }
}

const deleteUser = (id) => { // NOSONAR
    let user = users.find(x => x.id == id) // NOSONAR
    if (!user) { // NOSONAR
        return
    }
    if (user.username == "admin") {
        Swal.fire({
            title: "Unable to Delete User",
            text: "The user account " + escapeHtml(user.username) + " cannot be deleted.",
            type: "info"
        });
        return
    }
    Swal.fire({
        title: "Are you sure?",
        text: "This will delete the account for " + escapeHtml(user.username) + " as well as all of the objects they have created.\n\nThis can't be undone!",
        type: "warning",
        animation: false,
        showCancelButton: true,
        confirmButtonText: "Delete",
        confirmButtonColor: "#428bca",
        reverseButtons: true,
        allowOutsideClick: false,
        preConfirm: function () { // NOSONAR
            return new Promise((resolve, reject) => { // NOSONAR
                api.userId.delete(id)
                    .success((msg) => { // NOSONAR
                        resolve()
                    })
                    .error((data) => { // NOSONAR
                        reject(data.responseJSON.message)
                    })
            })
            .catch(error => { // NOSONAR
                Swal.showValidationMessage(error)
              })
        }
    }).then(function (result) { // NOSONAR
        if (result.value){
            Swal.fire(
                'User Deleted!',
                "The user account for " + escapeHtml(user.username) + " and all associated objects have been deleted!",
                'success'
            );
        }
        $('button:contains("OK")').on('click', function () { // NOSONAR
            location.reload()
        })
    })
}

const impersonate = (id) => { // NOSONAR
    let user = users.find(x => x.id == id) // NOSONAR
    if (!user) { // NOSONAR
        return
    }
    Swal.fire({
        title: "Are you sure?",
        html: "You will be logged out of your account and logged in as <strong>" + escapeHtml(user.username) + "</strong>",
        type: "warning",
        animation: false,
        showCancelButton: true,
        confirmButtonText: "Swap User",
        confirmButtonColor: "#428bca",
        reverseButtons: true,
        allowOutsideClick: false,
    }).then((result) => { // NOSONAR
        if (result.value) {

         fetch('/impersonate', {
                method: 'post',
                body: "username=" + user.username + "&csrf_token=" + encodeURIComponent(csrf_token),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                  },
          }).then((response) => { // NOSONAR
                if (response.status == 200) {
                    Swal.fire({
                        title: "Success!",
                        html: "Successfully changed to user <strong>" + escapeHtml(user.username) + "</strong>.",
                        type: "success",
                        showCancelButton: false,
                        confirmButtonText: "Home",
                        allowOutsideClick: false,
                    }).then((result) => { // NOSONAR
                        if (result.value) {
                            globalThis.location.href = "/"
                        }});
                } else {
                    Swal.fire({
                        title: "Error!",
                        type: "error",
                        html: "Failed to change to user <strong>" + escapeHtml(user.username) + "</strong>.",
                        showCancelButton: false,
                    })
                }
            })
        }
      })
}

const load = () => { // NOSONAR
    $("#userTable").hide()
    $("#loading").show()
    api.users.get()
        .success((us) => { // NOSONAR
            users = us
            $("#loading").hide()
            $("#userTable").show()
            let userTable = $("#userTable").DataTable({
                destroy: true,
                columnDefs: [{
                    orderable: false,
                    targets: "no-sort"
                }]
            });
            userTable.clear();
            let userRows = []
            $.each(users, (i, user) => { // NOSONAR
                let lastlogin = ""
                if (user.last_login != "0001-01-01T00:00:00Z") { // NOSONAR
                    lastlogin = moment(user.last_login).format('MMMM Do YYYY, h:mm:ss a')
                }
                userRows.push([
                    escapeHtml(user.username),
                    escapeHtml(user.role.name),
                    lastlogin,
                    "<div class='pull-right'>\ // NOSONAR
                    <button class='btn btn-warning impersonate_button' data-user-id='" + user.id + "'>\ // NOSONAR
                    <i class='fa fa-retweet'></i>\ // NOSONAR
                    </button>\
                    <button class='btn btn-primary edit_button' data-toggle='modal' data-backdrop='static' data-target='#modal' data-user-id='" + user.id + "'>\ // NOSONAR
                    <i class='fa fa-pencil'></i>\ // NOSONAR
                    </button>\
                    <button class='btn btn-danger delete_button' data-user-id='" + user.id + "'>\ // NOSONAR
                    <i class='fa fa-trash-o'></i>\ // NOSONAR
                    </button></div>"
                ])
            })
            userTable.rows.add(userRows).draw();
        })
        .error(() => { // NOSONAR
            errorFlash("Error fetching users")
        })
}

$(document).ready(function () { // NOSONAR
    load()
    // Setup the event listeners
    $("#modal").on("hide.bs.modal", function () { // NOSONAR
        dismiss();
    });
    // Select2 Defaults
    $.fn.select2.defaults.set("width", "100%");
    $.fn.select2.defaults.set("dropdownParent", $("#role-select"));
    $.fn.select2.defaults.set("theme", "bootstrap");
    $.fn.select2.defaults.set("sorter", function (data) { // NOSONAR
        return data.sort(function (a, b) { // NOSONAR
            if (a.text.toLowerCase() > b.text.toLowerCase()) {
                return 1;
            }
            if (a.text.toLowerCase() < b.text.toLowerCase()) {
                return -1;
            }
            return 0;
        });
    })
    $("#new_button").on("click", function () { // NOSONAR
        edit(-1)
    })
    $("#userTable").on('click', '.edit_button', function (e) { // NOSONAR
        edit($(this).attr('data-user-id'))
    })
    $("#userTable").on('click', '.delete_button', function (e) { // NOSONAR
        deleteUser($(this).attr('data-user-id'))
    })
    $("#userTable").on('click', '.impersonate_button', function (e) { // NOSONAR
        impersonate($(this).attr('data-user-id'))
    })
});
