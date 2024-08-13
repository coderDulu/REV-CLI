// import CryptoJs from 'crypto-js'
// import * as XLSX from 'xlsx/xlsx.mjs'

export function saveTextToFile(text: string, filename: string) {
  const blob = new Blob([text], { type: "text/plain" });
  downloadFile(blob, filename);
}

/**
 * 下载文件（将blob对象转换成URL）
 * @param blob blob对象 | url连接
 * @param filename 文件名
 */
export function downloadFile(data: Blob | string, filename: string) {
  let url = "";
  if (data instanceof Blob) {
    url = URL.createObjectURL(data);
  } else {
    url = data;
  }
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.click();
}

/**
 * 获取文件的md5
 * @param file File文件数据
 * @returns md5字符串
 */
// export function getFileMD5(file: any) {
//   return new Promise<string>((resolve, reject) => {
//     const reader = new FileReader()

//     reader.onload = function (e) {
//       const fileData: any = e?.target?.result
//       const fileWordArray = CryptoJs.lib.WordArray.create(fileData)

//       const md5 = fileData ? CryptoJs.MD5(fileWordArray).toString().toString() : ''

//       resolve(md5)
//     }

//     reader.onerror = (err) => {
//       reject(err.target?.result)
//     }

//     reader.readAsArrayBuffer(file)
//   })
// }

/**
 * AES128数据加密
 * @param value 需要加密的数据
 * @returns 加密后的数据
 */
export function encryptOfAES(value: string, key: string) {
  // const key = 'hxd66688hxd66688'
  const keyBytes = CryptoJs.enc.Utf8.parse(key);
  const ivBytes = CryptoJs.enc.Utf8.parse(key);
  const encrypted = CryptoJs.AES.encrypt(value, keyBytes, {
    iv: ivBytes,
    mode: CryptoJs.mode.CBC,
    padding: CryptoJs.pad.ZeroPadding,
  }).toString();

  return encrypted;
}

/**
 * 调用文件资源管理器
 * @param accept 过滤的文件列表
 */
export function dialogFileSelect(accept = "*") {
  return new Promise<File | undefined>((resolve, inject) => {
    try {
      const fileInput = document.createElement("input");
      // 这里可以添加代码来调用资源文件管理器，具体取决于你的需求
      // 以下是一个简单的例子，使用 input 元素触发文件选择
      fileInput.type = "file";
      fileInput.accept = accept;
      fileInput.click();

      // 处理文件选择的逻辑
      fileInput.addEventListener("change", function (event) {
        const selectedFile = (event.target as HTMLInputElement).files?.[0];
        resolve(selectedFile);
      });
      fileInput.addEventListener("cancel", (event) => {
        resolve(undefined);
      });
    } catch (error) {
      inject(error);
    }
  });
}

/**
 * 读取文件内容
 * @param file
 */
export function readFileOfString(file: File) {
  return new Promise<string | ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      resolve(e.target?.result || "");
    };

    reader.onerror = (err) => {
      reject(err);
    };

    reader.readAsText(file, "uft-8");
  });
}

export function readTextAsUnit8Array(unit8: Uint8Array) {
  const text = new TextDecoder().decode(unit8);
  return text;
}

// blob ->  string
export function blobToString(blob: Blob) {
  return new Promise<string | ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function () {
      if (reader.result) resolve(reader.result);
    };

    reader.onerror = function (error) {
      reject(error);
    };

    reader.readAsText(blob);
  });
}

/**
 * 读取文件内容并分块处理。 这个函数使用 FileReader API 来逐步读取文件，一次处理文件的一部分。用户可以提供回调函数来处理每一块数据，并在读取过程中监控进度。
 * @param file - 要读取的文件对象
 * @param chunkSize - 定义每个块的大小（以字节为单位）默认为1024 * 1024
 * @param onChunkRead - 当读取并处理完一个块时调用的回调函数。这个回调函数接受一个参数，即当前块的内容（一个字符串）。
 * @param onError - 当读取文件过程中发生错误时调用的回调函数。这个回调函数接受一个参数，即 Error 对象，它包含了错误的详细信息。
 *
 */
export function readFileInChunks(file: File, chunkSize = 1024 * 1024, onChunkRead: (chunk: any) => void, onError: (e: Event) => void) {
  let offset = 0;

  function readNextChunk() {
    const blob = file.slice(offset, offset + chunkSize);
    onChunkRead(blob);
    offset += chunkSize;
    if (offset < file.size) {
      readNextChunk();
    } else {
      console.log("file chunk read over");
    }
  }

  readNextChunk();
}

/**
 * 获取excel文件内容
 * @param file excel file
 * @param callback
 */
// export function readWorkbookFromLocalFile(file: File, callback: any) {
//   const reader = new FileReader()

//   reader.onload = function (e) {
//     const arrayBuffer = e.target.result
//     if (!arrayBuffer) return
//     // 将 ArrayBuffer 转换为 Binary String
//     let binaryString = ''
//     const bytes = new Uint8Array(arrayBuffer)
//     for (let i = 0; i < bytes.byteLength; i++) {
//       binaryString += String.fromCharCode(bytes[i])
//     }

//     const workbook = XLSX.read(binaryString, { type: 'binary' })
//     if (callback) {
//       const sheets = workbook.Sheets[workbook.SheetNames[0]]
//       const sheetData = XLSX.utils.sheet_to_json(sheets, { header: 1 })
//       callback(sheetData)
//     }
//   }

//   reader.readAsArrayBuffer(file)
// }

// 转换excel数据中的日期
export function excelDateToTimestamp(excelDate: number) {
  // JavaScript的日期是从1970年1月1日开始的毫秒数，Excel的日期是从1900年1月1日开始的天数
  // 所以我们需要做一些转换
  // 首先，将Excel的日期数字转换为JavaScript的日期数字（即从1900年1月1日开始的毫秒数）
  const jsDateNum = (excelDate - 25569) * 24 * 3600 * 1000;
  // 然后，创建一个新的日期对象
  const date = new Date(jsDateNum);
  // 最后，将日期对象转换为Unix时间戳（即从1970年1月1日00:00:00 UTC开始的秒数）
  const timestamp = date.getTime();
  return isNaN(timestamp) ? Date.now() : timestamp;
}
