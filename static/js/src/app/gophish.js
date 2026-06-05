function errorFlash(message) { // NOSONAR

    $("#flashes").empty()

    $("#flashes").append("<div style=\"text-align:center\" class=\"alert alert-danger\">\ // NOSONAR

        <i class=\"fa fa-exclamation-circle\"></i> " + message + "</div>") // NOSONAR

}



function successFlash(message) { // NOSONAR

    $("#flashes").empty()

    $("#flashes").append("<div style=\"text-align:center\" class=\"alert alert-success\">\ // NOSONAR

        <i class=\"fa fa-check-circle\"></i> " + message + "</div>") // NOSONAR

}



// Fade message after n seconds

function errorFlashFade(message, fade) { // NOSONAR

    $("#flashes").empty()

    $("#flashes").append("<div style=\"text-align:center\" class=\"alert alert-danger\">\ // NOSONAR

        <i class=\"fa fa-exclamation-circle\"></i> " + message + "</div>") // NOSONAR

    setTimeout(function(){  // NOSONAR

        $("#flashes").empty() 

    }, fade * 1000);

}

// Fade message after n seconds

function successFlashFade(message, fade) {   // NOSONAR

    $("#flashes").empty()

    $("#flashes").append("<div style=\"text-align:center\" class=\"alert alert-success\">\ // NOSONAR

        <i class=\"fa fa-check-circle\"></i> " + message + "</div>") // NOSONAR

    setTimeout(function(){  // NOSONAR

        $("#flashes").empty() 

    }, fade * 1000);



}



function modalError(message) { // NOSONAR

    $("#modal\\.flashes").empty().append("<div style=\"text-align:center\" class=\"alert alert-danger\">\ // NOSONAR

        <i class=\"fa fa-exclamation-circle\"></i> " + message + "</div>") // NOSONAR

}



function query(endpoint, method, data, async) { // NOSONAR

    return $.ajax({

        url: "/api" + endpoint,

        async: async,

        method: method,

        data: JSON.stringify(data),

        dataType: "json",

        contentType: "application/json",

        beforeSend: function (xhr) { // NOSONAR

            xhr.setRequestHeader('Authorization', 'Bearer ' + user.api_key);

        }

    })

}



function escapeHtml(text) { // NOSONAR

    return $("<div/>").text(text).html()

}

globalThis.escapeHtml = escapeHtml



function unescapeHtml(html) { // NOSONAR

    return $("<div/>").html(html).text()

}



/**

 * 

 * @param {string} string - The input string to capitalize

 * 

 */

let capitalize = function (string) { // NOSONAR

    return string.charAt(0).toUpperCase() + string.slice(1);

}



/*

Define our API Endpoints

*/

