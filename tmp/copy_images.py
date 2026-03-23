import os
import shutil

src_dest_pairs = [
    ('./git/ExportBlock-2e09c968-feca-4b55-bd37-559bc1c12080-Part-1/Git- cherry-pick/Untitled.png', 'public/assets/img/git/cherry-pick-1.png'),
    ('./git/ExportBlock-2e09c968-feca-4b55-bd37-559bc1c12080-Part-1/Git- cherry-pick/Untitled 1.png', 'public/assets/img/git/cherry-pick-2.png'),
    ('./git/ExportBlock-2e09c968-feca-4b55-bd37-559bc1c12080-Part-1/Git- cherry-pick/Untitled 2.png', 'public/assets/img/git/cherry-pick-3.png'),
    ('./git/ExportBlock-2e09c968-feca-4b55-bd37-559bc1c12080-Part-1/Git- cherry-pick/Untitled 3.png', 'public/assets/img/git/cherry-pick-4.png'),
    ('./git/ExportBlock-23cd7e70-4cfe-4443-8381-d63d08519005-Part-1/Git-Stash/Untitled.png', 'public/assets/img/git/stash-1.png'),
    ('./git/ExportBlock-04bc285a-975c-43a0-bc58-4b42d74ecf0a-Part-1/Git-回退操作/Untitled.png', 'public/assets/img/git/revert-1.png'),
    ('./git/ExportBlock-04bc285a-975c-43a0-bc58-4b42d74ecf0a-Part-1/Git-回退操作/Untitled 1.png', 'public/assets/img/git/revert-2.png'),
    ('./git/ExportBlock-b556a654-977a-4715-889e-9ffc2d6cad3d-Part-1/分支的理解/Untitled.png', 'public/assets/img/git/branch-1.png'),
    ('./git/ExportBlock-b556a654-977a-4715-889e-9ffc2d6cad3d-Part-1/分支的理解/Untitled 1.png', 'public/assets/img/git/branch-2.png'),
    ('./git/ExportBlock-b556a654-977a-4715-889e-9ffc2d6cad3d-Part-1/分支的理解/Untitled 2.png', 'public/assets/img/git/branch-3.png'),
    ('./git/ExportBlock-b556a654-977a-4715-889e-9ffc2d6cad3d-Part-1/分支的理解/Untitled 3.png', 'public/assets/img/git/branch-4.png'),
    ('./git/ExportBlock-b556a654-977a-4715-889e-9ffc2d6cad3d-Part-1/分支的理解/Untitled 4.png', 'public/assets/img/git/branch-5.png'),
    ('./git/ExportBlock-b556a654-977a-4715-889e-9ffc2d6cad3d-Part-1/分支的理解/Untitled 5.png', 'public/assets/img/git/branch-6.png'),
    ('./git/ExportBlock-b556a654-977a-4715-889e-9ffc2d6cad3d-Part-1/分支的理解/Untitled 6.png', 'public/assets/img/git/branch-7.png'),
]

os.makedirs('public/assets/img/git', exist_ok=True)

for src, dest in src_dest_pairs:
    if os.path.exists(src):
        shutil.copyfile(src, dest)
        print(f"Copied {src} to {dest}")
    else:
        print(f"File not found: {src}")
