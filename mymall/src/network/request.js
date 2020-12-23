import Axios from "axios";

export function request(config) {
  const instance = Axios.create({
    baseURL: 'http://152.136.185.210:7878/api/m5',
    timeout: 5000
  });

  // 请求拦截
  instance.interceptors.request.use(config => config
    , err => {
    })

  // 响应拦截
  instance.interceptors.response.use(res => res.data
    , err => console.log(err))

  // 发送真正网络请求
  return instance(config)
}