let api = {

    // campaigns contains the endpoints for /campaigns

    campaigns: {

        // get() - Queries the API for GET /campaigns

        get: function () { // NOSONAR

            return query("/campaigns/", "GET", {}, false)

        },

        // post() - Posts a campaign to POST /campaigns

        post: function (data) { // NOSONAR

            return query("/campaigns/", "POST", data, false)

        },

        // summary() - Queries the API for GET /campaigns/summary

        summary: function () { // NOSONAR

            return query("/campaigns/summary", "GET", {}, false)

        }

    },

    // campaignId contains the endpoints for /campaigns/:id

    campaignId: {

        // get() - Queries the API for GET /campaigns/:id

        get: function (id) { // NOSONAR

            return query("/campaigns/" + id, "GET", {}, true)

        },

        // delete() - Deletes a campaign at DELETE /campaigns/:id

        delete: function (id) { // NOSONAR

            return query("/campaigns/" + id, "DELETE", {}, false)

        },

        // results() - Queries the API for GET /campaigns/:id/results

        results: function (id) { // NOSONAR

            return query("/campaigns/" + id + "/results", "GET", {}, true)

        },

        // complete() - Completes a campaign at POST /campaigns/:id/complete

        complete: function (id) { // NOSONAR

            return query("/campaigns/" + id + "/complete", "GET", {}, true)

        },

        // summary() - Queries the API for GET /campaigns/summary

        summary: function (id) { // NOSONAR

            return query("/campaigns/" + id + "/summary", "GET", {}, true)

        }

    },

    // groups contains the endpoints for /groups

    groups: {

        // get() - Queries the API for GET /groups

        get: function () { // NOSONAR

            return query("/groups/", "GET", {}, false)

        },

        // post() - Posts a group to POST /groups

        post: function (group) { // NOSONAR

            return query("/groups/", "POST", group, false)

        },

        // summary() - Queries the API for GET /groups/summary

        summary: function () { // NOSONAR

            return query("/groups/summary", "GET", {}, true)

        }

    },

    // groupId contains the endpoints for /groups/:id

    groupId: {

        // get() - Queries the API for GET /groups/:id

        get: function (id) { // NOSONAR

            return query("/groups/" + id, "GET", {}, false)

        },

        // put() - Puts a group to PUT /groups/:id

        put: function (group) { // NOSONAR

            return query("/groups/" + group.id, "PUT", group, false)

        },

        // delete() - Deletes a group at DELETE /groups/:id

        delete: function (id) { // NOSONAR

            return query("/groups/" + id, "DELETE", {}, false)

        }

    },

    // templates contains the endpoints for /templates

    templates: {

        // get() - Queries the API for GET /templates

        get: function () { // NOSONAR

            return query("/templates/", "GET", {}, false)

        },

        // post() - Posts a template to POST /templates

        post: function (template) { // NOSONAR

            return query("/templates/", "POST", template, false)

        }

    },

    // templateId contains the endpoints for /templates/:id

    templateId: {

        // get() - Queries the API for GET /templates/:id

        get: function (id) { // NOSONAR

            return query("/templates/" + id, "GET", {}, false)

        },

        // put() - Puts a template to PUT /templates/:id

        put: function (template) { // NOSONAR

            return query("/templates/" + template.id, "PUT", template, false)

        },

        // delete() - Deletes a template at DELETE /templates/:id

        delete: function (id) { // NOSONAR

            return query("/templates/" + id, "DELETE", {}, false)

        }

    },

    // pages contains the endpoints for /pages

    pages: {

        // get() - Queries the API for GET /pages

        get: function () { // NOSONAR

            return query("/pages/", "GET", {}, false)

        },

        // post() - Posts a page to POST /pages

        post: function (page) { // NOSONAR

            return query("/pages/", "POST", page, false)

        }

    },

    // pageId contains the endpoints for /pages/:id

    pageId: {

        // get() - Queries the API for GET /pages/:id

        get: function (id) { // NOSONAR

            return query("/pages/" + id, "GET", {}, false)

        },

        // put() - Puts a page to PUT /pages/:id

        put: function (page) { // NOSONAR

            return query("/pages/" + page.id, "PUT", page, false)

        },

        // delete() - Deletes a page at DELETE /pages/:id

        delete: function (id) { // NOSONAR

            return query("/pages/" + id, "DELETE", {}, false)

        }

    },

    // SMTP contains the endpoints for /smtp

    SMTP: {

        // get() - Queries the API for GET /smtp

        get: function () { // NOSONAR

            return query("/smtp/", "GET", {}, false)

        },

        // post() - Posts a SMTP to POST /smtp

        post: function (smtp) { // NOSONAR

            return query("/smtp/", "POST", smtp, false)

        }

    },

    // SMTPId contains the endpoints for /smtp/:id

    SMTPId: {

        // get() - Queries the API for GET /smtp/:id

        get: function (id) { // NOSONAR

            return query("/smtp/" + id, "GET", {}, false)

        },

        // put() - Puts a SMTP to PUT /smtp/:id

        put: function (smtp) { // NOSONAR

            return query("/smtp/" + smtp.id, "PUT", smtp, false)

        },

        // delete() - Deletes a SMTP at DELETE /smtp/:id

        delete: function (id) { // NOSONAR

            return query("/smtp/" + id, "DELETE", {}, false)

        }

    },

    // IMAP containts the endpoints for /imap/

    IMAP: {

        get: function() { // NOSONAR

            return query("/imap/", "GET", {}, !1)

        },

        post: function(e) { // NOSONAR

            return query("/imap/", "POST", e, !1)

        },

        validate: function(e) { // NOSONAR

            return query("/imap/validate", "POST", e, true)

        }

    },

    // users contains the endpoints for /users

    users: {

        // get() - Queries the API for GET /users

        get: function () { // NOSONAR

            return query("/users/", "GET", {}, true)

        },

        // post() - Posts a user to POST /users

        post: function (user) { // NOSONAR

            return query("/users/", "POST", user, true)

        }

    },

    // userId contains the endpoints for /users/:id

    userId: {

        // get() - Queries the API for GET /users/:id

        get: function (id) { // NOSONAR

            return query("/users/" + id, "GET", {}, true)

        },

        // put() - Puts a user to PUT /users/:id

        put: function (user) { // NOSONAR

            return query("/users/" + user.id, "PUT", user, true)

        },

        // delete() - Deletes a user at DELETE /users/:id

        delete: function (id) { // NOSONAR

            return query("/users/" + id, "DELETE", {}, true)

        }

    },

    webhooks: {

        get: function() { // NOSONAR

            return query("/webhooks/", "GET", {}, false)

        },

        post: function(webhook) { // NOSONAR

            return query("/webhooks/", "POST", webhook, false)

        },

    },

    webhookId: {

        get: function(id) { // NOSONAR

            return query("/webhooks/" + id, "GET", {}, false)

        },

        put: function(webhook) { // NOSONAR

            return query("/webhooks/" + webhook.id, "PUT", webhook, true)

        },

        delete: function(id) { // NOSONAR

            return query("/webhooks/" + id, "DELETE", {}, false)

        },

        ping: function(id) { // NOSONAR

            return query("/webhooks/" + id + "/validate", "POST", {}, true)

        },

    },

    // import handles all of the "import" functions in the api // NOSONAR

    import_email: function (req) { // NOSONAR

        return query("/import/email", "POST", req, false)

    },

    // clone_site handles importing a site by url

    clone_site: function (req) { // NOSONAR

        return query("/import/site", "POST", req, false)

    },

    // send_test_email sends an email to the specified email address

    send_test_email: function (req) { // NOSONAR

        return query("/util/send_test_email", "POST", req, true)

    },

    reset: function () { // NOSONAR

        return query("/reset", "POST", {}, true)

    }

}

