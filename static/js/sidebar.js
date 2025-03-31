document.addEventListener("DOMContentLoaded", function () {
    const sidebar = document.getElementById("sidebar");
    const sidebarToggle = document.getElementById("sidebarToggle");

    sidebarToggle.addEventListener("click", function () {
        sidebar.classList.toggle("show");

        // Hide the button when sidebar is open
        if (sidebar.classList.contains("show")) {
            sidebarToggle.style.display = "none";
        }
    });

    // Close sidebar when clicking outside (optional)
    document.addEventListener("click", function (event) {
        if (!sidebar.contains(event.target) && !sidebarToggle.contains(event.target)) {
            sidebar.classList.remove("show");
            sidebarToggle.style.display = "block"; // Show button again
        }
    });
});
