export const random = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const scroll_to = (event, id) => {
  event.preventDefault()
  const target = document.querySelector(`#${id}`)
  if (!target) return
  target.scrollIntoView({ block: 'center', behavior: 'smooth' })
}
