'use strict';
//调用者集合
function printReceipt(tags) {
    let allItems = loadAllItems();
    let formattedTags = getFormattedTags(tags);
    let countedBarcode = getCountItems(formattedTags);
    let cartItems = buildCartItems(countedBarcode, allItems);
    let promotions = loadPromotions();
    let promotedItems = buildPromotedItems(cartItems, promotions);
    let totalPrice = calculateTotalPrice(promotedItems);
    let receipt = buildReceipt(totalPrice, promotedItems);
    let receiptString = buildReceiptString(receipt);

}

function getExitElementByBarcode(array, barcode) {
    // let result=array=array.find((item)=>{
    //     return item.barcode===barcode;//返回匹配正确的item
    // })
    // return result;//返回undefined；

    for (var item of array) {
        if (item.barcode === barcode) {
            return item;
        }
    }
    return null;
}
function getFormattedTags(tags) {
    // let result = tags.map((tag)=>{
    //     if(tag.includes('-')){
    //         let temps=tag.split('-');
    //         return {barcode: temps[0], count: parseInt(temps[1]};
    //     }else{
    //         return {barcode: tag, count: 1};
    //     }
    // })
    // return result;
    let result = [];
    for (let tag of tags) {
        if (tag.indexOf('-') === -1) {
            result.push({barcode: tag, count: 1});
        } else {
            let temps = tag.split('-');
            result.push({barcode: temps[0], count: parseInt(temps[1])});
        }
    }
    return result;
}
function getCountItems(formattedTags) {
    let result = [];
    for (let formattedTag of formattedTags) {
        let countItem = getExitElementByBarcode(result, formattedTag.barcode);
        //countItem===undefined;
        if (countItem) {
            result.push({barcode: formattedTag.barcode, count: formattedTag.count});
        } else {
            countItem.count += formattedTag.count;
        }
    }
    return result;
}
function buildCartItems(countedBarcodes, allItems) {
    let result = [];
    for (let countedBarcode of countedBarcodes) {
        let tempt = getExitElementByBarcode(allItems, countedBarcode.barcode);
        let cartItem = {
            barcode: tempt.barcode,
            name: tempt.name,
            unit: tempt.unit,
            price: tempt.price,
            count: countedBarcode.count
        };
        result.push(cartItem);
    }
    return result;
}
function buildPromotedItems(cartItems, promotions) {
    let result = [];
    let promotion = promotions[0];

    for (let cartItem of cartItems) {
        let saved = 0;
        let promote = false;
        for (let item of promotion.barcodes) {
            if (cartItem.barcode === item) {
                promote = true;
                break;
            }
        }
        if (promote && (promotion.type = 'BUY_TWO_GET_ONE_FREE')) {
            let savedCount = Math.floor(cartItem.count / 3);
            saved = savedCount * cartItem.price;
        }
        let payPrice = cartItem.count * cartItem.price - saved;
        result.push({
            barcode: cartItem.barcode,
            name: cartItem.name,
            unit: cartItem.unit,
            price: cartItem.price,
            count: cartItem.count,
            saved,
            payPrice
        });
    }
    return result;
}

function calculateTotalPrice(promotedItems) {
    var result = {totalPayPrice: 0, totalSaved: 0};
    for (var promotedItem of promotedItems) {
        result.totalPayPrice += promotedItem.payPrice;
        result.totalSaved += promotedItem.saved;
    }
    return result;
}

function buildReceipt(totalPrice, promotedItems) {
    let receiptItems = [];
    for (let promotedItem of promotedItems) {
        receiptItems.push({
            name: promotedItem.name,
            unit: promotedItem.unit,
            price: promotedItem.price,
            count: promotedItem.count,
            payPrice: promotedItem.payPrice
        });
    }
    return {
        receiptItems,
        totalPayPrice: totalPrice.totalPayPrice,
        totalSaved: totalPrice.totalSaved
    };
}


function buildReceiptString(receipt) {
    let receiptString = '';
    for (let item of receipt.receiptItems) {
        receiptString += `名称：${item.name}，数量：${item.count}${item.unit}，单价：${item.price.toFixed(2)}(元)，小计：${item.payPrice.toFixed(2)}(元)`;
        receiptString += '\n';
    }
    let lastResult = `***<没钱赚商店>收据***
${receiptString}----------------------
总计：${receipt.totalPayPrice.toFixed(2)}(元)
节省：${receipt.totalSaved.toFixed(2)}(元)
**********************`;
    console.log(lastResult);
    return lastResult;
}
//printReceipt(tags);


