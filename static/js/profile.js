document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.getElementById("file-input");
    const uploadBtn = document.getElementById("upload-btn");
    const changeBtn = document.getElementById("change-btn");
    const profilePreview = document.getElementById("profile-preview");
    const profilePlaceholder = document.getElementById("profile-placeholder");

    if (!fileInput || !changeBtn) return;

    // Open file picker when clicking "Change Picture"
    changeBtn.addEventListener("click", () => fileInput.click());

    // Show upload button and update preview when file is selected
    fileInput.addEventListener("change", (event) => {
        if (event.target.files.length > 0) {
            const file = event.target.files[0];
            const reader = new FileReader();

            reader.onload = (e) => {
                // Update profile image preview
                if (profilePreview) {
                    profilePreview.src = e.target.result;
                    profilePreview.style.display = "block";
                }
                // Hide placeholder if an image is uploaded
                if (profilePlaceholder) {
                    profilePlaceholder.style.display = "none";
                }
            };

            reader.readAsDataURL(file);
            uploadBtn.style.display = "block"; // Show Upload button
        }
    });
});
