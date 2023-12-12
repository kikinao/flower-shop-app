var express = require('express');
var router = express.Router();
// import axios from 'axios';
const axios = require('axios')

const alipaySdk = require('../db/alipayUtil');
const AlipayFormData = require('alipay-sdk/lib/form').default;
const cors = require('cors');
router.use(cors());
router.use(express.urlencoded({ extended: true }));


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});


router.post('/api/queryOrder', function (req, res, next) {
  let out_trade_no = req.body.out_trade_no;
  let trade_no = req.body.trade_no;
  //对接支付宝
  const formData = new AlipayFormData();
  formData.setMethod('get');
  formData.addField('bizContent', {
    out_trade_no,
    trade_no
  });
  const result = alipaySdk.exec('alipay.trade.query', {}, { formData: formData })

  result.then(resData => {
    axios({
      url:resData,
      method:'get'
    }).then(data => {

      let r = data.data.alipay_trade_query_response;
      if(r.code === '10000'){// 接口调用成功
        switch (r.trade_status) {
          case 'WAIT_BUYER_PAY':
            res.send(
              {
                "success": true,
                "message": "success",
                "code": 200,
                "timestamp": (new Date()).getTime(),
                "result": {
                  "status": 0,
                  "massage": '交易创建，等待买家付款'
                }
              }
            )
            break;
          case 'TRADE_CLOSED':
            res.send(
              {
                "success": true,
                "message": "success",
                "code": 200,
                "timestamp": (new Date()).getTime(),
                "result": {
                  "status": 1,
                  "massage": '未付款交易超时关闭，或支付完成后全额退款'
                }
              }
            )
            break;
          case 'TRADE_SUCCESS':
            res.send(
              {
                "success": true,
                "message": "success",
                "code": 200,
                "timestamp": (new Date()).getTime(),
                "result": {
                  "status": 2,
                  "massage": '交易支付成功'
                }
              }
            )
            break;
          case 'TRADE_FINISHED':
            res.send(
              {
                "success": true,
                "message": "success",
                "code": 200,
                "timestamp": (new Date()).getTime(),
                "result": {
                  "status": 3,
                  "massage": '交易结束，不可退款'
                }
              }
            )
            break;
        }
      }else if(r.code === '40004'){
        res.send('交易不存在');
      }

    }).catch(err => {
      res.json({
        msg:'查询失败',
        err
      })
    })
  })
});



router.post('/api/payment', function (req, res, next) {

  //前端给后端的数据
  let orderId = req.body.orderId;
  let totalPrice = req.body.totalPrice;
  //对接支付宝
  const formData = new AlipayFormData();

  formData.setMethod('get');
  formData.addField('returnUrl', 'http://localhost:5173/pay-success');
  formData.addField('bizContent', {
    outTradeNo: orderId, // 因为测试原因我们可以把订单号改为Math.random()
    productCode: 'FAST_INSTANT_TRADE_PAY', // 产品码
    totalAmount: totalPrice, // 商品金额
    subject: '打赏', // 出售商品的标题
    body: '您的支持是对我最大的鼓励' // 出售商品的内容
  });

  const result = alipaySdk.exec('alipay.trade.page.pay', {}, { formData: formData })
  result.then(resp => {
    res.send({
      code: 200,
      success: 'true',
      result: resp // resp包含我们成功跳转的地址
    })
  })
    .catch(err => {
      console.log("错误信息", err);
    })

})

module.exports = router;
