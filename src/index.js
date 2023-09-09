/**
 * @author 拆家大主教
 * @description 命名很乱，能用就成（
 */

import code from './code'
import './libgif.js'

const rub = new window.SuperGif({
  gif: document.querySelector('#codeImage')
})

rub.load(() => {
  const srcList = Array.from({ length: rub.get_length() }).map((_, i) => {
    rub.move_to(i)
    const src = rub.get_canvas().toDataURL('image/jpeg')
    return src
  })
  const promises = []
  const datas = []
  const canvas = document.createElement('canvas')
  canvas.width = '90'
  canvas.height = '58'
  const ctx = canvas.getContext('2d')
  srcList.forEach(src => {
    const img = document.createElement('img')
    img.src = src
    let resolveFn
    promises.push(new Promise((resolve) => { resolveFn = resolve }))
    img.onload = () => {
      ctx.drawImage(img, 0, 0)
      const imgData = ctx.getImageData(0, 0, 90, 58)
      const data = []
      for (let i = 0; i < imgData.data.length; i += 4) {
        const f = 0.3 * imgData.data[i] + 0.59 * imgData.data[i + 1] + 0.11 * imgData.data[i + 2]
        if (f < 200) {
          data.push(0)
        } else {
          data.push(255)
        }
      }
      datas.push(data)
      resolveFn()
    }
  })
  Promise.all(promises).then(() => {
    const imgData = ctx.getImageData(0, 0, 90, 58)
    for (let i = 0; i < datas[0].length; i++) {
      let cnt = 0
      for (let j = 0; j < 4; j++) {
        if (datas[j][i] === 0) {
          cnt++
        }
      }
      if (cnt > 1) {
        imgData.data[4 * i] = imgData.data[4 * i + 1] = imgData.data[4 * i + 2] = 0
      } else {
        imgData.data[4 * i] = imgData.data[4 * i + 1] = imgData.data[4 * i + 2] = 255
      }
    }
    ctx.putImageData(imgData, 0, 0)

    const numbers = []
    const position = [0, 22, 43, 65]
    for (let i = 0; i < 4; i++) {
      const numImgData = ctx.getImageData(position[i], 17, 17, 20)
      const color = []
      for (let i = 0; i < numImgData.data.length; i += 4) {
        color.push(numImgData.data[i] === 0 ? 0 : 1)
      }
      numbers.push(color)
    }
    const rst = []
    for (let j = 0; j < numbers.length; j++) {
      rst[j] = { number: 0, value: -Infinity, history: [] }
      for (let n = 0; n < 10; n++) {
        const codemode = code[n]
        let val = 0
        for (let bitI = 0; bitI < codemode.length; bitI += 17) {
          let zero1 = 0
          let zero2 = 0
          for (let deltaI = 0; deltaI < 17; deltaI++) {
            if (codemode[bitI + deltaI] === 0) {
              zero1++
            }
            if (numbers[j][bitI + deltaI] === 0) {
              zero2++
            }
          }
          if (zero1 - zero2 === 0) { val++ }
        }
        rst[j].history.push(val)
        if (val > rst[j].value) {
          rst[j].value = val
          rst[j].number = n
        }
      }
    }
    document.querySelector('#code').value = rst.map(o => o.number).join('')
  })
})
