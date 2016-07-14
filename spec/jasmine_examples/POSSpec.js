describe('POS', function(){
  var POS = require('../../lib/jasmine_examples/POS');
  var infoes = [
    {
      barcode: 'ITEM000001',
      name: '可口可乐',
      unit: '瓶',
      category: '食品',
      subCategory: '碳酸饮料',
      price: 26.00
    },{
      barcode: 'ITEM000002',
      name: '脉动',
      unit: '瓶',
      category: '食品',
      subCategory: '功能饮料',
      price: 4.00
    },{
      barcode: 'ITEM000003',
      name: '雪碧',
      unit: '瓶',
      category: '食品',
      subCategory: '碳酸饮料',
      price: 3.00
    },{
      barcode: 'ITEM000004',
      name: '加多宝',
      unit: '罐',
      category: '食品',
      subCategory: '凉茶饮料',
      price: 4.00
    }
  ]

  describe('set', function(){
    it('should has been save promotions', function(){
      var pos = new POS();
      pos.set([
        'ITEM000001',
        'ITEM000005'
      ]);
      expect(pos.promotions.length).toEqual(2);
      expect(pos.promotions[0]).toEqual('ITEM000001');
      expect(pos.promotions[1]).toEqual('ITEM000005');
    });
  });

  describe('print', function(){
    describe('when we not have promotion', ()=>{
      var data = [
          'ITEM000001',
          'ITEM000001',
          'ITEM000001',
          'ITEM000001',
          'ITEM000001',
          'ITEM000003-2',
          'ITEM000004',
          'ITEM000004',
          'ITEM000004'
      ];

      it('should return right results', ()=>{
        var pos = new POS();
        pos.setInfoes(infoes);
        expect(pos.print(data)).toEqual('可口可乐 26.00元 5瓶 130.00元 雪碧 3.00元 2瓶 6.00元 加多宝 4.00元 3罐 12.00元 148.00元');
      });
    });

    describe('when we have promotion', ()=>{
      describe('and promotion item subTotal >= 100',() => {
        var data = [
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000003-2',
            'ITEM000004',
            'ITEM000004',
            'ITEM000004'
        ];

        it('should return right data', ()=>{
          var pos = new POS();
          pos.set([
            'ITEM000001',
            'ITEM000005'
          ]);
          pos.setInfoes(infoes);
          expect(pos.print(data)).toEqual('可口可乐 26.00元 5瓶 120.00元 10.00元 雪碧 3.00元 2瓶 6.00元 加多宝 4.00元 3罐 12.00元' +
          ' 可口可乐 130.00元 10.00元 138.00元 10.00元');
        });
      });

      describe('and promotion item subTotal < 100',() => {
        var data = [
            'ITEM000001',
            'ITEM000001',
            'ITEM000003-2',
            'ITEM000004',
            'ITEM000004',
            'ITEM000004'
        ];

        it('should return right data', ()=>{
          var pos = new POS();
          pos.set([
            'ITEM000001',
            'ITEM000005'
          ]);
          pos.setInfoes(infoes);
          expect(pos.print(data)).toEqual('可口可乐 26.00元 2瓶 52.00元 雪碧 3.00元 2瓶 6.00元 加多宝 4.00元 3罐 12.00元 70.00元');
        });
      });
    });
  });

  describe('sameBarcodeCount', function(){
    var data = [
        'ITEM000001',
        'ITEM000001',
        'ITEM000001',
        'ITEM000001',
        'ITEM000001',
        'ITEM000003-2',
        'ITEM000004',
        'ITEM000004',
        'ITEM000004'
    ];
    it('should return coco info', function(){
      var pos = new POS();
      expect(pos.sameBarcodeCount(data)).toEqual([{barcode: 'ITEM000001', count: 5}, {barcode: 'ITEM000003', count: 2}, {barcode: 'ITEM000004', count: 3}]);
    });
  });

  describe('transCodeToInfo', function(){
    it('should return coco info', function(){
      var pos = new POS();
      pos.setInfoes(infoes);
      var info = pos.transCodeToInfo('ITEM000001');
      expect(info.name).toEqual('可口可乐');
    });
  });

  describe('addAttributes', function(){
    describe('when item with promotion', function(){
      var item = {
        barcode: 'ITEM000001',
        name: '可口可乐',
        unit: '瓶',
        category: '食品',
        subCategory: '碳酸饮料',
        price: 26.00
      };
      describe('and subTotal < 100',() => {
        it('should return 可口可乐 3.00元 5瓶 15.00元', function(){
          var pos = new POS();
          var result = pos.addAttributes(item, ' [X]', 2);
          expect(result).toEqual('可口可乐 26.00元 2瓶 52.00元');
        });
      });

      describe('and subTotal >= 100', () => {
        it('should return 可口可乐 26.00元 5瓶 120.00元 10.00元', function(){
          var pos = new POS();
          var result = pos.addAttributes(item, ' [X]', 5);
          expect(result).toEqual('可口可乐 26.00元 5瓶 120.00元 10.00元');
        });
      });
    });

    describe('when item not promotion', function(){
      var item = {
        barcode: 'ITEM000001',
        name: '可口可乐',
        unit: '瓶',
        category: '食品',
        subCategory: '碳酸饮料',
        price: 3.00
      };
      it('should return 可口可乐 3.00元 5瓶 15.00元', function(){
        var pos = new POS();
        var result = pos.addAttributes(item, '', 5);
        expect(result).toEqual('可口可乐 3.00元 5瓶 15.00元');
      });
    });
  });

  describe('addItemPromotion', () => {
    it('should return 可口可乐 130.00元 10.00元', () => {
      var pos = new POS();
      pos.set([
        'ITEM000001',
        'ITEM000005'
      ]);
      pos.setInfoes(infoes);
      var barcodeCounts = [{barcode: 'ITEM000001', count: 5}, {barcode: 'ITEM000003', count: 2}, {barcode: 'ITEM000004', count: 3}];
      var result = pos.addItemPromotion(barcodeCounts);
      expect(result).toEqual(' 可口可乐 130.00元 10.00元');
    });
  });

  describe('addTotal', () => {
    describe('when have promotions item', () => {
      describe('and promotions item subTotal >= 100', () => {
        it('should return total saveTotal', () => {
          var pos = new POS();
          pos.set([
            'ITEM000001',
            'ITEM000005'
          ]);
          pos.setInfoes(infoes);
          var barcodeCounts = [{barcode: 'ITEM000001', count: 5}, {barcode: 'ITEM000003', count: 2}, {barcode: 'ITEM000004', count: 3}];
          expect(pos.addTotal(barcodeCounts)).toEqual('138.00元 10.00元');
        });
      });
      describe('and promotions item subTotal < 100', () => {
        it('should return total', () => {
          var pos = new POS();
          pos.set([
            'ITEM000001',
            'ITEM000005'
          ]);
          pos.setInfoes(infoes);
          var barcodeCounts = [{barcode: 'ITEM000001', count: 2}, {barcode: 'ITEM000003', count: 2}, {barcode: 'ITEM000004', count: 3}];
          expect(pos.addTotal(barcodeCounts)).toEqual('70.00元');
        });
      });
    });
  });
});
