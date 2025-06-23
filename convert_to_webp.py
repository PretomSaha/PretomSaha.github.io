from pathlib import Path
from PIL import Image

# Directories containing Field Works images
img_dirs = [
    'images/20232_trip',
    'images/Sundarban trip',
    'images/kuakata_2022',
    'images/Saint_Martin'
]
exts = ['.jpg', '.JPG']

for d in img_dirs:
    files = [f for f in Path(d).iterdir() if f.suffix.lower() == '.jpg']
    for f in files:
        im = Image.open(f)
        webp_path = f.with_suffix('.webp')
        im.save(webp_path, 'webp')
        print(f'Converted {f} to {webp_path}')
        try:
            f.unlink()
            print(f'Deleted original {f}')
        except Exception as e:
            print(f'Failed to delete {f}: {e}') 