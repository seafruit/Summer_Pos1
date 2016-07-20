'use strict';

//对编号进行处理
function getGoodsAndCount(tags){
   //
    var tags=[
        'ITEM000001',
        'ITEM000001',
        'ITEM000001',
        'ITEM000001',
        'ITEM000001',
        'ITEM000003-2',
        'ITEM000005',
        'ITEM000005',
        'ITEM000005'
    ];
    var goodsAndCount=[],goodsStart=[];
    var stringSplit=[],cnt=0;

    tags=tags.sort();
    for(var i=0,j=0;i<tags.length;i++) {
        //var stringObj={};
        if(tags[i]!=tags[i+1]){
            var stringObj={};
            var stringObj={barcode:tags[i],count:cnt};
            goodsStart.push(stringObj);
        }else{
            cnt+=1;
        }
    }


    for(var i=0;i<goodsStart.length;i++) {
        var stringObj={};
        stringSplit = goodsStart[i].split('-');
        if (stringSplit.length == 2) {
            goodsStart.barcode = stringSplit[0];
            goodsStart.count = stringSplit[1]-'0';
        } else {
            goodsStart.barcode = stringSplit[0];
            stringObj.count= 1;
        }
        goodsAndCount.push(stringObj);
    }

    console.log(goodsAndCount);
    return goodsAndCount;
}




//获取购物车商品列表信息
function getGoodsArray(goodsAndCount){
//function getGoodsArray(){
    //var goodsAndCount=[
    //     {barcode:'ITEM000001',count:4},
    //     {barcode:'ITEM000002',count:2},
    //     {barcode:'ITEM000003',count:3}
    // ];


    var allItems=loadAllItems();
    var goodsArray=[];
    for(var i=0;i<goodsAndCount.length;i++){
        for(var j=0;j<allItems.length;j++)
        {
            if(goodsAndCount[i].barcode==allItems[j].barcode){
                var goods={};
                goods.barcode=allItems[j].barcode;
                goods.name=allItems[j].name;
                goods.unit=allItems[j].unit;
                goods.price=allItems[j].price;
                goods.count=goodsAndCount[i].count;
                goodsArray.push(goods);
            }
        }
    }
    //console.log(goodsArray);
    return goodsArray;
}

//匹配编码获取商品优惠的信息
function getGoodsDisCount(goodsArrayi,disCountInfoLIstj){
    var goodsDiscount={};
    for(var k=0;k<disCountInfoListj.barcodes.length;k++){
        goodsDiscount.barcode=goodsArrayi.barcode;
        goodsDiscount.name=goodsArrayi.name;
        goodsDiscount.unit=goodsArrayi.unit;
        goodsDiscount.price=goodsArrayi.price;
        goodsDiscount.count=goodsArrayi.count;
        if(goodsArrayi.barcode==disCountInfoListj.barcodes[k]){
            var x=Math.ceil(goodsArrayi.count/3);
            goodsDiscount.type=disCountInfoListj.type;
            goodsDiscount.discount=x*goodsArrayi.price;
            goodsDiscount.subtotal=goodsArrayi.count*goodsArrayi.price-goodsDiscount.discount;
        }else{
            goodsDiscount.type='';
            goodsDiscount.discount=0;
            goodsDiscount.subtotal=goodsArrayi.price*goodsArrayi.count;
        }
    }
    return goodsDisCount;
}

//查询促销信息，计算优惠和小计
function getGoodsDiscountInfo(goodsArray){
    var disCountInfoList=loadPromotions();
    var goodsDiscountInfo=[];
    for(var i=0;i<goodsArray.length;i++){
        for(var j=0;j<disCountInfoList;j++){
            goodsDiscountInfo.push(getGoodsDisCount(goodsArray[i],disCountInfoList[j]));
            //
            // for(var k=0;k<disCountInfoList[j].barcodes.length;k++){
            //     if(goodsArray[i].barcode==disCountInfoList[j].barcodes[k]){
            //         var goodsDiscount={};
            //         var x=Math.ceil(goodsArray[i].count/3);
            //         goodsDiscount.barcode=goodsArray[i].barcode;
            //         goodsDiscount.name=goodsArray[i].name;
            //         goodsDiscount.unit=goodsArray[i].unit;
            //         goodsDiscount.price=goodsArray[i].price;
            //         goodsDiscount.count=goodsArray[i].count;
            //         goodsDiscount.type=disCountInfoList[j].type;
            //         goodsDiscount.discount=x*goodsArray[i].price;
            //         goodsDiscount.subtotal=goodsArray[i].count*goodsArray[i].price-goodsDiscount.discount;
            //         goodsDiscountInfo.push(goodsDiscount);
            //     }
            // }
        }
    }
    return goodsDiscountInfo;
}



//获取最终要显示的商品信息
function getGoodsShowInfo(goodsDiscountInfo){
    var goodsShowInfo=[];
    for(var i=0;i<goodsDiscountInfo.length;i++){
        var goodsShow={};
        goodsShow.name=goodsDiscountInfo[i].name;
        goodsShow.unit=goodsDiscountInfo[i].unit;
        goodsShow.price=goodsDiscountInfo[i].price;
        goodsShow.count=goodsDiscountInfo[i].count;
        goodsShow.subtotal=goodsDiscountInfo[i].subtotal;
        goodsShowInfo.push(goodsShow);
    }
    return goodsShowInfo;
}

//计算总价与总优惠值
function getTotalMoney(goodsDiscountInfo)
{
    var totalMoney={'total':0,'discount':0};
    for(var i=0;i<goodsDiscountInfo.length;i++){
        totalMoney.total+=goodsDiscountInfo[i].subtotal;
        totalMoney.discount+=goodsDiscountInfo[i].discount;
    }
    return totalMoney;
}

//获取小票信息
function getReceipt(totalMoney,goodsShowInfo){
    var receipt='';
    for(var i=0;i<goodsShowInfo.length;i++){
        receipt=JSON.stringify(goodsShowInfo[i]+'\n');
    }
    receipt+=totalMoney.total+totalMoney.discount;
    return receipt;
}

//对象克隆
// function clone1(obj){
//     function Clone(){}
//     Clone.prototype = obj;
//     var o = new Clone();
//     for(var a in o){
//         if(typeof o[a] == "object") {
//             o[a] = clone1(o[a]);
//         }
//     }
//     return o;
// }