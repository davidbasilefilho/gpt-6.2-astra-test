#!/usr/bin/env python3
"""Create a labeled comparison of two local images without altering originals."""
import argparse
from pathlib import Path
from PIL import Image, ImageDraw, ImageOps


def compare(before: Path, after: Path, output: Path, width: int = 960) -> None:
    if width < 100 or width > 4096:
        raise ValueError("Panel width must be between 100 and 4096 pixels")
    if output.resolve() in (before.resolve(), after.resolve()):
        raise ValueError("Output must not overwrite an input image")
    panels = []
    for path in (before, after):
        with Image.open(path) as source:
            if source.width * source.height > 50_000_000:
                raise ValueError("Input image exceeds 50 megapixels")
            frame = ImageOps.exif_transpose(source).convert("RGB")
            height = max(1, round(frame.height * width / frame.width))
            if height > 16000:
                raise ValueError("Comparison would exceed supported panel height")
            panels.append(frame.resize((width, height), Image.Resampling.LANCZOS))
    canvas = Image.new("RGB", (width * 2 + 24, max(p.height for p in panels) + 48), "#e6e8ec")
    draw = ImageDraw.Draw(canvas)
    for i, (panel, label) in enumerate(zip(panels, ("BEFORE", "AFTER"))):
        x = i * (width + 24)
        draw.text((x + 12, 16), label, fill="#17212c")
        canvas.paste(panel, (x, 48))
    output.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(output)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("before", type=Path)
    parser.add_argument("after", type=Path)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--width", type=int, default=960)
    args = parser.parse_args()
    try:
        compare(args.before, args.after, args.output, args.width)
    except (OSError, ValueError) as error:
        parser.error(str(error))


if __name__ == "__main__":
    main()
