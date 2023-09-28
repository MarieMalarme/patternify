import { atomizify, flagify } from 'atomizify'

atomizify({
  custom_classes: {
    no_events: 'pointer-events: none',
    no_select: 'user-select: none',
    fs2vw: 'font-size: 2vw',
    fs4vw: 'font-size: 4vw',
    fs9vw: 'font-size: 9vw',
    fs12vw: 'font-size: 12vw',
    fs20vw: 'font-size: 20vw',
    fs30vw: 'font-size: 30vw',
    fs35: 'font-size: 35px',
    fs45: 'font-size: 45px',
    fs55: 'font-size: 55px',
    fs200: 'font-size: 200px',
    lh33: 'line-height: 33px',
    lh35: 'line-height: 35px',
    lh300: 'line-height: 300px',
    lh10vw: 'line-height: 10vw',
    lh22vw: 'line-height: 22vw',
    lh100vh: 'line-height: 100vh',
    sans: 'font-family: "sans"',
    mono: 'font-family: "mono"',
    sun_moon: 'font-family: "sun-moon"',
    fit_cover: 'object-fit: cover',
    w_auto: 'width: auto',
    w1: 'width: 1px',
    w7: 'width: 7px',
    w27: 'width: 27px',
    w15vmin: 'width: 15vmin',
    h1: 'height: 1px',
    h7: 'height: 7px',
    h15vmin: 'height: 15vmin',
    b_rad50: 'border-radius: 50px',
    mt2: 'margin-top: 2px',
    mr3: 'margin-right: 3px',
    mt7: 'margin-top: 7px',
    mb7: 'margin-bottom: 7px',
    ml7: 'margin-left: 7px',
    mr7: 'margin-right: 7px',
    pb2: 'padding-bottom: 2px',
    ph3: 'padding: 0 3px',
    pt100p: 'padding-top: 100%',
    h200p: 'height: 200%',
    bg_line_through:
      'background: linear-gradient(-45deg, white 47%, var(--grey2) 47%, var(--grey2) 53%, white 53%)',
  },

  media_queries: {
    // to review
    __xs: {
      query: 'max-width: 600px',
      description: 'small screens',
    },
    __s: {
      query: 'max-width: 900px',
      description: 'extra small screens',
    },
    __d: {
      query: 'min-width: 600px',
      description: 'desktop screens',
    },
  },
})

export const { Component, Div, Span } = flagify()

// create custom cursors: cursor is an icon of the needed interaction (mouse scrolling, etc.)
