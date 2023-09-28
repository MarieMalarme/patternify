import { useState, useEffect, useRef } from 'react'
import { Component, Div, Span } from './flags'
import { random } from './toolbox'
import noise from './images/noise.jpg'

export const Home = () => {
  const [svg_html, set_svg_html] = useState()
  const svg_ref = useRef(null)
  const [canvas, set_canvas] = useState(null)
  const [context, set_context] = useState(null)
  const [selected_mode, set_selected_mode] = useState('image')
  const [image, set_image] = useState(noise)
  const [cells, set_cells] = useState({ image: [], lines: [], random: [] })
  const [is_loading, set_is_loading] = useState(true)
  const [is_mouse_down, set_is_mouse_down] = useState(false)

  // customizable input parameters
  const [columns, set_columns] = useState(base_columns)
  const [tile_size, set_tile_size] = useState(100)
  const [colors, set_colors] = useState(base_colors)
  const [selected_color_index, set_selected_color_index] = useState(0)
  const [display_settings, set_display_settings] = useState(true)

  const set_cells_values = (image, colors, columns, context) => {
    const lines = load_lines({ columns })
    const random = load_random({ columns, colors })
    const draw = load_draw({ columns, colors })
    load_image({ columns, image, canvas, context }).then((image_cells) => {
      set_cells({ image: image_cells, lines, random, draw })
      set_is_loading(false)
    })
    setTimeout(set_background_svg, 100)
  }

  // initialize context and cells values
  useEffect(() => {
    if (!canvas) return
    const context = canvas.getContext('2d', { willReadFrequently: true })
    set_context(context)
    set_cells_values(noise, base_colors, base_columns, context)
  }, [canvas])

  // reset cells values for all modes when updating columns or rows
  useEffect(() => {
    if (!context) return
    set_is_loading(true)
    set_cells_values(image, colors, columns, context)
  }, [columns])

  // reset cells values for image mode when updating image
  useEffect(() => {
    if (!context) return
    set_is_loading(true)
    load_image({ columns, image, canvas, context }).then(
      (image_cells) => set_cells({ ...cells, image: image_cells }),
      set_is_loading(false),
    )
  }, [image])

  const view_box = { width: columns * cell_size, height: columns * cell_size }

  const set_background_svg = () => {
    const cloned_svg = svg_ref.current.cloneNode(true)
    cloned_svg.removeAttribute('class')
    cloned_svg.removeAttribute('style')
    cloned_svg.removeAttribute('width')
    cloned_svg.removeAttribute('height')
    const serializer = new XMLSerializer()
    const svg_string = serializer.serializeToString(cloned_svg)
    set_svg_html(
      svg_string
        ?.replaceAll('"', `'`)
        .replaceAll('#', '%23')
        .replaceAll('black', 'none'),
    )
  }

  useEffect(() => {
    setTimeout(set_background_svg, 100)
  }, [])
  useEffect(() => set_background_svg(), [cells, selected_mode, colors])

  return (
    <Wrapper
      onMouseUp={() => set_is_mouse_down(false)}
      style={{
        backgroundSize: `${tile_size}px`,
        backgroundImage: `url("data:image/svg+xml;utf8,${svg_html}")`,
      }}
    >
      <Controls
        cells={cells}
        set_cells={set_cells}
        image={image}
        set_image={set_image}
        canvas={canvas}
        set_canvas={set_canvas}
        colors={colors}
        set_colors={set_colors}
        columns={columns}
        set_columns={set_columns}
        tile_size={tile_size}
        set_tile_size={set_tile_size}
        selected_mode={selected_mode}
        set_selected_mode={set_selected_mode}
        display_settings={display_settings}
        set_display_settings={set_display_settings}
        selected_color_index={selected_color_index}
        set_selected_color_index={set_selected_color_index}
        set_is_loading={set_is_loading}
        context={context}
        svg_ref={svg_ref}
      />

      <Svg
        o0={!display_settings}
        onMouseDown={() => set_is_mouse_down(true)}
        elemRef={svg_ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${view_box.width} ${view_box.height}`}
      >
        <g stroke="black">
          {!is_loading &&
            cells[selected_mode].map((value, index) => (
              <Cell
                key={index}
                value={value}
                index={index}
                cells={cells}
                set_cells={set_cells}
                colors={colors}
                columns={columns}
                mode={selected_mode}
                is_mouse_down={is_mouse_down}
                selected_color_index={selected_color_index}
              />
            ))}
        </g>
      </Svg>

      <Button fixed b30 r30 w265 fs22 pv10>
        <Link href="https://marie.studiodev.xyz/" target="_blank">
          Marie Malarme © 2023
        </Link>
      </Button>
    </Wrapper>
  )
}

const Link = Component.text_dec_none.black.a()

const Controls = ({
  cells,
  set_cells,
  image,
  set_image,
  colors,
  set_colors,
  canvas,
  set_canvas,
  columns,
  set_columns,
  tile_size,
  set_tile_size,
  selected_mode,
  set_selected_mode,
  display_settings,
  set_display_settings,
  selected_color_index,
  set_selected_color_index,
  set_is_loading,
  context,
  svg_ref,
}) => (
  <ControlsPanel>
    <Toggle onClick={() => set_display_settings(!display_settings)}>
      {display_settings ? 'Hide' : 'Show'} settings
    </Toggle>
    <Canvas elemRef={set_canvas} width="0" height="0" />

    <Div hidden={!display_settings} ba b_rad5 w100p bg_white>
      <Tabs>
        {Object.keys(modes).map((mode, index) => (
          <Tab
            onClick={() => set_selected_mode(mode)}
            grey3={selected_mode !== mode}
            bb={selected_mode !== mode}
            key={index}
            bl={index}
          >
            {mode}
          </Tab>
        ))}
      </Tabs>

      <Div pa15 w100p>
        <Parameter
          min={4}
          max={40}
          type="number"
          label="Columns (max 100)"
          value={columns}
          set_value={(value) => {
            if (!(value >= 4 && value <= 100)) return
            set_columns(Number(value))
            set_is_loading(false)
          }}
        />

        <Parameter
          min={20}
          max={200}
          type="number"
          label="Background tile size"
          value={tile_size}
          set_value={(value) => {
            if (!(value >= 20 && value <= 200)) return
            set_tile_size(Number(value))
            set_is_loading(false)
          }}
        />

        <Div mt20 mb10>
          {colors.map((color, index) => (
            <Color
              key={index}
              color={color}
              index={index}
              mode={selected_mode}
              colors={colors}
              set_colors={set_colors}
              selected_color_index={selected_color_index}
              set_selected_color_index={set_selected_color_index}
            />
          ))}
        </Div>

        {selected_mode === 'image' && (
          <ImageInput>
            <LoadedImage src={image}></LoadedImage>
            <Label>
              <LabelText>Import image</LabelText>
              <UploadInput
                type="file"
                onChange={(event) => {
                  const reader = new FileReader()
                  reader.onload = (event) => set_image(event.target.result)
                  reader.readAsDataURL(event.target.files[0])
                }}
              />
            </Label>
          </ImageInput>
        )}

        <Button
          onClick={() => {
            if (selected_mode === 'image') {
              set_is_loading(true)
              load_image({ columns, image, canvas, context }).then(
                (image_cells) => set_cells({ ...cells, image: image_cells }),
                set_is_loading(false),
              )
            } else {
              set_cells({
                ...cells,
                [selected_mode]: modes[selected_mode]({ columns, colors }),
              })
            }
          }}
          mt10
        >
          {selected_mode === 'draw' ? 'Clear' : 'Reset'} {selected_mode} pattern
        </Button>

        <Button
          onClick={() => {
            const cloned_svg = svg_ref.current.cloneNode(true)
            cloned_svg.removeAttribute('style')
            cloned_svg.removeAttribute('width')
            cloned_svg.removeAttribute('height')
            const { outerHTML: svg_html } = cloned_svg
            const blob = new Blob([svg_html], {
              type: 'image/svg+xml;charset=utf-8',
            })
            const URL = window.URL || window.webkitURL || window
            const url = URL.createObjectURL(blob)

            const link = document.createElement('a')
            link.href = url
            link.download = `cells.svg`
            link.click()
            link.remove()
          }}
        >
          Download SVG
        </Button>
      </Div>
    </Div>
  </ControlsPanel>
)

const Cell = ({ value, index, ...props }) => {
  const { cells, set_cells, only_display } = props
  const { mode, colors, columns, is_mouse_down, selected_color_index } = props
  const line_index = Math.floor(index / columns)
  const color = colors[value]

  const set_cells_colors = () => {
    if (only_display || color === colors[selected_color_index]) return
    const first_half = cells[mode].slice(0, index)
    const second_half = cells[mode].slice(index + 1, cells[mode].length)
    const new_cells = [...first_half, selected_color_index, ...second_half]
    set_cells({ ...cells, [mode]: new_cells })
  }

  return (
    <rect
      onClick={set_cells_colors}
      onMouseDown={set_cells_colors}
      onMouseOver={() => is_mouse_down && set_cells_colors()}
      key={index}
      fill={color}
      width={cell_size}
      height={cell_size}
      x={(index % columns) * cell_size}
      y={line_index * cell_size}
    />
  )
}

const Parameter = ({ value, set_value, label, set_is_loading, ...props }) => {
  const [input_value, set_input_value] = useState(value)
  const has_typed = value.toString() !== input_value.toString()

  return (
    <ParameterWrapper
      onKeyDown={({ key }) => key === 'Enter' && set_value(input_value)}
    >
      {label}
      <Div flex ai_center>
        <Input
          defaultValue={value}
          className="outline_button"
          onInput={({ target }) => set_input_value(target.value)}
          {...props}
        />
        <InputButton
          o50={!has_typed}
          c_pointer={has_typed}
          onClick={() => {
            if (!has_typed) return
            set_value(input_value)
          }}
        >
          OK
        </InputButton>
      </Div>
    </ParameterWrapper>
  )
}

const Color = ({ color, index, ...props }) => {
  const { colors, set_colors } = props
  const { selected_color_index, set_selected_color_index } = props

  const [is_hovered, set_is_hovered] = useState(false)
  const is_selected_color = index === selected_color_index

  return (
    <ParameterWrapper key={index}>
      <Div
        flex
        ai_center
        c_pointer
        onMouseEnter={() => set_is_hovered(true)}
        onMouseLeave={() => set_is_hovered(false)}
        onClick={() => set_selected_color_index(index)}
      >
        <Span bb b_white={!is_selected_color}>
          Color {index + 1}
        </Span>
        <Span
          ml15
          hidden={!is_hovered && !is_selected_color}
          o20={is_hovered}
          o100={is_selected_color}
        >
          ●
        </Span>
      </Div>

      <Div flex ai_center>
        <ColorValue>{color}</ColorValue>
        <ColorInput
          type="color"
          value={color}
          onInput={({ target }) => {
            const first_half = colors.slice(0, index)
            const second_half = colors.slice(index + 1, colors.length)
            const new_colors = [...first_half, target.value, ...second_half]
            if (colors === new_colors) return
            set_colors(new_colors)
          }}
        />
      </Div>
    </ParameterWrapper>
  )
}

const cell_size = 100
const base_colors = ['#fdff9e', '#00ff77', '#ffe5fc', '#000000']
const base_columns = 24

const load_lines = ({ columns }) =>
  [...Array(columns * columns).keys()].map((index) => get_lines_color(index))

const load_draw = ({ columns }) =>
  [...Array(columns * columns).keys()].map(() => 1)

const load_random = ({ columns, colors }) =>
  [...Array(columns * columns).keys()].map(() => random(0, colors.length - 1))

const load_image = async ({ columns, image, canvas, context }) => {
  const img = new Image()

  const resolve_cells_colors = () =>
    new Promise((resolve) => {
      img.onload = () => {
        const is_wider = img.width > img.height
        const biggest_size = Math.max(img.width, img.height)
        const smallest_size = Math.min(img.width, img.height)
        const centering_offset = (biggest_size - smallest_size) / 2
        const target_size = columns
        const start_x = is_wider ? centering_offset : 0
        const start_y = is_wider ? 0 : centering_offset
        const img_dimensions = [start_x, start_y, smallest_size, smallest_size]
        const target_dimensions = [0, 0, target_size, target_size]

        canvas.width = target_size
        canvas.height = target_size

        context.drawImage(img, ...img_dimensions, ...target_dimensions)
        const pixels = context.getImageData(...target_dimensions).data

        let cells_colors = []
        const chunk_size = 4
        for (let i = 0; i < pixels.length; i += chunk_size) {
          const [red, green, blue] = pixels.slice(i, i + chunk_size)
          const grey = Math.floor((red + green + blue) / 3)
          const index = Math.floor(grey / (255 / base_colors.length))
          cells_colors.push(index || 0)
        }

        resolve(cells_colors)
      }
    })
  img.src = image

  const image_cells = await resolve_cells_colors()
  return image_cells
}

const get_lines_color = (index, columns = base_columns) => {
  const color_index =
    ((!((index + 1) % 22) || (index + 1) % 22 === 1) && 3) ||
    (((index + 1) % 22 === 2 || (index + 1) % 22 === 3) && '0') ||
    (((index + 1) % 22 === 12 || (index + 1) % 22 === 13) && 2) ||
    1

  return color_index
}

const modes = {
  image: load_image,
  lines: load_lines,
  random: load_random,
  draw: load_draw,
}

const Wrapper = Component.w100vw.h100vh.of_scroll.flex.jc_center.ai_center.div()
const Canvas = Component.none.canvas()
const InputButton =
  Component.ml5.ls1.hover_shadow.b_rad10.h20.bg_white.ba.fs10.w30.mono.button()
const ControlsPanel =
  Component.absolute.flex.flex_column.ai_flex_end.t30.r30.w260.div()
const ParameterWrapper =
  Component.w100p.fs13.mt7.flex.ai_center.jc_between.div()
const Input = Component.ml10.sans.fs11.b_rad10.ba.h20.w35.text_center.input()
const Svg = Component.pa20.of_visible.max_h80p.max_w60p.svg()
const ImageInput =
  Component.mt25.mb10.w100p.relative.flex.ai_center.jc_center.div()
const LoadedImage = Component.fit_cover.w100p.h100.img()
const Label =
  Component.blend_difference.white.fs15.h100p.absolute.flex.ai_center.jc_center.label()
const LabelText = Component.ba.b_rad20.b_white.ph15.pv5.span()
const UploadInput = Component.o0.w100p.h100p.absolute.c_pointer.input()
const Button =
  Component.c_pointer.bg_white.w100p.mt5.fs14.ba.b_rad50.sans.ph15.pv5.button()
const ColorInput = Component.ml10.input()
const ColorValue = Component.grey3.span()
const Tabs = Component.w100p.fs14.flex.c_pointer.div()
const Tab = Component.capitalize.w50p.pa5.flex.ai_center.jc_center.div()
const Toggle = Component.bg_white.ph20.pv10.ba.b_rad50.c_pointer.mb10.div()

export default Home
