import axios from '../untils/axios'
import { type HomeNavigation, type HomeTopNav, type gettimeRob, type gettimeRobItem, type getHomeC, type recommend, type ContentTwo } from '../typings'

//热门模块
// 首页二级导航
export async function getHomeNavigation() {
    let { data } = await axios.get<Array<HomeNavigation>>('https://apis.netstart.cn/mogujie/category.json')
    return data
}
//首页小导航
export async function getHomeModuleRow() {
    let { data } = await axios.get<Array<HomeTopNav>>('https://apis.netstart.cn/mogujie/homeNav.json')
    return data
}
// 首页女装尖货榜
export async function gettimeLimitedQuickGrab() {
    let { data } = await axios.get<Array<gettimeRob>>('https://apis.netstart.cn/mogujie/shopNav.json')
    return data
}
//首页限时快抢
export async function getTimeProg() {
    let { data } = await axios.get<gettimeRobItem>('https://apis.netstart.cn/mogujie/actor/itemInfo?actorId=1721pi2&page=2&sortBy=1&tagName=%E4%B8%8A%E8%A1%A3')
    return data
}
//首页内容数据
export async function getHomeContent(count: string | number) {
    let { data } = await axios.get<Array<getHomeC>>(`https://apis.netstart.cn/mogujie/video/item?page=${count}`)
    return data
}



// 非热门模块
//首页小导航
export async function getHomeModuleRowTwo(pids: string) {
    let { data } = await axios.get<recommend>(`https://apis.netstart.cn/mogujie/category/getSub?pid=${pids}`)
    return data
}
//首页内容数据2
export async function getHomeContentTwo(pids: string, count: number) {
    let { data } = await axios.get<Array<ContentTwo>>(`https://apis.netstart.cn/mogujie/category/miniWall?fcid=${pids}&page=${count}&sort=new`)
    return data
}

//首页内容数据3
export async function getModuleHome(keyword: string) {
    let { data } = await axios.get<Array<getHomeC>>(`https://apis.netstart.cn/mogujie/video/item?q=${keyword}`)
    return data
}

