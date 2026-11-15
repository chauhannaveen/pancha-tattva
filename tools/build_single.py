"""Bundle the site into one self-contained HTML file.

Usage:  python tools/build_single.py

Writes two files into dist/:
  pancha-tattva.html           the whole site in one file, for emailing or offline use
  pancha-tattva.artifact.html  the same, shaped for the claude.ai share link
"""
import io
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def read(rel):
    return io.open(os.path.join(ROOT, rel), encoding='utf-8').read()


def write(rel, text):
    path = os.path.join(ROOT, rel)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    io.open(path, 'w', encoding='utf-8', newline='\n').write(text)


def inline(html):
    def css(m):
        return '<style>\n' + read(m.group(1)) + '</style>'

    def js(m):
        return '<script>\n' + read(m.group(1)) + '</script>'

    html, n_css = re.subn(r'<link rel="stylesheet" href="((?!https?:)[^"]+)">', css, html)
    html, n_js = re.subn(r'<script src="((?!https?:)[^"]+)"></script>', js, html)
    if not n_css or not n_js:
        raise SystemExit('Nothing was inlined: index.html no longer links its local CSS or JS as expected.')
    return html


def for_artifact(html):
    """The share link wraps the page itself, hides downloads, and wants a short title."""
    head = html[html.index('<head>') + 6:html.index('</head>')]
    body = html[html.index('<body>') + 6:html.index('</body>')]
    head = head.replace('<meta charset="utf-8">', '')
    head = head.replace('<meta name="viewport" content="width=device-width,initial-scale=1">', '')
    head = re.sub(r'<title>.*?</title>',
                  '<title>Pancha Tattva</title>\n<meta name="claude:viewport-fit-sides" content="cover">', head)
    marker = ':root{--accent:#f4d9a0}'
    if marker not in head:
        raise SystemExit('The :root rule in css/styles.css changed; update for_artifact() to match.')
    head = head.replace(marker, ':root{--accent:#f4d9a0;color-scheme:dark}\n'
                        'body{padding-left:max(16px,env(safe-area-inset-left,0px));'
                        'padding-right:max(16px,env(safe-area-inset-right,0px))}\n'
                        '#cap,#cap2{display:none!important}')
    body = body.replace('C · CAPTURE &nbsp;&nbsp; ', '')
    return head.strip() + '\n' + body.strip() + '\n'


if __name__ == '__main__':
    single = inline(read('index.html'))
    write('dist/pancha-tattva.html', single)
    write('dist/pancha-tattva.artifact.html', for_artifact(single))
    print('Wrote dist/pancha-tattva.html (%d KB) and dist/pancha-tattva.artifact.html' % (len(single.encode('utf-8')) // 1024))
