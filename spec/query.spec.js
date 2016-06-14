describe("Testing query module", function(){
  var query = require('../models/utilities/query');
  
  describe("Testing 'select' function.", function(){
    it("Should fail if 'what' and 'from' parameters are not specified.", function(done){
      query.select(null, "player_counts", null, null, null, function(err, data){
        expect(err).not.toBe(null);
        expect(data).toBe(undefined);
        done();
      });
      query.select("count", null, null, null, null, function(err, data){
        expect(err).not.toBe(null);
        expect(data).toBe(undefined);
        done();
      });
    });

    it("Should succeed if any of 'where', 'order', 'limit' paramters are not specified", function(done){
      query.select("count", "player_counts", null, null, null, function(err, data){
        expect(err).toBe(null);
        expect(data).not.toBe(undefined);
        done();
      });

    });

    it("Should gracefully handle failed requests to the database", function(done){
        query.select(
          "doesntExist", "norDoesThis", null, null, null, 
          function(err, data){
            expect(err).not.toBe(null);
            expect(data).toBe(undefined);
            done();
          }
        ); 
    });

    it("Should throw an error if no callback is provided.", function(){
      expect(function(){ query.select();  }).toThrow();
    });

    it("Should return an array of records each in JSON format", function(done){
      query.select("count", "player_counts", "count > 10000", 1, {field: "count", dir: "ASC"}, function(err, data){
        expect(err).toBe(null);
        expect(data.length).toBe(1);
        expect(data[0].count).not.toBe(undefined);
        done();
      });

    });
  });
});
