// 配置 获取api的数据
/* 命名的时候记得把父类文件名放前面:
    eg: live-data 需要的配置
        export interface live.....{}
*/

// 首页二级导航 （数组（字符串））
export interface HomeNavigation {
    data: {
        117330: {
            list: Array<{
                _material_end_time: number
                acm: string
                title: string
                miniWallkey: string
                _material_start_time: number
                maitKey: number
                _system_record_entry_id: number
            }>
        }
    }
}
export interface List {
    _material_end_time: number
    acm: string
    title: string
    miniWallkey: string
    _material_start_time: number
    maitKey: number
    _system_record_entry_id: number
}

// 首页二级导航条下标
export interface item  {
    [proName:  string]:  any
}
// 首页热门模块
// 首页小导航 （数组（字符串））
export interface HomeTopNav {
    image: string
    sort: number
    _system_record_entry_id: number
    link: string
    // _material_end_time: Number
    title: string
    titleColor: string
    // description?:String
    // acm: String
    h5Link: string
    // material_start_time: Number
}

// 首页女装尖货榜
export interface gettimeRob {
    timestamp: number
    _system_record_entry_id: string
    tagTitle: string
    link: string
    title: string
    _material_start_time: number
    countdown: number
    w: number
    backgroundImage: string
    _material_end_time: number
    acm: string
    categoryId?: number
}
// 首页限时快抢 
export interface gettimeRobItem {
    cover: string
    actorId: string
    livePrice: number
}
// 首页内容
export interface getHomeC {
    itemImage: string
    actorName: string
    showDiscountPrice: number
    bottomIcon?: string
    firstFrame: string
    actorId: string
    id: number
    actorAvatar: string
    sale: string
    title: string
    itemId: string
    explainId: string
    itemIdUrl: string
    actorIdUrl: string
    lefttop_taglist: Array<{
        img: string
    }>
}

// 首页除热门模块的其他页面
//首页推荐模块
export interface recommend {
    data: {
        list: Array<recommendList>
    }
}
export interface recommendList {
    _material_end_time: string
    title: string
    startTime?: number
    image: string
    _material_start_time: string
    sort?: string
    endTime?: string
    _system_record_entry_id: string
}
// 首页内容模块
export interface ContentTwo {
    result: {
        wall: {
            docs: Array<ContentTwoList>
        }
    }
}
export interface ContentTwoList {
    img: string
    iid: string
    title: string
    price: number
    sale: number
    cafv: string
    //查找类似商品（网页）
    similarityUrl: string
}



// live-data相关配置
export interface LiveBroadcastSort {
    api: string
    v: number
    ret: string
    data: LiveSortData
}
export interface LiveSortData {
    banners?: string
    // tabs: Array<LiveSortTabs>
    tabs: {
        items: Array<LiveSortTabs>
    }
}
export interface LiveSortTabs {
    id: number
    name: string
    active: boolean
    platform: number
}
//直播分类项具体数据
export interface LiveData {
    data: {
        lives: Array<LiveList>
    }
}
// 每个直播间的数据
export interface LiveList {
    "visitorCount": number,
    "shopCarts": {
        "goods": Array<liveHomeShopCartsGoodsItem>
    },
    "avatar": string,
    "bgImg": string,
    "recommended": boolean,
    "intro": string,
    "actUserId": string,
    "userName": string,
    "comments": Array<liveHomeShopCartsCommentsItem>,
    "roomId": number,
    "living": true,
    "roomTag": ""
}
// 直播间推荐商品数据
export interface liveHomeShopCartsGoodsItem {
    "itemId": string,
    "cover": string,
    "title": string,
    "type": number,
    "price": string,
    "discountPrice": string,
    "isNewItem": number
}
//直播间评论数据
export interface liveHomeShopCartsCommentsItem {
    "commentId": string,
    "type": number,
    "content": string,
    "avatar": string,
    "uid": string
}

// 直播的小图标
export interface livePlayBackListLefttop_taglistItem {
    "styleType": number,
    "img": string,
    "w": number,
    "h": number,
    "sort": string,
    "pagani_system_tagType": string
}

//直播间信息(直播流,码率,主播等信息)
export interface liveRoom {
    "data": {
        "roomId": number,
        "liveUrl": string,
        "actorInfo": {
            "avatar": string,
            "uid": string,
            "uname": string
        },
        "actorTag": {
            "icon": string,
            "listIcon": string,
        }
        "noticeContent": string,
        "actUserId": string,
        "onlineUserCount": number,
        "definitions": Array<liveRoomDefinitions>
    }
}
//直播间画质
export interface liveRoomDefinitions {
    "auto": boolean,
    "selected": false,
    "height": number,
    "width": number,
    "label": string,
    "template": string,
    "liveUrl": string
}
//直播间促销商品
export interface liveRoomGood {
    "data": {
        "itemList": Array<liveRoomGoods>
    }
}

