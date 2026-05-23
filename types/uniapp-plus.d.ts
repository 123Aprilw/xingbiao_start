declare namespace UniApp {
  interface SocketTask {
    send(options: {
      data: string | ArrayBuffer
      success?: () => void
      fail?: (err: any) => void
      complete?: () => void
    }): void
    close(options?: {
      code?: number
      reason?: string
      success?: () => void
      fail?: (err: any) => void
      complete?: () => void
    }): void
    onOpen(callback: (res: { header?: any }) => void): void
    onClose(callback: (res: { code: number; reason: string }) => void): void
    onError(callback: (err: any) => void): void
    onMessage(callback: (res: { data: string | ArrayBuffer }) => void): void
  }
}

declare const plus: any
declare namespace plus {
  namespace io {
    function convertLocalFileSystemURL(url: string): string
    function readFile(path: string): ArrayBuffer
  }
}

declare module 'crypto-js' {
  const CryptoJS: any
  export default CryptoJS
}