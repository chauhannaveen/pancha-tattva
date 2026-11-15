"""Regenerate the link-preview image and the app icons.

Usage:  python tools/make_images.py

Uses an installed Chrome or Edge in headless mode to take screenshots:
  assets/og.jpg        1200 x 630, from tools/og-card.html (needs internet once, for the fonts)
  assets/icon-512.png, icon-192.png, icon-180.png, from assets/icon.svg 
Needs Pillow for resizing and JPEG conversion: pip install pillow
"""
import os
import pathlib
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
BROWSERS = [
    r'C:\Program Files\Google\Chrome\Application\chrome.exe',
    r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe',
    r'C:\Program Files\Microsoft\Edge\Application\msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
]


def shoot(browser, source, out, w, h, wait_ms=0):
    out = ROOT / out
    if out.exists():
        out.unlink()
    cmd = [browser, '--headless=new', '--hide-scrollbars', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist',
           '--window-size=%d,%d' % (w, h), '--screenshot=' + str(out)]
    if wait_ms:
        cmd.append('--virtual-time-budget=%d' % wait_ms)
    cmd.append((ROOT / source).as_uri())
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=120)
    if not out.exists():
        sys.exit('The browser did not produce ' + str(out))
    print('Wrote %s (%d KB)' % (out.relative_to(ROOT), out.stat().st_size // 1024))


if __name__ == '__main__':
    browser = next((b for b in BROWSERS if os.path.exists(b)), None)
    if not browser:
        sys.exit('No Chrome or Edge found. Add its path to BROWSERS in this script.')
    shoot(browser, 'tools/og-card.html', 'assets/og.png', 1200, 630, wait_ms=8000)
    shoot(browser, 'assets/icon.svg', 'assets/icon-512.png', 512, 512)
    from PIL import Image
    # Chat apps skip large previews, so the card is stored as a JPEG of about 150 KB.
    Image.open(ROOT / 'assets/og.png').convert('RGB').save(ROOT / 'assets/og.jpg', quality=88, optimize=True, progressive=True)
    (ROOT / 'assets/og.png').unlink()
    print('Wrote assets/og.jpg')
    # Headless windows cannot be narrower than about 500 px, so the small icons are scaled down from the large one.
    big = Image.open(ROOT / 'assets/icon-512.png').convert('RGB')
    for size in (192, 180):
        big.resize((size, size), Image.LANCZOS).save(ROOT / ('assets/icon-%d.png' % size), optimize=True)
        print('Wrote assets/icon-%d.png' % size)
