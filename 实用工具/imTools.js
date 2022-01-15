// import CryptoJS from 'crypto-js/crypto-js'
// import md5 from 'crypto-js/md5'
const jsencryp = new window.JSEncrypt()
const pemKey =
  '-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCjMYXb3QLh7yW1qcV1ku+0x9iF1WLqcDGP7HuuHaSVQaevJw6YAO7oVTnJ+dKqgJgvUUJ6NMFc2Bh96DbAA9kzbhQtX3zQLe88HD2jw+Iuvy2iEG8/ky5+j0znWBrHUULkiHElmMn5eqGRsCWEkXhTqtNbzr9GCPbSRAkJR2eWpwIDAQAB-----END PUBLIC KEY-----'
// 生成k1
export const generateKey = function () {
  let str = ''
  const arr = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z'
  ]
  for (let i = 0; i < 16; i++) {
    const pos = Math.round(Math.random() * (arr.length - 1))
    str += arr[pos]
  }
  return str
}

// 生成密钥
// export const generateSecretKey = function (k1, k2, sq = 0) {
//   const value = `${k1}${k2}${sq}`
//   const md5Value = md5(value).toString()
//   const key = md5Value.toString(16).slice(-16)
//   return key
// }

// 生成rsa密钥
export const importRsaKey = function (pem) {
  // 去掉开头结尾无用的部分，留下中间base64编码
  const pemHeader = '-----BEGIN PUBLIC KEY-----'
  const pemFooter = '-----END PUBLIC KEY-----'
  const pemContents = pem.substring(
    pemHeader.length,
    pem.length - pemFooter.length
  )
  // 将base64反转
  const binaryString = window.atob(pemContents)
  // 再将之前的结果进行ArrayBuffer格式化
  const binary = stringToBuffer(binaryString)
  // 将ArrayBuffer使用到importKey中生成CryptoKey
  return window.crypto.subtle.importKey(
    'spki',
    binary,
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256'
    },
    true,
    ['encrypt']
  )
}
// rsa加密
export const rsaEncrypt = function (value) {
  jsencryp.setPublicKey(pemKey)
  const encrypted = jsencryp.encrypt(value)
  return encrypted
}

// 生成aes密钥
export const importAesKey = function (binary) {
  // aes应该是ArrayBuffer
  return window.crypto.subtle.importKey(
    'raw',
    binary,
    { name: 'AES-CBC', length: 256 },
    true,
    ['encrypt', 'decrypt']
  )
}

// aes加密控制
export const aesEncryptHandle = async function (k, data) {
  // k:ArrayBuffer msg:buffer
  const key = await importAesKey(k)
  const finalValue = await aesEncrypt('neoclub123456789', data, key)
  return finalValue
}
// aes加密
export const aesEncrypt = function (ivOffset, data, key) {
  // data: ArrayBuffer key: CryptoKey
  const iv = stringToBuffer(ivOffset)
  return crypto.subtle.encrypt(
    {
      name: 'AES-CBC',
      iv
    },
    key,
    data
  )
}
// aes解密控制
export const aesDecryptHandle = async function (k, data) {
  // k:ArrayBuffer msg:buffer
  const key = await importAesKey(k)
  const finalValue = await aesDecrypt('neoclub123456789', data, key)
  return finalValue
}
// aes解密
export const aesDecrypt = function (ivOffset, data, key) {
  // data: ArrayBuffer key: CryptoKey
  const iv = stringToBuffer(ivOffset)
  return crypto.subtle.decrypt(
    {
      name: 'AES-CBC',
      iv
    },
    key,
    data
  )
}
// ArrayBuffer转base64
export const bufferToBase64 = function (buffer) {
  const bytes = new Uint8Array(buffer)
  const binary = String.fromCharCode(...bytes)
  return window.btoa(binary)
}
// base64转ArrayBuffer
export const base64ToBuffer = function (base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}
// string转ArrayBuffer
export const stringToBuffer = function (str, length) {
  const buf = new ArrayBuffer(length || str.length)
  const bufView = new Uint8Array(buf)
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i)
  }
  return buf
}
// ArrayBuffer转string
export const bufferToString = function (u) {
  return new Promise((resolve) => {
    const b = new Blob([u])
    const r = new FileReader()
    r.readAsText(b, 'utf-8')
    r.onload = function () {
      resolve(r.result)
    }
  })
}
// 加载blob数据
export const blobToString = function (b) {
  return new Promise((resolve) => {
    const r = new FileReader()
    r.readAsText(b, 'utf-8')
    r.onload = function () {
      resolve(r.result)
    }
  })
}
// blob转buffer
export const blobToBuffer = function (b) {
  return new Promise((resolve) => {
    const r = new FileReader()
    r.readAsArrayBuffer(b)
    r.onload = function () {
      resolve(r.result)
    }
  })
}
// 拼接ArrayBuffer
export const splicing = function (...arrays) {
  let totalLen = 0
  for (let i = 0; i < arrays.length; i++) {
    arrays[i] = new Uint8Array(arrays[i]) // 全部转成Uint8Array
    totalLen += arrays[i].length
  }
  const res = new Uint8Array(totalLen)
  let offset = 0
  for (const arr of arrays) {
    res.set(arr, offset)
    offset += arr.length
  }
  return res
}
function bufferControl(value, len, type) {
  const buffer = new ArrayBuffer(len)
  if (type === 'ui16') {
    new DataView(buffer).setUint16(
      0,
      value
      /* 第三个参数，设置true时，使用小端字节序 */
    )
  } else if (type === 'i32') {
    new DataView(buffer).setInt32(
      0,
      value /* 第三个参数，设置true时，使用小端字节序 */
    )
  }
  return buffer
}
// 制造params
export const makeParams = function (
  { head = 12, version = 3, cmdId, seq = 0 },
  bytesBody
) {
  const prefix = [
    bufferControl(head, 2, 'ui16'),
    bufferControl(version, 2, 'ui16'),
    bufferControl(cmdId, 2, 'ui16'),
    bufferControl(seq, 4, 'i32'),
    bufferControl(bytesBody.byteLength, 2, 'ui16')
  ]
  const res = splicing(...prefix, bytesBody)
  return res
}

// export const cryptoJsAesEnCrypto = function (k, arrayBuffer) {
//   const key = CryptoJS.enc.Utf8.parse(k)
//   const plaintText = CryptoJS.lib.WordArray.create(arrayBuffer)
//   const finalValue = CryptoJS.AES.encrypt(plaintText, key, {
//     iv: CryptoJS.enc.Utf8.parse('neoclub123456789'),
//     mode: CryptoJS.mode.CBC,
//     padding: CryptoJS.pad.Pkcs7
//   })
//   return wordToByteArray(finalValue.ciphertext.words)
// }

// function wordToByteArray(wordArray) {
//   const byteArray = []
//   for (let i = 0; i < wordArray.length; ++i) {
//     const word = wordArray[i]
//     for (let j = 3; j >= 0; --j) {
//       byteArray.push((word >> (8 * j)) & 0xff)
//     }
//   }
//   const ui8 = new Uint8Array(byteArray)
//   return ui8
// }
