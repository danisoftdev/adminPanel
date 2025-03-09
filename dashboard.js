// Function to show/hide sections
function showSection(sectionId) {
    document.getElementById('restaurantSection').style.display = 'none';
    document.getElementById('foodSection').style.display = 'none';
    document.getElementById(sectionId).style.display = 'block';
}

// Function to load restaurants
function loadRestaurants() {
    const restaurants = JSON.parse(localStorage.getItem('restaurants')) || [];
    const tableBody = document.querySelector('#restaurantTable tbody');
    tableBody.innerHTML = '';

    restaurants.forEach((restaurant) => {
        const row = document.createElement('tr');
        row.innerHTML = `
                    <td>${restaurant.id}</td>
                    <td>${restaurant.restaurantName}</td>
                    <td>${restaurant.phone}</td>
                    <td>${restaurant.address}</td>
                    <td class="action-buttons">
                        <button class="edit" onclick="editRestaurant(${restaurant.id})">Edit</button>
                        <button class="delete" onclick="deleteRestaurant(${restaurant.id})">Delete</button>
                    </td>
                `;
        tableBody.appendChild(row);
    });
}

// Function to load food items
function loadFoodItems() {
    const restaurants = JSON.parse(localStorage.getItem('restaurants')) || [];
    const tableBody = document.querySelector('#foodTable tbody');
    tableBody.innerHTML = '';

    restaurants.forEach((restaurant) => {
        if (restaurant.foodItems) {
            restaurant.foodItems.forEach((food) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                            <td>${food.id}</td>
                            <td>${food.name}</td>
                            <td>$${food.price}</td>
                            <td>${restaurant.restaurantName}</td>
                            <td class="action-buttons">
                                <button class="edit" onclick="editFoodItem(${restaurant.id}, ${food.id})">Edit</button>
                                <button class="delete" onclick="deleteFoodItem(${restaurant.id}, ${food.id})">Delete</button>
                            </td>
                        `;
                tableBody.appendChild(row);
            });
        }
    });
}

// Function to edit a restaurant
function editRestaurant(id) {
    const restaurants = JSON.parse(localStorage.getItem('restaurants')) || [];
    const restaurant = restaurants.find((r) => r.id === id);

    if (restaurant) {
        const formContainer = document.createElement('div');
        formContainer.classList.add('form-container');
        formContainer.innerHTML = `
            <h3>Edit Restaurant</h3>
            <input type="text" id="editName" value="${restaurant.restaurantName}" placeholder="Name">
            <input type="text" id="editPhone" value="${restaurant.phone}" placeholder="Phone">
            <input type="text" id="editAddress" value="${restaurant.address}" placeholder="Address">
            <input type="file" id="editImage" placeholder="Upload Image">
            <button onclick="saveRestaurant(${id})">Save</button>
            <button onclick="cancelEdit()">Cancel</button>
            `;
        document.body.appendChild(formContainer);
    }
}

// Function to save the edited restaurant
function saveRestaurant(id) {
    const restaurants = JSON.parse(localStorage.getItem('restaurants')) || [];
    const restaurant = restaurants.find((r) => r.id === id);

    if (restaurant) {
        restaurant.restaurantName = document.getElementById('editName').value;
        restaurant.phone = document.getElementById('editPhone').value;
        restaurant.address = document.getElementById('editAddress').value;

        const imageInput = document.getElementById('editImage');
        if (imageInput.files.length > 0) {
            const reader = new FileReader();
            reader.onload = function (e) {
                restaurant.image = e.target.result;
                localStorage.setItem('restaurants', JSON.stringify(restaurants));
                loadRestaurants();
                cancelEdit();
            };
            reader.readAsDataURL(imageInput.files[0]);
        } else {
            localStorage.setItem('restaurants', JSON.stringify(restaurants));
            loadRestaurants();
            cancelEdit();
        }
    }
}

// Function to cancel the edit
function cancelEdit() {
    const formContainer = document.querySelector('.form-container');
    if (formContainer) {
        document.body.removeChild(formContainer);
    }
}

// Function to delete a restaurant
function deleteRestaurant(id) {
    let restaurants = JSON.parse(localStorage.getItem('restaurants')) || [];
    restaurants = restaurants.filter((r) => r.id !== id);
    localStorage.setItem('restaurants', JSON.stringify(restaurants));
    loadRestaurants();
    loadFoodItems(); // Refresh food items list
}

// Function to edit a food item
function editFoodItem(restaurantId, foodItemId) {
    const restaurants = JSON.parse(localStorage.getItem('restaurants')) || [];
    const restaurant = restaurants.find((r) => r.id === restaurantId);
    const foodItem = restaurant.foodItems.find((f) => f.id === foodItemId);

    if (foodItem) {
        const formContainer = document.createElement('div');
        formContainer.classList.add('form-container');
        formContainer.innerHTML = `
            <h3>Edit Food Item</h3>
            <input type="text" id="editFoodName" value="${foodItem.name}" placeholder="Name">
            <input type="text" id="editFoodPrice" value="${foodItem.price}" placeholder="Price">
            <input type="file" id="editFoodImage" placeholder="Upload Image">
            <button onclick="saveFoodItem(${restaurantId}, ${foodItemId})">Save</button>
            <button onclick="cancelEdit()">Cancel</button>
            `;
        document.body.appendChild(formContainer);
    }
}

// Function to save the edited food item
function saveFoodItem(restaurantId, foodItemId) {
    const restaurants = JSON.parse(localStorage.getItem('restaurants')) || [];
    const restaurant = restaurants.find((r) => r.id === restaurantId);
    const foodItem = restaurant.foodItems.find((f) => f.id === foodItemId);

    if (foodItem) {
        foodItem.name = document.getElementById('editFoodName').value;
        foodItem.price = document.getElementById('editFoodPrice').value;

        const imageInput = document.getElementById('editFoodImage');
        if (imageInput.files.length > 0) {
            const reader = new FileReader();
            reader.onload = function (e) {
                foodItem.image = e.target.result;
                localStorage.setItem('restaurants', JSON.stringify(restaurants));
                loadFoodItems();
                cancelEdit();
            };
            reader.readAsDataURL(imageInput.files[0]);
        } else {
            localStorage.setItem('restaurants', JSON.stringify(restaurants));
            loadFoodItems();
            cancelEdit();
        }
    }
}

// Function to delete a food item
function deleteFoodItem(restaurantId, foodItemId) {
    let restaurants = JSON.parse(localStorage.getItem('restaurants')) || [];
    const restaurant = restaurants.find((r) => r.id === restaurantId);

    if (restaurant && restaurant.foodItems) {
        restaurant.foodItems = restaurant.foodItems.filter((item) => item.id !== foodItemId);
        localStorage.setItem('restaurants', JSON.stringify(restaurants));
        loadFoodItems();
    }
}

// Load data when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadRestaurants();
    loadFoodItems();
});



// Function to order food
function loadOrders() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const tableBody = document.querySelector('#orderTable tbody');
    tableBody.innerHTML = '';

    orders.forEach((order) => {
        const row = document.createElement('tr');
        row.innerHTML = `
                <td>${order.id}</td>
                <td>${order.foodName}</td>
                <td>${order.quantity}</td>
                <td>${order.totalPrice}</td>
                <td>${order.customerName}</td>
                <td>${order.customerAddress}</td>
                <td>${order.customerPhone}</td>
            `;
        tableBody.appendChild(row);
    });
}

// Load orders when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadOrders();
});


// Function to load orders
function loadOrders() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const tableBody = document.querySelector('#orderTable tbody');
    tableBody.innerHTML = '';

    orders.forEach((order) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.orderId}</td>
            <td>${order.foodName}</td>
            <td>${order.quantity}</td>
            <td>$${order.price}</td>
            <td>${order.customerName}</td>
            <td>${order.customerAddress}</td>
            <td>${order.customerPhone}</td>
            <td>${new Date(order.timestamp).toLocaleString()}</td>
            <td class="action-buttons">
                <button class="delete" onclick="deleteOrder(${order.orderId})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Function to delete an order
function deleteOrder(orderId) {
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders = orders.filter((order) => order.orderId !== orderId);
    localStorage.setItem('orders', JSON.stringify(orders));
    loadOrders(); // Refresh the orders table
}
// Function to show/hide sections
function showSection(sectionId) {
    document.getElementById('restaurantSection').style.display = 'none';
    document.getElementById('foodSection').style.display = 'none';
    document.getElementById('orderSection').style.display = 'none';
    document.getElementById(sectionId).style.display = 'block';
}
// Load orders when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadOrders();
});


