from PIL import Image, ImageDraw, ImageChops

def make_massive_favicon(img_path, out_path):
    img = Image.open(img_path).convert("RGBA")
    
    # Find the true bounds of the logo by ignoring the background color
    bg_color = img.getpixel((0, 0))
    print("Detected background color:", bg_color)
    
    bg = Image.new("RGBA", img.size, bg_color)
    diff = ImageChops.difference(img, bg)
    bbox = diff.getbbox()
    
    if bbox:
        print("Cropping to bounds:", bbox)
        img = img.crop(bbox)
    else:
        print("Could not find a distinct bounding box.")
        
    w, h = img.size
    print("New size:", w, "x", h)
    
    # Create square canvas that tightly fits the logo
    size = max(w, h)
    square_img = Image.new("RGBA", (size, size), bg_color) # use bg color to fill missing edges
    offset = ((size - w) // 2, (size - h) // 2)
    square_img.paste(img, offset)
    
    # Resize to 512x512
    final = square_img.resize((512, 512), Image.Resampling.LANCZOS)
    
    # Apply a rounded corner mask
    mask = Image.new("L", (512, 512), 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle((0, 0, 512, 512), radius=48, fill=255)
    
    out = Image.new("RGBA", (512, 512), (0,0,0,0))
    out.paste(final, (0, 0), mask=mask)
    
    out.save(out_path, "PNG")
    print("Done")

make_massive_favicon("frontend/public/Brand Emblem.png", "frontend/public/Brand Emblem.png")
