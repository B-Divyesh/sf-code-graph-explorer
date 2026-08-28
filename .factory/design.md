# Graphite visual thesis

## Direction and rationale

Graphite uses a **dithered/halftone print system** inspired by engineering field
manuals, dependency maps, and annotated source listings. The product turns an
opaque codebase into a map; imperfect ink dots make the map feel examined and
human while crisp rules and monospace labels keep it operational. This is a
single light, explicitly paper-like treatment: a dark canvas is avoided because
the primary task is prolonged reading and tracing.

## Palette

- Paper `#f2eedf` and raised paper `#fffdf5`: warm, low-glare work surfaces.
- Ink `#171713`: primary text and graph edges (15.1:1 on paper).
- Quiet ink `#5b594f`: secondary copy (6.0:1 on paper).
- Vermilion `#d53a24`, dark `#8f2518`: selected symbols and decisive actions.
- Cobalt `#1655a5`, dark `#123f79`: callers/import relationships and links.
- Moss `#267044`: success and indexed state.
- Ochre `#8a5a00`: warnings and heuristic-resolution notices.
- Error `#a82525`: failures, always paired with text/iconography.

No gradients. Color is always reinforced by an edge style, label, or symbol.

## Typography and spacing

Display and interface: `Arial Narrow`, `Aptos Narrow`, `Roboto Condensed`,
system sans-serif. Code/data: `ui-monospace`, `SFMono-Regular`, `Consolas`,
monospace. No font files or third-party requests. The type scale is 12 / 14 /
16 / 20 / 28 / clamp(40–72) px. Body copy is at least 16 px and 1.55 line
height. Spacing follows a 4 px base: 4, 8, 12, 16, 24, 32, 48, 64.

## Composition and interaction grammar

The landing state reads like a folded technical broadside: one decisive folder
action, a working sample, and a generated cut-paper dependency map. Once a
project is loaded, the UI becomes a three-pane drafting table: symbol index,
focus graph, and source sheet. Heavy 2 px ink rules define regions; shadows are
offset print-registration blocks rather than soft elevation. Graph nodes are
paper labels with typographic kind stamps. Callers use cobalt dashed edges,
callees use ink, and imports use dotted ochre. Selecting a symbol leaves a
vermilion registration mark. Keyboard shortcuts appear as physical keycaps.

Phone layout keeps search and graph as the primary view and switches source,
graph, and symbols through a labelled three-tab dock; no pane is squeezed.
The mobile graph keeps its paper-map scale inside a horizontal drafting strip,
so node targets remain at least 44 px without turning the diagram into a list.
Workspace export controls use short visible labels on phones; the Team dialog
uses the same hard rule, offset vermilion shadow, and paper surfaces.

## Motion policy

Graph nodes settle from the selected symbol outward over 180–240 ms using only
opacity and transform. Pane changes cross-fade for 160 ms. Loading uses a
stepped printing-progress bar, never a looping flourish. Under
`prefers-reduced-motion: reduce`, transitions and smooth scrolling become
instant and all decorative animation is removed.

## Asset plan and provenance

One original raster illustration, `public/assets/code-cartography.webp`, is
used only in the empty/landing workspace to clarify the linked graph + source
concept. It depicts stacked source sheets connected by punched-node threads in
coarse two-ink halftone. It is generated specifically for this product and is
not a screenshot or claim about analysis accuracy.

Prompt sheet:

- Subject: an abstract code dependency atlas, stacked source-code paper strips,
  circular punched nodes, and connecting routes; no legible code.
- World/materials: 1960s technical field manual, offset-printed paper, coarse
  halftone dots, slightly misregistered ink, cut-paper geometry.
- Light/lens: flatbed editorial scan, orthographic, crisp edges, generous cream
  negative space.
- Palette words: warm cream, carbon black, vermilion, cobalt blue, tiny moss.
- Negative list: no people, hands, devices, logos, UI screenshot, gradients,
  neon, 3D gloss, legible text, watermark, brand marks.

Generation provenance: Azure AI Foundry `factory-image`, generated 2026-08-27
with `/opt/fleet/lib/gen-image.sh`; the exact prompt is saved beside the source
PNG in `assets/src/code-cartography.json`. Generated imagery is disclosed in
the product footer.

The 1200×630 Open Graph image and 180×180 Apple touch icon are crops of that
same original source. They were produced locally with ImageMagick on
2026-08-28; no additional stock or third-party imagery was introduced.

## Release cache policy

The un-hashed Tree-sitter grammar files are served with a one-week,
must-revalidate cache policy. The release-versioned service worker precaches
them for offline use; revalidation prevents a grammar update from becoming
permanently stale.
