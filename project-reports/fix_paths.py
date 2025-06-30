import re

input_file = 'BhasanChar.html'

# Patterns to replace: css, js, images, fonts (href/src attributes)
patterns = [
    (r'href=["\"]/?.?/?.?/?.?/css/', 'href="/css/'),
    (r'src=["\"]/?.?/?.?/?.?/js/', 'src="/js/'),
    (r'src=["\"]/?.?/?.?/?.?/images/', 'src="/images/'),
    (r'href=["\"]/?.?/?.?/?.?/fonts/', 'href="/fonts/'),
    # Also handle single quotes
    (r"href=['\"]/?.?/?.?/?.?/css/", "href='/css/"),
    (r"src=['\"]/?.?/?.?/?.?/js/", "src='/js/"),
    (r"src=['\"]/?.?/?.?/?.?/images/", "src='/images/"),
    (r"href=['\"]/?.?/?.?/?.?/fonts/", "href='/fonts/")
]

def fix_paths(content):
    for pattern, replacement in patterns:
        content = re.sub(pattern, replacement, content)
    return content

with open(input_file, 'r', encoding='utf-8') as f:
    html = f.read()

fixed_html = fix_paths(html)

with open(input_file, 'w', encoding='utf-8') as f:
    f.write(fixed_html)

print(f"Fixed resource paths and updated {input_file} in place.") 