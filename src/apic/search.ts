// 引入axios
import axios from "@/untils/axios";

import {type popovers, type HotWords,type Optain,type searchByKeyword,type detailList } from "../typings"

export const getHotSearch = async () => {
    let {data} = await axios.get<HotWords>(`https://apis.netstart.cn/mogujie/hotSearch.json`);
    return data.data.hotWord.data;
}

export const getKeywordSearch = async (optain:Optain)=>{
    let {data} = await axios.get<searchByKeyword>(`https://apis.netstart.cn/mogujie/search/searchByKeyword?q=${optain.q}&sort=${optain.sort}&page=${optain.page}&minPrice=${optain.minPrice}&maxPrice=${optain.maxPrice}`);
    return data.result;
}

export const getProdectDetails = async (id:string)=>{
    let {data} =await axios.get<detailList>(`https://apis.netstart.cn/mogujie/goods/detail?itemId=${id}`);
    return data.data.result;
}

export const getPopoversList = async (id:string)=>{
    let {data} = await axios.get<popovers>(`https://apis.netstart.cn/mogujie/goods/getPromotionList?itemId=${id}`)
    return data;
}
