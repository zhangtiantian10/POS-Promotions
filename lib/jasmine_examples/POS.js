function POS() {

}

POS.prototype.print = function(jsonData) {
  this.data = jsonData;
  var barcodeCounts = this.sameBarcodeCount(jsonData);
  return barcodeCounts.reduce((prev, curr) => {
    var dealName = '';
    if (this.searchPromotions(curr.barcode)) {
      dealName = this.addAttributes(this.transCodeToInfo(curr.barcode), ' [X]', curr.count);
    } else {
      dealName = this.addAttributes(this.transCodeToInfo(curr.barcode), '', curr.count);
    }

    if(prev === '') {
      return dealName
    }
    return prev + ' ' + dealName;
  }, '') + this.addItemPromotion(barcodeCounts) + ' ' + this.addTotal(barcodeCounts);
}

POS.prototype.addTotal = function(barcodeCounts) {
  var total = 0;
  var saveTotal = 0;
  barcodeCounts.forEach((barcodeCount) => {
    if(this.searchPromotions(barcodeCount.barcode) && this.transCodeToInfo(barcodeCount.barcode).price*barcodeCount.count >= 100) {
      total += (this.transCodeToInfo(barcodeCount.barcode).price*barcodeCount.count - 10);
      saveTotal += 10;
    }else {
      total += this.transCodeToInfo(barcodeCount.barcode).price*barcodeCount.count;
    }
  });
  if(saveTotal != 0) {
    return parseFloat(total).toFixed(2) + '元 ' + parseFloat(saveTotal).toFixed(2) + '元';
  }
  return parseFloat(total).toFixed(2) + '元';
}

POS.prototype.addAttributes = function(item, flag, count) {
  var subTotal = item.price * count;
  if(flag === ' [X]' && subTotal >= 100){
    subTotal -= 10;
    return item.name + ' '
          + parseFloat(item.price).toFixed(2) + '元' + ' '
          + count + item.unit + ' '
          + parseFloat(subTotal).toFixed(2) + '元 '
          + parseFloat(10).toFixed(2) + '元';
  }
  return item.name + ' '
        + parseFloat(item.price).toFixed(2) + '元' + ' '
        + count + item.unit + ' '
        + parseFloat(subTotal).toFixed(2) + '元';
}

POS.prototype.addItemPromotion = function(barcodeCounts) {
  return barcodeCounts.reduce((prev, curr) => {
    var dealName = '';
    if (this.searchPromotions(curr.barcode) && this.transCodeToInfo(curr.barcode).price*curr.count >= 100) {
      dealName = this.transCodeToInfo(curr.barcode).name + ' '
                + parseFloat(this.transCodeToInfo(curr.barcode).price*curr.count).toFixed(2) + '元 '
                + parseFloat(10).toFixed(2) + '元';
      return prev + ' ' + dealName;
    }
    return prev;
  }, '');
}

POS.prototype.sameBarcodeCount=function(jsonData){
  var barcodeCounts =[];
  for(var i=0;i<jsonData.length;i++){
    var codeArray = jsonData[i].split('-');
    if(codeArray.length === 1){
      barcodeCounts = this.searchSameBarcode(codeArray[0], barcodeCounts, 1);
    }
    else{
      barcodeCounts = this.searchSameBarcode(codeArray[0], barcodeCounts, parseInt(codeArray[1]));
    }
  }
  return barcodeCounts;
}

POS.prototype.searchSameBarcode = function(code,barcodeCounts, count) {
  for(var j=0;j<barcodeCounts.length;j++){
    if(code === barcodeCounts[j].barcode){
      barcodeCounts[j].count += count;
      break;
    }
  }
  if(j === barcodeCounts.length) {
    barcodeCounts.push({barcode:code,count:count});
  }
  return barcodeCounts;
}

POS.prototype.searchPromotions = function(code) {
  if(!this.promotions) {
    return false;
  }
  var filteredCode = this.promotions.filter((promotion) => {
    return promotion === code;
  });
  return filteredCode.length != 0;
}

POS.prototype.transCodeToInfo = function(code) {
  var filteredInfoes = this.infoes.filter((info) => {
    return info.barcode === code;
  });
  return filteredInfoes[0];
}

POS.prototype.set = function(promotions) {
  this.promotions = promotions;
}

POS.prototype.setInfoes = function(infoes) {
  this.infoes = infoes;
}

module.exports = POS;
