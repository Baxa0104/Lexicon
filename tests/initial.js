describe('Basic pages', function() {
    it('check the front page loads', function(browser) {
      browser
        .navigateTo('http://localhost:3000/dashboard')
        .waitForElementVisible('body')
    }); 
  });
