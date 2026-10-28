#!/usr/bin/env python3
"""Turn the 2813px source PNGs in /public into web-ready WebP art in /public/art.

Sources stay untouched. Re-run after adding or replacing source images:
    python3 scripts/prepare-assets.py
"""
from PIL import Image, ImageChops
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PUB = ROOT / "public"
OUT = PUB / "art"

# source file -> (output path, max dimension)
DECOR_MAX = 480
PIECES = {
    "components/11.png": ("seal.webp", 420),
    "components/39.png": ("stamp-frame.webp", 1000),
    "components/40.png": ("printer.webp", 1600),
    "drawing/2.png": ("draw/pose-a.webp", 760),
    "drawing/3.png": ("draw/pose-b.webp", 760),
    "drawing/4.png": ("draw/her.webp", 520),
    "drawing/5.png": ("draw/him.webp", 520),
    "drawing/6.png": ("draw/cat-1.webp", 460),
    "drawing/7.png": ("draw/cat-2.webp", 460),
    "drawing/8.png": ("draw/cat-3.webp", 460),
    "drawing/9.png": ("draw/family.webp", 900),
}

# the beige and red decorative sets are the same shapes in two colourways
SHAPES = {
    "letters": (12, 11),
    "bouquet": (14, 13),
    "dove": (16, 15),
    "cherry": (18, 17),
    "bow": (22, 21),
    "sparkle": (24, 23),
    "cupcake": (26, 25),
    "starburst": (28, 27),
    "champagne": (30, 29),
    "cake": (32, 31),
    "cake-slice": (34, 33),
    "ribbon": (36, 35),
}
BEIGE_ONLY = {"tape": 19}
RED_ONLY = {"oval": 10, "lips": 20}


def save(im: Image.Image, rel: str, quality: int = 82) -> None:
    dest = OUT / rel
    dest.parent.mkdir(parents=True, exist_ok=True)
    im.save(dest, "WEBP", quality=quality, method=6)
    print(f"  {rel:28} {im.width}x{im.height}  {dest.stat().st_size // 1024} KB")


def trim_and_scale(src: Path, max_dim: int) -> Image.Image:
    im = Image.open(src).convert("RGBA")
    im = im.crop(im.getbbox())          # drop the transparent padding
    if max(im.size) > max_dim:
        im.thumbnail((max_dim, max_dim), Image.LANCZOS)
    return im


def drop_white(src: Path, max_dim: int, cutoff: int = 238) -> Image.Image:
    """Ảnh minh hoạ vẽ trên nền trắng đặc -> nền trong suốt.

    Nét vẽ là màu đỏ đậm nên chỉ cần lấy độ sáng làm kênh alpha: càng trắng càng
    trong. Chuyển dần chứ không cắt cứng, để nét không bị răng cưa.
    """
    im = Image.open(src).convert("RGB")
    lum = im.convert("L")
    alpha = lum.point(lambda v: 0 if v >= cutoff else round(255 * (cutoff - v) / cutoff))
    out = im.copy()
    out.putalpha(alpha)
    out = out.crop(out.getbbox())
    if max(out.size) > max_dim:
        out.thumbnail((max_dim, max_dim), Image.LANCZOS)
    return out


def main() -> None:
    print("pieces")
    for src, (rel, max_dim) in PIECES.items():
        save(trim_and_scale(PUB / src, max_dim), rel)

    print("decorations")
    for name, (beige, red) in SHAPES.items():
        save(trim_and_scale(PUB / "decorative beige" / f"{beige}.png", DECOR_MAX), f"beige/{name}.webp")
        save(trim_and_scale(PUB / "decorative red" / f"{red}.png", DECOR_MAX), f"red/{name}.webp")
    for name, n in BEIGE_ONLY.items():
        save(trim_and_scale(PUB / "decorative beige" / f"{n}.png", DECOR_MAX), f"beige/{name}.webp")
    for name, n in RED_ONLY.items():
        save(trim_and_scale(PUB / "decorative red" / f"{n}.png", DECOR_MAX), f"red/{name}.webp")

    print("minh hoạ")
    save(drop_white(PUB / "components/[Gloweb Storage] Retro & Vintage .png", 1100), "venue.webp")

    print("photos")
    for i, src in enumerate(sorted((PUB / "couple").glob("*.png")), start=1):
        im = Image.open(src).convert("RGB")
        im.thumbnail((1000, 1400), Image.LANCZOS)
        save(im, f"couple-{i}.webp", quality=86)


if __name__ == "__main__":
    main()
