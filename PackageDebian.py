import os
import tarfile
import io
import time

def create_deb(output_filename, control_dir, data_dir):
    print(f"[*] Packaging {output_filename}...")
    
    # 1. debian-binary
    binary_content = b"2.0\n"
    
    # 2. control.tar.gz
    control_buffer = io.BytesIO()
    with tarfile.open(fileobj=control_buffer, mode='w:gz') as tar:
        for root, dirs, files in os.walk(control_dir):
            for f in files:
                path = os.path.join(root, f)
                rel_path = os.path.relpath(path, control_dir)
                tar.add(path, arcname=rel_path)
    control_tar = control_buffer.getvalue()
    
    # 3. data.tar.gz
    data_buffer = io.BytesIO()
    with tarfile.open(fileobj=data_buffer, mode='w:gz') as tar:
        # Add usr/share/hexstrike (source code)
        for item in os.listdir("."):
            if item in ["node_modules", ".git", "packaging", "screenshots", output_filename, "__pycache__"]:
                continue
            tar.add(item, arcname=os.path.join("usr/share/hexstrike", item))
        
        # Add usr/bin/hexstrike-orchestrator
        wrapper_path = "packaging/linux/usr/bin/hexstrike-orchestrator"
        if os.path.exists(wrapper_path):
            tar.add(wrapper_path, arcname="usr/bin/hexstrike-orchestrator")
            
        # Add etc/systemd/system/hexstrike.service
        service_path = "packaging/linux/etc/systemd/system/hexstrike.service"
        if os.path.exists(service_path):
            tar.add(service_path, arcname="etc/systemd/system/hexstrike.service")

    data_tar = data_buffer.getvalue()
    
    # 4. Create ar archive (simplified)
    # The ar format is: !<arch>\n + file headers + file contents
    # Each header is 60 bytes.
    def get_ar_header(name, size):
        return f"{name:<16}{int(time.time()):<12}{0:<6}{0:<6}{100644:<8}{size:<10}`\n".encode('ascii')

    with open(output_filename, 'wb') as f:
        f.write(b"!<arch>\n")
        
        # debian-binary
        f.write(get_ar_header("debian-binary", len(binary_content)))
        f.write(binary_content)
        if len(binary_content) % 2 != 0: f.write(b"\n")
        
        # control.tar.gz
        f.write(get_ar_header("control.tar.gz", len(control_tar)))
        f.write(control_tar)
        if len(control_tar) % 2 != 0: f.write(b"\n")
        
        # data.tar.gz
        f.write(get_ar_header("data.tar.gz", len(data_tar)))
        f.write(data_tar)
        if len(data_tar) % 2 != 0: f.write(b"\n")

    print(f"[+] Created: {output_filename}")

if __name__ == "__main__":
    create_deb("hexstrike-nova_1.0.0_all.deb", "packaging/linux/DEBIAN", "packaging/linux")
