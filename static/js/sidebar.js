document.addEventListener("DOMContentLoaded", function() {
    const sidebar = document.getElementById("sidebar");
    const sidebarToggle = document.getElementById("sidebarToggle");
    const closeSidebar = document.getElementById("closeSidebar");
    
    // Show sidebar when the hamburger icon is clicked
    sidebarToggle.addEventListener("click", function() {
        sidebar.classList.add("show");
    });

    // Close sidebar when the close button inside the sidebar is clicked
    closeSidebar.addEventListener("click", function() {
        sidebar.classList.remove("show");
    });

    // Close sidebar when clicking outside of it
    document.addEventListener("click", function(e) {
        if (!sidebar.contains(e.target) && e.target !== sidebarToggle) {
            sidebar.classList.remove("show");
        }
    });
});