export interface liveRoomGoods {
    "shopId": number,
    "image": string,
    "title": string,
    "itemId": string,
    "defaultPrice": number,
    "historySale": number,
    "stock": number,
    "seckill": boolean,//是否秒杀中
}

//直播间评论
export interface liveComment {
    "username": string
    "action": string
}

//直播间商品详情
export interface LiveDetailList {
    data: {
        result: {
            skuInfo: {
                props: Array<{
                    label: string,
                    list: Array<{
                        index: number,
                        name: string,
                        isDefault: boolean,
                        type: string
                    }>
                }>
            },
            skuBarInfo: {
                list: Array<{
                    color: string,
                    label: string,
                    image: string
                }>
            }
        }
    }
}

// 直播回放相关
export interface getPlaybackData {
    data: {
        "itemExplainList": Array<getPlaybackItemExplainListItem>,
        "likePics": Array<string>
    }
}

// 直播回放-itemExplainList
export interface getPlaybackItemExplainListItem {
    "explainId": number,
    "commentCount": number,
    "title": string,
    "videoId": number,
    "actorInfo": getPlaybackActorInfo,
    "dsrInfo": getPlaybackDsrInfo,
    "actorId": number,
    "subTitle": string,
    "videoInfo": getPlaybackVideo,
    "comments": Array<getPlaybackCommentsItem>,
    "shareInfo": Array<getPlaybackShareInfo>,
    "itemInfo": getPlaybackItemInfo,
    "itemExplainTopPrice_taglist": Array<getPlaybackItemExplainTopPrice_taglistItem>,
    "itemExplainSkuTopTitle_taglist": Array<getPlaybackItemExplainSkuTopTitle_taglist>
}

// 直播回放-itemExplainTopPrice_taglist
export interface getPlaybackItemExplainTopPrice_taglistItem {
    "img": string,
    "w": number,
    "h": number,
}

// 直播回放-商品的live图片-itemExplainSkuTopTitle_taglist
export interface getPlaybackItemExplainSkuTopTitle_taglist {
    "styleType": number,
    "img": string,
    "w": number,
    "h": number
}

// 直播回放-主播口碑
export interface getPlaybackDsrInfo {
    "dsrDesc": string,
    "showLevel": boolean,
    "dsrScoreColor": string,
    "dsrDescColor": string,
    "dsrScore": string,
    "dsrBgImg": string
}

// 直播回放-video
export interface getPlaybackVideo {
    "h265Url": string,
    "videoId": number,
    "cover": string,
    "benefitPointList": Array<getPlaybackBenefitPointListItem>
}

//直播回放-进度条提示
export interface getPlaybackBenefitPointListItem {
    "doc": string,
    "endTime": number,
    "time": number,
    "subtitleKeyword": string
}

// 直播回放-主播详情
export interface getPlaybackActorInfo {
    "weight": number,
    "avatar": string,
    "daren": boolean,
    "tag": string,
    "height": number,
    "attention": boolean,
    "living": boolean,
    "fansCount": string,
    "actorUserId": string,
    "name": string
}

// 直播回放-滚动评论
export interface getPlaybackCommentsItem {
    "total": number,
    "commentId": number,
    "avatar": string,
    "time": string,
    "userName": string,
    "userId": string,
    "content": string,
    "images": Array<string>
}

// 直播回放-直播间分享
export interface getPlaybackShareInfo {
    "shareSuccessText": string,
    "title": string,
    "shareBtnTitle": string,
    "imgUrl": string
}

// 直播回放-商品详情
export interface getPlaybackItemInfo {
    "soldCount": string,
    "discountPrice": string,
    "itemId": string,
    "hotSoldCount": string,
    "title": string,
    "fenPrice": number,
    "cover": string
}

// 直播回放-商品评论
export interface getPlaybackCommentItem {
    "userId": string,
    "images": Array<string>,
    "userName": string,
    "style": string,
    "isRepeatConsumer": boolean,
    "time": string,
    "commentId": number,
    "userVipLevelInfo": getPlaybackCommentUserVipLevelInfo,
    "avatar": string,
    "content": string
}

