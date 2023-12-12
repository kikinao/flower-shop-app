const  AlipaySdk = require('alipay-sdk').default;
const alipaySdk = new AlipaySdk({
    appId: '9021000132661709',//appID,
    signType: 'RSA2', //签名算法,
    gateway: 'https://openapi-sandbox.dl.alipaydev.com/gateway.do',//支付宝网关地址,
    alipayPublicKey: `MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAmKYe9nlJuK+pl44Uwj3wXMSzPWzzGH5yltKLOUGlXbCXe3oLyyv1h3+URYIW9ZCvRZOueBYHanbPeTvcxzwZnvHozmgdPufu4sjicobp/VJFhQoDgr4TGVG61QEIkkAgFE6aFj+eqYZ9+fDeu4CCp8jbfLSvn4ZY4J75gqaKVVJQgVABSLm0IIZ2iENU4NFqkzaoQlB+vhKSVtwT/Ho9EuU8Vibi5hdnYpyDHtwjJVUbAxFxSA50Js91hyuLtaG1VJz9cEvi76dDI9Ev230CRXRkH6n7F35RzdeGd6phXCG8Xz0lEGCbcFFzz4dsM2+y6SsMAsR+89qINZg3jbapnwIDAQAB`,
    privateKey: 'MIIEpQIBAAKCAQEAsXvBcfvra7bnEEzrN4VxZUGgJnFQn62tx1CnVGEpqjcxRFx468F7b7zYfXUNXDizWjWKABZB73NthBulbMbI2Ku5HuLaQKfAVCSDWUooNo8ZMTptv8/ZGhuYVZoIVRxbriEC/+YkTZ2JkfvwsFCan/UfxfDK6+J7tUtXS1g6rsoxY+wukcDhINFCR3IcceI0vJypJjDGy1UOMnLv3rexU9agEpEw0mz2ieeHMUQ0qEJs9o5zvgdZyYnTWxzc+79qZ4kud+qSIJE1CsUIc1waLJzFbCYh8KfRYaLtX1satOqKP2jE6PlZ4VKifSgLm7gA5jIU6Ab7VQwXkTtAzIEPvwIDAQABAoIBAQCJY69/uO+o1lFQAPskY5xAMejzWUx8D0oyvHCLlRtXtJnivWKtvXz8Jke/9lh9RzcvYbqODqzD26qvVWddKRRZBbWr/xfMbQ8pE4rKF+nBMkziGsTScucwmqP1v+MrX2RpCwzzYwg/PPA9nbXYBs1rfak25QtwRkZVNRlCLe5fVsLBu4ky1aK+iQQ+/GfecTquGpBbIg+70XXd4goA70yPuuY1n2HlxIDYIp3Q4HEVxKZ0WgIC0OO/szrr5qX4r/sQKV9AubDoECjyyXngMAMzl4QUVjlz/6KtclHxBzBCKKePqIHhdGslthKD2y+M/crQ3prGc5eRf+egkVCR4X7hAoGBAOTz8O3DSkTApdxuPS6WMNpUlX67OMY37iNxrstp9pKUpbt5onZ6qzaJve2UIaonxzkcqnvPHQjJZXyNzdJp+nRM2qO2nH5SMNRt4kCHs3MMOnZ1M8Oh/QwVzOQCMPv4OH5W1l+4CXFovivWzPJe4QEkmP1+oCEJ+QYPHZ4p/swVAoGBAMZzQozZh8J7rqTDdvqFCQI+a+Tk1J/h7xK4u7SzHi7rZdO9nrLjkBARvvSbq5V4mb2VySGhWhCmPs7SyoAbavW9fN70SUkQb1lkYJFApW0omwdPdt7fD71/4wnaBSfftgOhmlHs3QhU4zjlTX9KInhI3gsiXE5jlMSvBYJSz12DAoGBAN7JcTwruG1GeR8SNn7KrycE/6OeUxSvAA+FY+2UYtcnxk2zgp9/pnMffa1dY5TLuFSezFZFp58ROqwE4K9LaOcakfaUj5tsJw/PDUZ1xezBjXIPghtv2WiVHhcQ+tF1LKPjpB7oWmf84HCQSEXghVozXpvtR6xeo+99bfimLMYxAoGAc8i50m30nI8HBVCZ8W5/JBUBZGnyeFoc36JyueoruRpUreabWioVWprP++17fdkAcjGbSQjYAJDOYmNwDLByhnAJFBgZTgzNuq0q/nRmUDr5wJkndL9WcqzT7WKL0YjfrFy0Kgp1p6/HZuG6hoLde6qgCoUAsCe/m8W2BCSGojsCgYEAlhuCC7Y5296xoF145T/IM7uslNMukd2HMp9QKTcF+113V8JO1txZrjIbAjPmtUcx8FtqQsnx9/iPHoFq/YGSShkqeMIEqTsjP3CnIKj60xFx+93gay6Izqw9VdjxZYhNC4HzdICUXdrh66Fd2Y670JFK6+haKk+8hEKWrKv0Y9E='//应用的私钥
})
module.exports = alipaySdk;