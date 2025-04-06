// Initialize and show toasts on page load
document.addEventListener('DOMContentLoaded', function() {
    var toastElList = [].slice.call(document.querySelectorAll('.toast'));
    toastElList.forEach(function(toastEl) {
        new bootstrap.Toast(toastEl).show();
    });
});