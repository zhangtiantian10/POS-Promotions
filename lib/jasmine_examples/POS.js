function POS() {

}

POS.prototype.print = function(jsonData) {
  this.data = this.sameCodeCount(jsonData);
  return this.data.reduce((prev, curr) => {
    var dealName = '';
    if (this.searchPromotions(curr.barcode)) {
      dealName = this.addAttributes(this.transCodeToInfo(curr.barcode), '[X]', curr.count);
    } else {
      dealName = this.addAttributes(this.transCodeToInfo(curr.barcode), '', curr.count);
    }

    if(prev === '') {
      return dealName
    }
    return prev + ' ' + dealName;
  }, '');
}

POS.prototype.sameCodeCount = function(jsonData){
  var codeCounts = [];
  for(var i = 0 ; i < jsonData.length; i++) {
    codeCounts = this.a(jsonData[i], codeCounts);
  }
  return codeCounts;
}

POS.prototype.a = function(code, codeCounts) {
  for(var i = 0 ; i < codeCounts.length ; i++) {
    if(code === codeCounts[i].barcode) {
      codeCounts[i].count ++;
      break;
    }
  }

  if(i === codeCounts.length) {
    codeCounts.push({barcode : code, count : 1});
  }

  return codeCounts;
}

POS.prototype.addAttributes = function(item, flag, count) {
  return item.name + ' ' + parseFloat(item.price).toFixed(2) + '元' + ' ' + count + item.unit + flag;
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
