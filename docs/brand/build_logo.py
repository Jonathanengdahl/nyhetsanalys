from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

INK, ACCENT, TINT = "#16141F", "#5B3FD9", "#C2B8F3"

# The symbol: two cards, the overlap in the light tint. 64 x 64 units.
BLACK = dict(x=10, y=4, w=28, h=47, r=5)
PURPLE = dict(x=25.5, y=13, w=28, h=47, r=5)

def rect(c, fill, extra=""):
    return f'<rect x="{c["x"]}" y="{c["y"]}" width="{c["w"]}" height="{c["h"]}" rx="{c["r"]}" fill="{fill}"{extra}/>'

def symbol(prefix, dx=0, dy=0, scale=1):
    clip = f"{prefix}-clip"
    clip_attr = ' clip-path="url(#' + clip + ')"'
    return (f'<g transform="translate({dx} {dy}) scale({scale})">'
            f'<clipPath id="{clip}">{rect(BLACK, "#000")}</clipPath>'
            + rect(BLACK, INK) + rect(PURPLE, ACCENT) + rect(PURPLE, TINT, clip_attr) + '</g>')

# The wordmark: "cross" in ink and "read" in purple, Onest at weight 700, as outlines.
font = TTFont("../../src/fonts/onest-latin-wght.woff2")
font = instantiateVariableFont(font, {"wght": 700})
glyphs = font.getGlyphSet()
cmap = font.getBestCmap()
upm = font["head"].unitsPerEm
hmtx = font["hmtx"]
TRACK = -0.035 * upm

def word(text, color):
    paths, x = [], 0.0
    for ch in text:
        name = cmap[ord(ch)]
        pen = SVGPathPen(glyphs)
        glyphs[name].draw(TransformPen(pen, (1, 0, 0, -1, x, 0)))
        paths.append(pen.getCommands())
        x += hmtx[name][0] + TRACK
    return f'<path fill="{color}" d="{" ".join(paths)}"/>', x

cross, wc = word("cross", INK)
read, wr = word("read", ACCENT)
width_units = wc + wr - TRACK
os2 = font["OS/2"]
cap = os2.sCapHeight
ascender = font["hhea"].ascent

def wordmark(height):
    """The wordmark scaled so its ascender height is `height`, returned with its width."""
    s = height / ascender
    svg = f'<g transform="scale({s})"><g transform="translate(0 {ascender})">{cross}<g transform="translate({wc} 0)">{read}</g></g></g>'
    return svg, width_units * s

def write(name, w, h, body):
    with open(name, "w") as f:
        f.write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:.1f} {h:.1f}" width="{w:.0f}" height="{h:.0f}" role="img" aria-label="Crossread">{body}</svg>\n')

write("crossread-symbol.svg", 64, 64, symbol("s"))

# Horizontal: symbol, then the wordmark, vertically centred on the symbol.
wm, ww = wordmark(44)
write("crossread-logo.svg", 64 + 14 + ww + 4, 64, symbol("h") + f'<g transform="translate({64 + 14} {(64 - 44) / 2 + 3})">{wm}</g>')

# Stacked, like the version Jonathan picked: symbol above the wordmark.
wm2, ww2 = wordmark(52)
total_w = max(ww2, 150)
write("crossread-logo-stacked.svg", total_w + 20, 160 + 70,
      symbol("v", dx=(total_w + 20 - 64 * 2.2) / 2, dy=6, scale=2.2) + f'<g transform="translate(10 {6 + 64 * 2.2 + 18})">{wm2}</g>')
print("ok", round(ww, 1), round(ww2, 1))
