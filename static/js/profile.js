document.getElementById("changePicBtn").addEventListener("click", function () {
    document.getElementById("profilePicInput").click();
});

document.getElementById("profilePicInput").addEventListener("change", function (event) {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById("profilePic").src = e.target.result;
            document.getElementById("uploadPicBtn").style.display = "";
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById("uploadProfilePicForm").addEventListener("submit", async function (event) {
    event.preventDefault();
    const fileInput = document.getElementById("profilePicInput");

    if (fileInput.files.length === 0) {
        alert("Please select an image first.");
        return;
    }

    const formData = new FormData();
    formData.append("profile_pic", fileInput.files[0]);

    const response = await fetch("/account/upload-profile-picture", {
        method: "POST",
        body: formData,
    });

    const result = await response.json();

    if (result.success) {
        alert("Profile picture updated successfully!");
        document.getElementById("profilePic").src = result.profile_pic;
    } else {
        alert("Error uploading profile picture.");
    }
});
