import os
import re

def replace_in_file(path, old, new):
    if not os.path.exists(path): return
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    content = content.replace(old, new)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

def regex_replace(path, pattern, repl):
    if not os.path.exists(path): return
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    content = re.sub(pattern, repl, content)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

# JS files
replace_in_file('static/js/src/app/settings.js', 'isNaN(', 'Number.isNaN(')
replace_in_file('static/js/src/app/webhooks.js', 'parseInt(', 'Number.parseInt(')
replace_in_file('static/js/src/app/campaign_results.js', 'reject("Invalid template ID");', 'reject(new Error("Invalid template ID"));')

# base.html, login.html, reset_password.html alt tags
replace_in_file('templates/base.html', 'src="/images/logo_inv_small.png" />', 'src="/images/logo_inv_small.png" alt="logo" />')
replace_in_file('templates/login.html', 'src="/images/logo_inv_small.png" />', 'src="/images/logo_inv_small.png" alt="logo" />')
replace_in_file('templates/login.html', 'src="/images/logo_purple.png" />', 'src="/images/logo_purple.png" alt="logo" />')
replace_in_file('templates/reset_password.html', 'src="/images/logo_inv_small.png" />', 'src="/images/logo_inv_small.png" alt="logo" />')
replace_in_file('templates/reset_password.html', 'src="/images/logo_purple.png" />', 'src="/images/logo_purple.png" alt="logo" />')

# campaigns.html
replace_in_file('templates/campaigns.html', 'role="activeCampaigns"', '')
replace_in_file('templates/campaigns.html', 'role="archivedCampaigns"', '')
replace_in_file('templates/campaigns.html', 'id="flashes"', 'id="flashes-camp"')
replace_in_file('templates/campaigns.html', 'id="emptyMessage"', 'id="emptyMessage-camp"')
replace_in_file('templates/campaigns.html', 'autocomplete="off"', 'autocomplete="new-password"')
regex_replace('templates/campaigns.html', r'<div class="col-sm-3 col-md-2 sidebar" role="navigation">', r'<nav class="col-sm-3 col-md-2 sidebar">')

# landing_pages.html
replace_in_file('templates/landing_pages.html', 'role="html"', '')
replace_in_file('templates/landing_pages.html', 'id="modal.flashes"', 'id="modal-flashes-lp"')
replace_in_file('templates/landing_pages.html', 'id="modalSubmit"', 'id="modalSubmit-lp"')
regex_replace('templates/landing_pages.html', r'<div class="col-sm-3 col-md-2 sidebar" role="navigation">', r'<nav class="col-sm-3 col-md-2 sidebar">')

# settings.html
replace_in_file('templates/settings.html', 'role="mainSettings"', '')
replace_in_file('templates/settings.html', 'role="uiSettings"', '')
replace_in_file('templates/settings.html', 'role="reportingSettings"', '')
replace_in_file('templates/settings.html', '<label class="control-label" for="API Key">API Key</label>', '<label class="control-label" for="apikey">API Key</label>')
replace_in_file('templates/settings.html', 'id="API Key"', 'id="apikey"')
regex_replace('templates/settings.html', r'<div class="col-sm-3 col-md-2 sidebar" role="navigation">', r'<nav class="col-sm-3 col-md-2 sidebar">')

# templates.html
replace_in_file('templates/templates.html', 'role="text"', '')
replace_in_file('templates/templates.html', 'role="html"', '')
replace_in_file('templates/templates.html', 'id="modal.flashes"', 'id="modal-flashes-tpl"')
replace_in_file('templates/templates.html', 'id="modalSubmit"', 'id="modalSubmit-tpl"')

# Create sonar.properties to exclude third-party static assets that we should not modify
with open('sonar-project.properties', 'w') as f:
    f.write("""sonar.exclusions=static/css/**/*.css,static/plugins/**/*,static/.../ckeditor/**/*,static/js/dist/**/*
""")

print("Fixes applied successfully.")