// 直播回放-商品评论中的userVipLevelInfo
export interface getPlaybackCommentUserVipLevelInfo {
    "level": {
        "name": string,
        "level": number
    },
    "cover": string
}

// 直播回放-购买详情
export interface getPlaybackBuyData {
    "priceBannerOnly": getPlaybackPriceBannerOnly,
    "skuInfo": getPlaybackSkuInfo,
    "skuBarInfo": getPlaybackSkuBarInfoImg,
    "webImOptionInfo": getPlaybackwebImOptionInfo,
    "shopInfo": {
        "shopId": string
    }
}

// 直播回放-购买广告图片-priceBannerOnly
export interface getPlaybackPriceBannerOnly {
    "w": number,
    "h": number,
    "imageURL": string
}

// 直播回放-skuInfo
export interface getPlaybackSkuInfo {
    "props": Array<getPlaybackSkuInfoProps>
    "styleKey": string,
    "sizeKey": string,
    "defaultPrice": string,
    "title": string
}

// 直播回放-购买尺码等-skuInfo-props
export interface getPlaybackSkuInfoProps {
    "label": string,
    "list": Array<getPlaybackSkuInfoPropsListItem>,
    "isDefault": boolean
}

// 直播回放-购买-webImOptionInfo
export interface getPlaybackwebImOptionInfo {
    "option": {
        "shopId": string,
        "userId": string,
        "goodsId": string,
        "img": string
    }
}

// 直播回放-购买-skuInfo-props-list
export interface getPlaybackSkuInfoPropsListItem {
    "index": number,
    "type": string,
    "name": string,
    "isDefault": boolean,
    "styleId": number
}

// 直播回放-购买图片-skuBarInfo
export interface getPlaybackSkuBarInfoImg {
    list: Array<getPlaybackSkuBarInfoListImgItem>
}


export interface getPlaybackSkuBarInfoListImgItem {
    "color": string,
    "label": string,
    "image": string,
    "stockId": string
}


// 搜索的相关接口
export interface HotWords {
    data: {
        hotWord: {
            data: Array<HotWord>
        }
    }
}

export interface HotWord {
    color: string;
    query: string;
    acm: string;
    frontword: string;
}

export interface Optain {
    q: string,
    sort: string,
    page: number,
    minPrice: number,
    maxPrice: number,
}

export interface searchByKeyword {
    result: {
        sortFilter: Array<sortFilterList>,
        priceFilter: Array<priceFilterList>,
        wall: {
            docs: Array<wallDocsList>
        }
    }
}

export interface sortFilterList {
    sortKey: string,
    title: string,
}
export interface priceFilterList {
    max: string,
    min: string,
}
export interface wallDocsList {
    tradeItemId: string,
    img: string,
    title: string,
    leftbottom_taglist: Array<leftbottomTagList>
    cfav: number,
    price: 69,
}

export interface leftbottomTagList {
    color: string,
    bgColor: string,
    content: string,
}

export interface detailList {
    data: {
        result: {
            topImages: Array<string>
            normalPrice: {
                priceTags: [{
                    text: string,
                }],
                nowPrice: string,
                currency: string,
                sales: string,
            },
            skuInfo: {
                title: string,
                props:Array<{
                    label:string,
                    list:Array<{
                        name:string,
                        sizeId:number,
                        styleId:number,
                    }>
                }>,
                skus:Array<{
                    sizeId:number,
                    styleId:number,
                    img:string,
                    stock:number,
                }>
            },
            detailInfo: {
                desc: string,
                detailImage: Array<{
                    key: string,
                    list: Array<string>,
                }>,
            },
            rateInfoV2: {
                list: Array<{
                    user: {
                        uname: string,
                        avatar: string,
                    },
                    created: number,
                    content: string,
                }>,
                cRate: number,
                rateTags: Array<{
                    value: string,
                    num: number,
                }>,
                cScore: string,
            },
            shopInfo:{
                name:string,
                shopId:string,
            }
        }
    }
}


export interface popovers {
    data: {
        flushKey: {
            data: {
                popovers: Array<{
                    data: {
                        effect: string,
                        limit: string
                        limitDesc: string,
                        validTime: string,
                        highlightCouponDesc: {
                            content: string,
                        }
                    },

                }>,
                outers: Array<{
                    text: string,
                }>
            }
        }
    }
}

// 购物车数据
export interface shopCarData {
    id: number,
    shopId: string,
    shopName: string,
    imgSrc: string,
    goodsName: string,
    count: number,
    style: string,
    size: string,
    price: string,
    isFreeMail: boolean,
}
