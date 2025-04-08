describe('Login Page', function() {
    it('should log in with valid credentials', function(browser) {
        // Step 1: Navigate to login page
        browser
            .url('http://localhost:3030/login')
            .waitForElementVisible('body', 1000) // Wait for the page to load

        // Step 2: Fill in login form (adjust selectors as per your page)
        browser
            .setValue('input[name="email"]', 'test@gmail.com') // Enter email
            .setValue('input[name="password"]', 'test') // Enter password
            .click('button[type="submit"]') // Click submit button

        // Step 3: Wait for successful login and check if redirected (e.g., to dashboard)
        browser
            .waitForElementVisible('.container', 5000) // Adjust for your actual dashboard element
            .assert.urlContains('/dashboard') // Ensure URL contains /dashboard
            .assert.containsText('.container', 'Welcome') // Check for a welcome message
            .end();
    });
});