//printReceipt(tags);
//
// //对编号进行处理
// function getGoodsAndCount(tags){
//    //
//     let goodsAndCount=[],goodsStart=[];
//     let stringSplit=[],count=0;
//     tags=tags.sort();
//     for(let i=0,j=0;i<tags.length;i++) {
//
//         if(tags[i]!=tags[i+1]){
//             let stringObj={};
//             let stringObj={barcode:tags[i],count:count};
//             goodsStart.push(stringObj);
//         }else{
//             count+=1;
//         }
//     }
//     console.log(goodsStart);
//
//
//     for(var i=0;i<goodsStart.length;i++) {
//         var stringObj={};
//         stringSplit = goodsStart[i].split('-');
//         if (stringSplit.length == 2) {
//             goodsStart.barcode = stringSplit[0];
//             goodsStart.count = stringSplit[1]-'0';
//         } else {
//             goodsStart.barcode = stringSplit[0];
//             stringObj.count= 1;
//         }
//         goodsAndCount.push(stringObj);
//     }
//
//     console.log(goodsAndCount);
//     return goodsAndCount;
// }
//
//
//
//
// //获取购物车商品列表信息
// function getGoodsArray(goodsAndCount){
// //function getGoodsArray(){
//     //var goodsAndCount=[
//     //     {barcode:'ITEM000001',count:4},
//     //     {barcode:'ITEM000002',count:2},
//     //     {barcode:'ITEM000003',count:3}
//     // ];
//
//
//     var allItems=loadAllItems();
//     var goodsArray=[];
//     for(var i=0;i<goodsAndCount.length;i++){
//         for(var j=0;j<allItems.length;j++)
//         {
//             if(goodsAndCount[i].barcode==allItems[j].barcode){
//                 var goods={};
//                 goods.barcode=allItems[j].barcode;
//                 goods.name=allItems[j].name;
//                 goods.unit=allItems[j].unit;
//                 goods.price=allItems[j].price;
//                 goods.count=goodsAndCount[i].count;
//                 goodsArray.push(goods);
//             }
//         }
//     }
//     //console.log(goodsArray);
//     return goodsArray;
// }
//
// //匹配编码获取商品优惠的信息
// function getGoodsDisCount(goodsArrayi,disCountInfoLIstj){
//     var goodsDiscount={};
//     for(var k=0;k<disCountInfoListj.barcodes.length;k++){
//         goodsDiscount.barcode=goodsArrayi.barcode;
//         goodsDiscount.name=goodsArrayi.name;
//         goodsDiscount.unit=goodsArrayi.unit;
//         goodsDiscount.price=goodsArrayi.price;
//         goodsDiscount.count=goodsArrayi.count;
//         if(goodsArrayi.barcode==disCountInfoListj.barcodes[k]){
//             var x=Math.ceil(goodsArrayi.count/3);
//             goodsDiscount.type=disCountInfoListj.type;
//             goodsDiscount.discount=x*goodsArrayi.price;
//             goodsDiscount.subtotal=goodsArrayi.count*goodsArrayi.price-goodsDiscount.discount;
//         }else{
//             goodsDiscount.type='';
//             goodsDiscount.discount=0;
//             goodsDiscount.subtotal=goodsArrayi.price*goodsArrayi.count;
//         }
//     }
//     return goodsDisCount;
// }
//
// //查询促销信息，计算优惠和小计
// function getGoodsDiscountInfo(goodsArray){
//     var disCountInfoList=loadPromotions();
//     var goodsDiscountInfo=[];
//     for(var i=0;i<goodsArray.length;i++){
//         for(var j=0;j<disCountInfoList;j++){
//             goodsDiscountInfo.push(getGoodsDisCount(goodsArray[i],disCountInfoList[j]));
//             //
//             // for(var k=0;k<disCountInfoList[j].barcodes.length;k++){
//             //     if(goodsArray[i].barcode==disCountInfoList[j].barcodes[k]){
//             //         var goodsDiscount={};
//             //         var x=Math.ceil(goodsArray[i].count/3);
//             //         goodsDiscount.barcode=goodsArray[i].barcode;
//             //         goodsDiscount.name=goodsArray[i].name;
//             //         goodsDiscount.unit=goodsArray[i].unit;
//             //         goodsDiscount.price=goodsArray[i].price;
//             //         goodsDiscount.count=goodsArray[i].count;
//             //         goodsDiscount.type=disCountInfoList[j].type;
//             //         goodsDiscount.discount=x*goodsArray[i].price;
//             //         goodsDiscount.subtotal=goodsArray[i].count*goodsArray[i].price-goodsDiscount.discount;
//             //         goodsDiscountInfo.push(goodsDiscount);
//             //     }
//             // }
//         }
//     }
//     return goodsDiscountInfo;
// }
//
//
//
// //获取最终要显示的商品信息
// function getGoodsShowInfo(goodsDiscountInfo){
//     var goodsShowInfo=[];
//     for(var i=0;i<goodsDiscountInfo.length;i++){
//         var goodsShow={};
//         goodsShow.name=goodsDiscountInfo[i].name;
//         goodsShow.unit=goodsDiscountInfo[i].unit;
//         goodsShow.price=goodsDiscountInfo[i].price;
//         goodsShow.count=goodsDiscountInfo[i].count;
//         goodsShow.subtotal=goodsDiscountInfo[i].subtotal;
//         goodsShowInfo.push(goodsShow);
//     }
//     return goodsShowInfo;
// }
//
// //计算总价与总优惠值
// function getTotalMoney(goodsDiscountInfo)
// {
//     var totalMoney={'total':0,'discount':0};
//     for(var i=0;i<goodsDiscountInfo.length;i++){
//         totalMoney.total+=goodsDiscountInfo[i].subtotal;
//         totalMoney.discount+=goodsDiscountInfo[i].discount;
//     }
//     return totalMoney;
// }
//
// //获取小票信息
// function getReceipt(totalMoney,goodsShowInfo){
//     var receipt='';
//     for(var i=0;i<goodsShowInfo.length;i++){
//         receipt=JSON.stringify(goodsShowInfo[i]+'\n');
//     }
//     receipt+=totalMoney.total+totalMoney.discount;
//     return receipt;
// }
//
// //对象克隆
// // function clone1(obj){
// //     function Clone(){}
// //     Clone.prototype = obj;
// //     var o = new Clone();
// //     for(var a in o){
// //         if(typeof o[a] == "object") {
// //             o[a] = clone1(o[a]);
// //         }
// //     }
// //     return o;
// // }