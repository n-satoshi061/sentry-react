// axiosの通信でエラーが発生したらtrueを返す処理
export const isAxiosError = (error: Error) => {
    if(error) {
        return true
    }
    return false
}