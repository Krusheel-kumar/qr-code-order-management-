from PIL import Image, ImageDraw

def make_large_favicon(img_path, out_path):
    try:
        # Open the image
        img = Image.open(img_path).convert("RGBA")
        
        # We want to tightly crop the logo to remove empty black or transparent borders.
        # We'll use the luminance channel to find non-black pixels.
        gray = img.convert("L")
        # Consider pixels with value > 15 as "content" (not black)
        mask = gray.point(lambda p: 255 if p > 15 else 0)
        
        # Get the bounding box of the non-black pixels
        bbox = mask.getbbox()
        
        if bbox:
            print("Original size:", img.size)
            print("Cropping to bounds:", bbox)
            img = img.crop(bbox)
        
        w, h = img.size
        print("Cropped size:", w, "x", h)
        
        # Pad it to a perfect square without adding unnecessary margins
        size = max(w, h)
        square_img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        offset = ((size - w) // 2, (size - h) // 2)
        square_img.paste(img, offset)
        
        # Resize to standard favicon size (512x512)
        final_img = square_img.resize((512, 512), Image.Resampling.LANCZOS)
        
        # Create a subtle rounded mask so it looks clean, but takes up maximum space
        mask2 = Image.new("L", (512, 512), 0)
        draw = ImageDraw.Draw(mask2)
        draw.rounded_rectangle((0, 0, 512, 512), radius=48, fill=255)
        
        rounded_final = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
        rounded_final.paste(final_img, (0, 0), mask=mask2)
        
        # Save it
        rounded_final.save(out_path, "PNG")
        print("Successfully created a large, clear favicon!")
    except Exception as e:
        print("Error:", e)

make_large_favicon("frontend/public/Brand Emblem.png", "frontend/public/Brand Emblem.png")
