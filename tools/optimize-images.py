import os
import io
import sys
from PIL import Image

def format_size(size_in_bytes):
    """Formats bytes to a human-readable string."""
    if size_in_bytes < 1024:
        return f"{size_in_bytes} B"
    elif size_in_bytes < 1024 * 1024:
        return f"{size_in_bytes / 1024:.2f} KB"
    else:
        return f"{size_in_bytes / (1024 * 1024):.2f} MB"

def optimize_image(file_path):
    """Optimizes a single image in place, resizing if wider than 1920px."""
    try:
        orig_size = os.path.getsize(file_path)
        
        # Skip extremely small files
        if orig_size < 1024 * 10:  # less than 10KB
            return orig_size, orig_size, "skipped (very small)"

        with Image.open(file_path) as img:
            orig_format = img.format
            if not orig_format:
                # Deduce format from extension
                ext = os.path.splitext(file_path)[1].lower()
                if ext in ('.jpg', '.jpeg'):
                    orig_format = 'JPEG'
                elif ext == '.png':
                    orig_format = 'PNG'
                else:
                    return orig_size, orig_size, "skipped (unknown format)"

            width, height = img.size
            
            # 1. Resize if wider than 1920px
            resized = False
            orig_w, orig_h = width, height
            if width > 1920:
                new_width = 1920
                new_height = int(height * (new_width / width))
                img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
                width, height = img.size
                resized = True

            buffer = io.BytesIO()
            
            # 2. Compress based on format
            if orig_format == "JPEG" or file_path.lower().endswith(('.jpg', '.jpeg')):
                # Ensure the image is in RGB (convert from CMYK or other if needed)
                if img.mode != "RGB":
                    img = img.convert("RGB")
                img.save(buffer, format="JPEG", quality=82, optimize=True, progressive=True)
            elif orig_format == "PNG" or file_path.lower().endswith('.png'):
                # For PNGs, if it's transparent (RGBA), we can optimize it
                if img.mode == 'RGBA':
                    # To be super safe, use standard PIL optimization.
                    # Quantizing transparent images can save tons of space,
                    # but standard optimize=True is extremely safe and doesn't lossy-compress colors.
                    # Let's try standard save first.
                    img.save(buffer, format="PNG", optimize=True)
                else:
                    img.save(buffer, format="PNG", optimize=True)
            else:
                return orig_size, orig_size, f"skipped (unsupported format: {orig_format})"

            new_data = buffer.getvalue()
            new_size = len(new_data)
            
            # 3. Save only if we actually saved space
            if new_size < orig_size:
                with open(file_path, "wb") as f:
                    f.write(new_data)
                
                status = "optimized"
                if resized:
                    status += f" (resized from {orig_w}x{orig_h} to {width}x{height})"
                return orig_size, new_size, status
            else:
                return orig_size, orig_size, "no improvement"

    except Exception as e:
        return 0, 0, f"error: {str(e)}"

def main():
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "public"))
    if not os.path.exists(root_dir):
        print(f"Error: public directory not found at {root_dir}")
        sys.exit(1)

    print(f"Scanning for images to optimize in: {root_dir}\n")
    
    total_original = 0
    total_new = 0
    optimized_count = 0
    skipped_count = 0
    error_count = 0
    
    results = []

    # Traverse public directory
    for root, _, files in os.walk(root_dir):
        for file in files:
            ext = os.path.splitext(file)[1].lower()
            if ext in ('.jpg', '.jpeg', '.png'):
                file_path = os.path.join(root, file)
                rel_path = os.path.relpath(file_path, root_dir)
                
                orig_s, new_s, status = optimize_image(file_path)
                
                if "error" in status:
                    error_count += 1
                elif "skipped" in status:
                    skipped_count += 1
                elif orig_s > new_s:
                    optimized_count += 1
                    total_original += orig_s
                    total_new += new_s
                    saved = orig_s - new_s
                    pct = (saved / orig_s) * 100
                    results.append((rel_path, orig_s, new_s, saved, pct, status))
                else:
                    # No improvement or small file
                    skipped_count += 1
                    
    # Sort results by absolute space saved descending
    results.sort(key=lambda x: x[3], reverse=True)
    
    # Print results table
    print(f"{'File Path':<60} | {'Original':<10} | {'Optimized':<10} | {'Saved':<10} | {'%':<6} | {'Status'}")
    print("-" * 115)
    for rel_path, orig_s, new_s, saved, pct, status in results[:40]:  # Top 40 biggest savings
        print(f"{rel_path:<60} | {format_size(orig_s):<10} | {format_size(new_s):<10} | {format_size(saved):<10} | {pct:5.1f}% | {status}")
        
    if len(results) > 40:
        print(f"... and {len(results) - 40} more optimized files ...")
        
    print("\n" + "=" * 50)
    print("OPTIMIZATION SUMMARY")
    print("=" * 50)
    print(f"Total files optimized: {optimized_count}")
    print(f"Total files skipped/no improvement: {skipped_count}")
    print(f"Total errors: {error_count}")
    
    if optimized_count > 0:
        saved_bytes = total_original - total_new
        saved_pct = (saved_bytes / total_original) * 100 if total_original > 0 else 0
        print(f"Original size of optimized files: {format_size(total_original)}")
        print(f"Optimized size:                  {format_size(total_new)}")
        print(f"Total space saved:               {format_size(saved_bytes)} ({saved_pct:.1f}% reduction!)")
    else:
        print("No images were optimized.")
    print("=" * 50)

if __name__ == "__main__":
    main()