globalThis.api = api



/**

 * setupMultipleModals – shared bootstrap modal stacking utility.

 * Called once per page from each page-specific JS file.

 */

function setupMultipleModals() { // NOSONAR

    // Code based on http://miles-by-motorcycle.com/static/bootstrap-modal/index.html

    $('.modal').on('hidden.bs.modal', function () { // NOSONAR

        $(this).removeClass('fv-modal-stack');

        $('body').data('fv_open_modals', $('body').data('fv_open_modals') - 1);

    });

    $('.modal').on('shown.bs.modal', function () { // NOSONAR

        if ($('body').data('fv_open_modals') === undefined) {

            $('body').data('fv_open_modals', 0);

        }

        if ($(this).hasClass('fv-modal-stack')) {

            return;

        }

        $(this).addClass('fv-modal-stack');

        $('body').data('fv_open_modals', $('body').data('fv_open_modals') + 1);

        $(this).css('z-index', 1040 + (10 * $('body').data('fv_open_modals')));

        $('.modal-backdrop').not('.fv-modal-stack').css('z-index', 1039 + (10 * $('body').data('fv_open_modals')));

        $('.modal-backdrop').not('fv-modal-stack').addClass('fv-modal-stack');

    });

    $.fn.modal.Constructor.prototype.enforceFocus = function () { // NOSONAR

        $(document)

            .off('focusin.bs.modal')

            .on('focusin.bs.modal', $.proxy(function (e) { // NOSONAR

                if (

                    this.$element[0] !== e.target && !this.$element.has(e.target).length && // NOSONAR

                    !$(e.target).closest('.cke_dialog, .cke').length

                ) {

                    this.$element.trigger('focus');

                }

            }, this));

    };

    // Scrollbar fix – https://stackoverflow.com/questions/19305821/multiple-modals-overlay

    $(document).on('hidden.bs.modal', '.modal', function () { // NOSONAR

        $('.modal:visible').length && $(document.body).addClass('modal-open');

    });

}



// Register our moment.js datatables listeners

$(document).ready(function () { // NOSONAR

    // Setup nav highlighting

    let path = location.pathname;

    $('.nav-sidebar li').each(function () { // NOSONAR

        let $this = $(this);

        // if the current path is like this link, make it active

        if ($this.find("a").attr('href') === path) {

            $this.addClass('active');

        }

    })

    $.fn.dataTable.moment('MMMM Do YYYY, h:mm:ss a');

    // Setup tooltips

    $('[data-toggle="tooltip"]').tooltip()

});