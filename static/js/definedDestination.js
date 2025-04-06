document.getElementById('destination_address_dropdown').addEventListener('change', function () {
    var manualInput = document.getElementById('destination_address_manual');
    if (this.value === '') {
      manualInput.value = ''; // Clear input if a selection is made
      manualInput.disabled = false; // Enable manual input
    } else {
      manualInput.disabled = true; // Disable manual input if dropdown is used
      manualInput.value = this.value; // Set input value to selected dropdown value
    }
  });