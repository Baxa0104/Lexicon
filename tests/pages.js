describe('Basic pages', function() {
    it('Contents', function(browser) {
      browser
        .useXpath()
        .navigateTo('http://localhost:3000/social')
        .assert.textContains('/html/body/pre', 'Users');
    }); 
  });