// Default number of parking slots
let totalSlots = 0;

// JSON array to simulate parking slots
let parkingSlots = Array.from({ length: totalSlots }, (_, i) => ({
  "parking-number": (i + 1).toString(),
  "car-number": ""
}));

// Global variable to store the current action for the modal
let currentModalAction = null;
let currentSlotNumber = null;

// Function to render the parking map with individual Add and Remove buttons for each slot
function renderParkingMap() {
  const parkingMap = document.getElementById("parkingMap");
  parkingMap.innerHTML = ""; // Clear existing map

  parkingSlots.forEach(slot => {
    const slotDiv = document.createElement("div");
    slotDiv.className = `parking-slot ${slot["car-number"] ? "occupied" : "available"}`;
    slotDiv.id = `slot-${slot["parking-number"]}`;

    // Display parking slot number and car number
    slotDiv.innerHTML = `
      <strong>Slot ${slot["parking-number"]}</strong><br>
      Car: ${slot["car-number"] || "Available"}
    `;

    // Create Add Car button
    const addButton = document.createElement("button");
    addButton.textContent = "Add Car";
    addButton.onclick = () => openModal('addCar', slot["parking-number"]);
    addButton.disabled = !!slot["car-number"]; // Disable if slot is occupied

    // Create Remove Car button
    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove Car";
    removeButton.onclick = () => removeCar(slot["parking-number"]);
    removeButton.disabled = !slot["car-number"]; // Disable if slot is empty

    // Append buttons to the slot div
    slotDiv.appendChild(addButton);
    slotDiv.appendChild(removeButton);

    // Append slot div to parking map
    parkingMap.appendChild(slotDiv);
  });
}

// Function to open the modal for entering car number or changing slot count
function openModal(action, slotNumber = null) {
  currentModalAction = action;
  currentSlotNumber = slotNumber;
  const modalTitle = document.getElementById("modalTitle");
  const carInput = document.getElementById("carInput");
  const warningMessage = document.getElementById("warningMessage");

  if (action === 'addCar') {
    modalTitle.textContent = "Enter Car Number";
    carInput.placeholder = "Car Number";
    warningMessage.style.display = "none"; // Hide warning for adding car
  } else if (action === 'slotCount') {
    modalTitle.textContent = "Change Total Parking Slots";
    carInput.placeholder = "Total Slots";
    warningMessage.style.display = "block"; // Show warning for changing slots
  }

  carInput.value = "";
  document.getElementById("carModal").style.display = "block";
}

// Function to close the modal
function closeModal() {
  document.getElementById("carModal").style.display = "none";
  document.getElementById("carInput").value = ""; // Clear the input field
}

// Function to confirm the modal action (add car or change slot count)
function confirmAction() {
  const input = document.getElementById("carInput").value.trim();

  if (currentModalAction === 'addCar') {
    confirmAddCar(input);
  } else if (currentModalAction === 'slotCount') {
    changeTotalSlots(parseInt(input, 10));
  }
}

// Function to add a car to a specific slot
function confirmAddCar(carNumber) {
  if (!carNumber) {
    alert("Please enter a valid car number.");
    return;
  }

  // Check if the car number already exists in any slot
  const duplicateCar = parkingSlots.some(slot => slot["car-number"] === carNumber);
  if (duplicateCar) {
    alert("This car number is already parked in another slot.");
    return;
  }

  // Add car number to the specific slot
  const slot = parkingSlots.find(slot => slot["parking-number"] === currentSlotNumber);
  if (slot) {
    slot["car-number"] = carNumber;
    closeModal();
    renderParkingMap();
    localStorage.setItem("parkingSlots", JSON.stringify(parkingSlots));
  }
}

// Function to change the total number of parking slots
function changeTotalSlots(newTotal) {
  if (isNaN(newTotal) || newTotal <= 0) {
    alert("Please enter a valid number of parking slots.");
    return;
  }

  // Confirm action before making changes
  const confirmation = confirm("Changing the total number of parking slots will remove any car number data from the removed slots. Do you want to proceed?");
  if (confirmation) {
    totalSlots = newTotal;
    parkingSlots = Array.from({ length: totalSlots }, (_, i) => ({
      "parking-number": (i + 1).toString(),
      "car-number": parkingSlots[i] ? parkingSlots[i]["car-number"] : ""
    }));
    closeModal();
    localStorage.setItem("parkingSlots", JSON.stringify(parkingSlots));
    renderParkingMap();
  }
}

// Function to remove a car from a specific slot
function removeCar(slotNumber) {
  const slot = parkingSlots.find(slot => slot["parking-number"] === slotNumber);
  if (slot && slot["car-number"]) {
    slot["car-number"] = "";
    renderParkingMap();
    localStorage.setItem("parkingSlots", JSON.stringify(parkingSlots));
  }
}

// Function to load parking slots data from localStorage and render the map
function refreshParkingMap() {
  const storedData = JSON.parse(localStorage.getItem("parkingSlots"));
  if (storedData) {
    parkingSlots = storedData;
    renderParkingMap();
  }
}

// Initial render
renderParkingMap();

// Auto-refresh every 5 seconds to simulate real-time updates
setInterval(refreshParkingMap, 5000);
