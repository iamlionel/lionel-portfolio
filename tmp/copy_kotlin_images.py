import os
import shutil

src_dirs = [
    ('Kotlin/Kotlin/内置类型', 'types'),
    ('Kotlin/Kotlin/自建类型', 'custom_types'),
    ('Kotlin/Kotlin/函数', 'functions')
]

dest_dir = "public/assets/img/kotlin"
os.makedirs(dest_dir, exist_ok=True)

for src_dir, prefix in src_dirs:
    if os.path.exists(src_dir):
        files = [f for f in os.listdir(src_dir) if f.endswith('.png')]
        # Sort files so Untitled.png is first, then Untitled 1.png
        files.sort()
        for i, f in enumerate(files):
            src_path = os.path.join(src_dir, f)
            dest_name = f"{prefix}-{i+1}.png"
            dest_path = os.path.join(dest_dir, dest_name)
            shutil.copyfile(src_path, dest_path)
            print(f"Copied {src_path} to {dest_path}")
    else:
        print(f"Directory not found: {src_dir}")
