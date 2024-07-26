import { Plugin } from 'vite'
import electron from 'electron'
import proc from 'child_process'
import path from 'path'
import fs from 'fs'

interface Config {
  entry: string
  output?: string
}

interface PluginProp {
  main: Config
  preload?: Config
  tsconfig?: string
  watch?: string
}

let electronProcess: proc.ChildProcessWithoutNullStreams = null
let resolvedConfigBack: any = {} // configResolved resolvedConfig
let mode = 'development'

export default function myPlugin(prop: PluginProp): Plugin {
  const entryDir: Config[] = []

  entryDir.push(prop.main, prop.preload)

  return {
    name: 'vite-plugin-electron',
    // apply: 'serve',
    // 监听main进程文件变化
    handleHotUpdate({ file }) {
      const changeDir = path.resolve(path.dirname(file))
      // 开启监听
      if (prop.watch && isSubdirectory(prop.watch, changeDir)) {
        buildElectron(prop)
      } else {
        entryDir.forEach((item) => {
          const entryDir = path.dirname(item.entry)
          if (entryDir === changeDir || isSubdirectory(entryDir, changeDir)) {
            console.log(`${file} changed re compiler`)
            buildElectron(prop)
          }
        })
      }
    },
    // 初次运行
    configResolved(resolvedConfig) {
      mode = resolvedConfig.mode
      resolvedConfigBack = resolvedConfig

      if (mode === 'production') {
        // build 更新编译
        deleteFolderRecursive(path.join(resolvedConfigBack.root, 'dist'))

        runOfProcess(`tsc -p ${prop.tsconfig}`)
      } else {
        buildElectron(prop)
      }
    },
    closeBundle() {
      electronProcess && electronProcess.kill()
    }
  }
}

/**
 * 构建Electron
 * @param prop
 */
function buildElectron(prop: PluginProp) {
  deleteFolderRecursive(path.join(resolvedConfigBack.root, 'dist'))
  // 有tsconfig
  if (prop.tsconfig) {
    runOfProcess(`tsc -p ${prop.tsconfig}`)
  } else {
    // 没有tsconfig
    for (const key in prop) {
      if (key === 'main' || key === 'preload') {
        const item = prop[key] as Config
        const { entry, output } = item

        const outputDir = output ?? path.join(resolvedConfigBack.root, './dist/' + key)
        runOfProcess(`tsc ${entry} --outDir ${outputDir} --esModuleInterop`)
      }
    }
  }
}

/**
 * 运行electron
 */
function runElectron() {
  // 开始运行
  electronProcess && electronProcess.kill()
  // @ts-ignore
  electronProcess = proc.spawn(electron, [resolvedConfigBack.root], {
    stdio: 'inherit',
    env: {
      VITE_SERVER_PORT: resolvedConfigBack?.server?.port
    }
  })

  return electronProcess
}

/**
 * 判断目录是否为某一目录的子目录
 * @param parent 父目录
 * @param child 子目录
 */
function isSubdirectory(parent: string, child: string) {
  const parentPath = path.resolve(parent)
  const childPath = path.resolve(child)

  return childPath.startsWith(parentPath + path.sep)
}

/**
 * electron进程运行
 * @param command 指令
 */
function runOfProcess(command: string) {
  const tsc: proc.ChildProcess = proc.exec(command)

  tsc.on('close', () => {
    console.log(`Electron ts is Compiled`)
    mode === 'development' && runElectron()
  })

  tsc.on('error', (err) => {
    console.log('Compiled error ', err)
  })

  tsc.on('exit', () => {
    console.log('Electron Process Exit')
  })
}

// 删除文件夹的函数
function deleteFolderRecursive(folderPath: string) {
  if (fs.existsSync(folderPath)) {
    // 获取文件夹中的文件和子文件夹列表
    fs.readdirSync(folderPath).forEach((file) => {
      const curPath = folderPath + '/' + file

      // 递归删除子文件夹
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath)
      } else {
        // 删除文件
        fs.unlinkSync(curPath)
      }
    })

    // 删除空文件夹
    fs.rmdirSync(folderPath)
    // console.log(`文件夹 ${folderPath} 已成功删除。`)
  } else {
    console.log(`文件夹 ${folderPath} 不存在。`)
  }
}
