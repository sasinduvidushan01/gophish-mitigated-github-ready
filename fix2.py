import os

def replace_in_file(path, old, new):
    if not os.path.exists(path): return
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    content = content.replace(old, new)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

replace_in_file('templates/campaign_results.html', '<a class="btn btn-primary"', '<a class="btn btn-primary" role="button"')
replace_in_file('templates/campaign_results.html', '<a class="btn btn-default"', '<a class="btn btn-default" role="button"')
replace_in_file('templates/campaign_results.html', '<a class="btn btn-danger"', '<a class="btn btn-danger" role="button"')
