# Patternify

[Patternify](https://patternify.studiodev.xyz/) is a little web-based tool to create patterns on a grid & preview it live; the size, colors and inputs to generate and edit the pattern are all customizable.

![](https://github.com/MarieMalarme/patternify/blob/main/src/images/visual_1.png)

I initially developed this tool to play around & design patterns to do peyote stitch bracelets, but it can actually be used for any weaving practice, to be displayed on the web, printed, and probably many other usages!
The pattern tile can be downloaded in SVG format, and is for example used here on the website as a repeating background image set in CSS.

The tool has 2 views, toggled by clicking on the button “Show / Hide settings” in the top right corner:

- The Fullscreen view, which displays only the pattern tile repeated on the whole screen;
- The Creation view, which displays:
  - the pattern tile grid, in the middle, that can be drawn on by selecting one of the colors in the settings panel, and by clicking down the mouse and moving it over the tile,
  - several inputs in the settings panel in the top right corner, which enable to customize:
    - the amount of columns & rows of the pattern tile grid,
    - the tile size of the repeated pattern in the background,
    - the 4 colors values,
    - the chosen mode to generate the pattern: from an image, as lines, randomly or hand-drawn from scratch,
  - a button to reset the original base pattern of the chosen mode,
  - a button to download the pattern tile in SVG format.

This application is coded in React.JS.
