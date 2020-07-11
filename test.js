const YSDataTransferTools = require('./YSDataTransferTools');
const assert = require('assert').strict;
const { access } = require('fs');
const testCount = 500;

// 制造测试数据
const strChinese = "外观（Facade）模式是“迪米特法则”的典型应用，它有以下主要优点。降低了子系统与客户端之间的耦合度，使得子系统的变化不会影响调用它的客户类。对客户屏蔽了子系统组件，减少了客户处理的对象数目，并使得子系统使用起来更加容易。降低了大型软件系统中的编译依赖性，简化了系统在不同平台之间的移植过程，因为编译一个子系统不会影响其他的子系统，也不会影响外观对象。";
const strEnglish = "ThyglasswillshowtheehowWhybeautieswearThydialhowthypreciousminuteswaste";


function makeStr(source, length) {
    var strReturn = "";
    while (strReturn.length <= length) {
        strReturn += source[parseInt(Math.random() * 10000000000000000) % (source.length - 1)];
    }
    return strReturn;
}
function makeChinese(length) {
    return makeStr(strChinese, length);
}
function makeEnglish(length) {
    return makeStr(strEnglish, length);
}

function makeChDict(keyLength, valLength, count) {
    var dictReturn = {};
    for (var i = 0; i < count; i++) {
        dictReturn[makeChinese(keyLength)] = makeChinese(valLength);
    }
    return dictReturn;
}
function makeEngDict(keyLength, valLength, count) {
    var dictReturn = {};
    for (var i = 0; i < count; i++) {
        dictReturn[makeEnglish(keyLength)] = makeEnglish(valLength);
    }
    return dictReturn;
}
var dictCh = makeChDict(10, 200, 10);
var dictEng = makeEngDict(10, 1024, 5);
var dictTest = { dictCh, dictEng };

var arrTestData = [];

describe('开始测试YSDataTransferTools功能', function () {
    this.timeout(5000);
    it('加密操作，总共加密：' + testCount + "次", function () {
        //编码测试
        for (var i = 0; i < testCount; i++) {
            var packageData = YSDataTransferTools.packageData(dictTest);
            arrTestData.push({ src: dictTest, encode: packageData });
        }
    });
    it('解密操作，总共解密：' + testCount + "次", function () {
        //反编码测试
        for (var index in arrTestData) {
            var dictTmp = arrTestData[index];
            dictTmp.decode = YSDataTransferTools.unpackageData(dictTmp.encode);
        }
    });
    it('校验操作，总共校验：' + testCount + "次", function () {
        //校验结果
        for (var index in arrTestData) {
            var dictTmp = arrTestData[index];
            var strSrc64 = YSDataTransferTools.encodeBase64Str(JSON.stringify(dictTmp.src))
            var strDecode64 = YSDataTransferTools.encodeBase64Str(JSON.stringify(dictTmp.decode))
            if (strSrc64 != strDecode64) {
                console.error("校验错误，测试失败！");
                assert.ok(false, "校验错误，测试失败！");
            }
        }
    });
    it('测试完成');
});

