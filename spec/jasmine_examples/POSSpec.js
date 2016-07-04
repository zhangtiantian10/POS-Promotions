describe('POS', function(){
  var POS = require('../../lib/jasmine_examples/POS');
  var infoes = [
    {
      barcode: 'ITEM000001',
      name: '可口可乐',
      unit: '瓶',
      category: '食品',
      subCategory: '碳酸饮料',
      price: 3.00
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
    var data = [
        'ITEM000001',
        'ITEM000001',
        'ITEM000001',
        'ITEM000001',
        'ITEM000001',
        'ITEM000004',
        'ITEM000004',
        'ITEM000004'
    ];
    it('should return right data', function(){
      var pos = new POS();
      pos.setInfoes(infoes);
      expect(pos.print(data)).toEqual('可口可乐 3.00元 5瓶 加多宝 4.00元 3罐');
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

  // describe('print with promotions',function(){
  //   var data = [
  //       'ITEM000001',
  //       'ITEM000001',
  //       'ITEM000001',
  //       'ITEM000001',
  //       'ITEM000001',
  //       'ITEM000004',
  //       'ITEM000004',
  //       'ITEM000004'
  //   ];
  //   it('should return right data', function(){
  //     var pos = new POS();
  //     pos.set([
  //       'ITEM000001',
  //       'ITEM000005'
  //     ]);
  //     pos.setInfoes(infoes);
  //     expect(pos.print(data)).toEqual('可口可乐[X] 可口可乐[X] 可口可乐[X] 可口可乐[X] 可口可乐[X] 加多宝 加多宝 加多宝');
  //     console.log(pos.print(data));
  //   });
  // });

  describe('print with price',function(){
    var data = [
        'ITEM000001',
        'ITEM000001',
        'ITEM000001',
        'ITEM000001',
        'ITEM000001',
        'ITEM000004',
        'ITEM000004',
        'ITEM000004'
    ];
    it('should return right data', function(){
      var pos = new POS();
      pos.set([
        'ITEM000001',
        'ITEM000005'
      ]);
      pos.setInfoes(infoes);
      expect(pos.print(data)).toEqual('可口可乐 3.00元 5瓶[X] 加多宝 4.00元 3罐');
      console.log(pos.print(data));
    });
  });

  describe('sameCodeCount',function(){
    var data = [
        'ITEM000001',
        'ITEM000001',
        'ITEM000001',
        'ITEM000001',
        'ITEM000001',
        'ITEM000004',
        'ITEM000004',
        'ITEM000004'
    ];
    it('should return right data', function(){
      var pos = new POS();
      // pos.set([
      //   'ITEM000001',
      //   'ITEM000005'
      // ]);
      // pos.setInfoes(infoes);
      expect(pos.sameCodeCount(data)).toEqual([{barcode: 'ITEM000001', count: 5}, {barcode: 'ITEM000004', count: 3}]);
      console.log(pos.sameCodeCount(data));
    });
  });

});
