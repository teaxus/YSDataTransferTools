var CryptoJs = require('crypto-js');
var pako = require('pako');

const YSDataTransferTools = {
  const: {
    defaultIv: "ogiGRWos02oH22301#" //偏移量
  },
  //处理密钥字符格式
  encParse: function (key) {
    return CryptoJs.enc.Latin1.parse(key);
  },
  //判断是否是Base64格式的字符串
  isBase64: function (str) {
    let reg = /^(([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=))|(([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{2}==))$/;
    return reg.test(str);
  },
  encodeBase64Str: function (str) {
    // 转为base64之前要先转16进制
    let returnStr = CryptoJs.enc.Utf8.parse(str);
    // 只有base64格式的字符才能被解密
    return CryptoJs.enc.Base64.stringify(returnStr);
  },
  decodeBase64Str: function (str) {
    return CryptoJs.enc.Base64.parse(str).toString(CryptoJs.enc.Utf8);
  },

  //数据加密
  encryptData(str, key) {
    if (key.length != 18)
      throw "密钥必须是18位";
    const encryptedStr = CryptoJs.AES.encrypt(str, YSDataTransferTools.encParse(key), {
      iv: YSDataTransferTools.encParse(YSDataTransferTools.const.defaultIv),
      mode: CryptoJs.mode.CFB,
      padding: CryptoJs.pad.Pkcs7
    });
    return encryptedStr.toString();  //加密字符串
  },
  //数据解密
  decryptData(cryptStr, key) {
    if (key.length != 18)
      throw "密钥必须是18位";
    const dencryptedStr = CryptoJs.AES.decrypt(cryptStr, YSDataTransferTools.encParse(key), {
      iv: YSDataTransferTools.encParse(YSDataTransferTools.const.defaultIv),
      mode: CryptoJs.mode.CFB,
      padding: CryptoJs.pad.Pkcs7
    });
    return dencryptedStr.toString(CryptoJs.enc.Utf8);
  },
  //压缩字符
  zip: function (str) {
    return pako.deflate(str, { to: 'string' });
  },
  //解压字符串Gzip
  unzip: function (zipStr) {
    return pako.inflate(zipStr, { to: 'string' });
  },
  //打包数据
  packageData: function (obj, key = YSDataTransferTools.makePassword()) {
    let strReturn = null;
    if (typeof (obj) != "object")
      throw "打包的数据必须是对象";
    try {
      let strEncodeObjJson = encodeURI(JSON.stringify(obj));
      let strZipJson = YSDataTransferTools.zip(strEncodeObjJson);
      let encryptData = YSDataTransferTools.encryptData(strZipJson, key);
      strReturn = encryptData;
    }
    catch (e) {
      throw e;
    }
    return strReturn;
  },
  //解包数据
  unpackageData: function (packageData, key = YSDataTransferTools.makePassword()) {
    let strReturn = null;
    try {
      let dncryptData = YSDataTransferTools.decryptData(packageData, key);
      let unzipData = YSDataTransferTools.unzip(dncryptData);
      strReturn = decodeURI(unzipData);
    }
    catch (e) {
      throw "解包失败，可能密钥不正确，请检查密钥是否过期";
    }
    return strReturn == null ? null : JSON.parse(strReturn);
  },
  makeId: function () {
    return Math.random() * 100000000000000000;
  },
  makePassword: function () {
    //通过分钟和小时生成密钥
    const date = new Date();
    const hour = date.getUTCHours();
    //生成低4位，保证是3位数
    let passLow4 = 1000 + hour;
    return "23d$%Q#kjwgsl@" + passLow4;
  },
}
module.exports = YSDataTransferTools;
