// Function to open the food item form
function openFoodItemForm() {
    const form = document.getElementById('foodItemForm');
    if (form.style.display === 'block') {
        form.style.display = 'none'; // Hide the form if it's already visible
    } else {
        form.style.display = 'block'; // Show the form if it's hidden
        document.getElementById('addFoodItemForm').reset(); // Reset the form
        document.getElementById('foodItemId').value = ''; // Clear the food item ID
    }
}

// Function to save or update a food item
function saveFoodItem() {
    const restaurantId = new URLSearchParams(window.location.search).get('restaurantId');
    const foodItemId = document.getElementById('foodItemId').value;
    const foodName = document.getElementById('foodName').value;
    const foodPrice = document.getElementById('foodPrice').value;
    const foodImageInput = document.getElementById('foodImage');

    if (!foodName || !foodPrice) {
        alert("Please fill all fields.");
        return;
    }

    let restaurants = JSON.parse(localStorage.getItem('restaurants')) || [];
    let restaurant = restaurants.find(restaurant => restaurant.id == restaurantId);

    if (!restaurant) {
        alert("Restaurant not found.");
        return;
    }

    if (foodItemId) {
        // Editing an existing food item
        let foodItem = restaurant.foodItems.find(item => item.id == foodItemId);
        if (foodItem) {
            foodItem.name = foodName;
            foodItem.price = foodPrice;

            if (foodImageInput.files.length) {
                const reader = new FileReader();
                reader.onloadend = function () {
                    foodItem.image = reader.result;
                    try {
                        localStorage.setItem('restaurants', JSON.stringify(restaurants));
                        displayFoodItems(restaurantId);
                    } catch (e) {
                        if (e.name === 'QuotaExceededError') {
                            alert('Local storage quota exceeded. Please clear some data.');
                        } else {
                            console.error(e);
                        }
                    }
                };
                reader.readAsDataURL(foodImageInput.files[0]);
            } else {
                localStorage.setItem('restaurants', JSON.stringify(restaurants));
                displayFoodItems(restaurantId);
            }
        }
    } else {
        // Adding a new food item
        if (!foodImageInput.files.length) {
            alert("Please upload an image.");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = function () {
            const foodItem = {
                id: Date.now(),
                name: foodName,
                price: foodPrice,
                image: reader.result
            };

            restaurant.foodItems = restaurant.foodItems || [];
            restaurant.foodItems.push(foodItem); // Add new item to the end of the list
            localStorage.setItem('restaurants', JSON.stringify(restaurants));
            displayFoodItems(restaurantId);
        };
        reader.readAsDataURL(foodImageInput.files[0]);
    }

    // Reset the form and hide it
    document.getElementById('addFoodItemForm').reset();
    document.getElementById('foodItemForm').style.display = 'none';
}

// Function to display food items
function displayFoodItems(restaurantId) {
    const restaurants = JSON.parse(localStorage.getItem('restaurants')) || [];
    const restaurant = restaurants.find(restaurant => restaurant.id == restaurantId);
    const container = document.getElementById('foodItemsContainer');
    container.innerHTML = '';

    if (restaurant && restaurant.foodItems) {
        restaurant.foodItems.forEach((food) => {
            const foodItemDiv = document.createElement('div');
            foodItemDiv.classList.add('food-item');
            foodItemDiv.innerHTML = `
                        <img src="${food.image}" alt="${food.name}">
                        <h4>${food.name}</h4>
                        <p>Price: $${food.price}</p>
                        <button class="edit" onclick="editFoodItem(${restaurantId}, ${food.id})">Edit</button>
                        <button class="delete" onclick="deleteFoodItem(${restaurantId}, ${food.id})">Delete</button>
                        <button class="order" onclick="orderFood('${food.name}', ${food.price})">Order</button>
                    `;
            container.appendChild(foodItemDiv);
        });
    }
}

// Function to edit a food item
function editFoodItem(restaurantId, foodItemId) {
    const restaurants = JSON.parse(localStorage.getItem('restaurants')) || [];
    const restaurant = restaurants.find(restaurant => restaurant.id == restaurantId);

    if (!restaurant || !restaurant.foodItems) {
        alert("Food item not found.");
        return;
    }

    const foodItem = restaurant.foodItems.find(item => item.id == foodItemId);
    if (!foodItem) {
        alert("Food item not found.");
        return;
    }

    // Populate the form fields
    document.getElementById('foodItemId').value = foodItem.id;
    document.getElementById('foodName').value = foodItem.name;
    document.getElementById('foodPrice').value = foodItem.price;

    // Show the form
    document.getElementById('foodItemForm').style.display = 'block';
}

// Function to delete a food item
function deleteFoodItem(restaurantId, foodItemId) {
    let restaurants = JSON.parse(localStorage.getItem('restaurants')) || [];
    let restaurant = restaurants.find(restaurant => restaurant.id == restaurantId);

    if (!restaurant || !restaurant.foodItems) {
        alert("Food item not found.");
        return;
    }

    restaurant.foodItems = restaurant.foodItems.filter(item => item.id !== foodItemId);
    localStorage.setItem('restaurants', JSON.stringify(restaurants));
    displayFoodItems(restaurantId);
}

// Function to order food
function orderFood(foodName, price) {
    const orderForm = document.createElement('div');
    orderForm.innerHTML = `
            <h2>Order ${foodName}</h2>
            <form id="orderForm">
                <label for="customerName">Customer Name:</label>
                <input type="text" id="customerName" name="customerName" required><br>
                <label for="customerAddress">Customer Address:</label>
                <input type="text" id="customerAddress" name="customerAddress" required><br>
                <label for="customerPhone">Customer Phone:</label>
                <input type="text" id="customerPhone" name="customerPhone" required><br>
                <label for="quantity">Quantity:</label>
                <input type="number" id="quantity" name="quantity" required><br>
                <button type="button" onclick="placeOrder('${foodName}', ${price})">Place Order</button>
            </form>
            `;
    document.body.appendChild(orderForm);
}

function placeOrder(foodName, price) {
    const customerName = document.getElementById('customerName').value;
    const customerAddress = document.getElementById('customerAddress').value;
    const customerPhone = document.getElementById('customerPhone').value;
    const quantity = document.getElementById('quantity').value;

    if (customerName && customerAddress && customerPhone && quantity) {
        const totalPrice = price * quantity;
        alert(`Order placed for ${foodName}.\nQuantity: ${quantity}\nTotal Price: $${totalPrice}\nCustomer Name: ${customerName}\nCustomer Address: ${customerAddress}\nCustomer Phone: ${customerPhone}`);
        document.getElementById('orderForm').remove();
    } else {
        alert("Please fill all the details to place the order.");
    }
}

// Load food items when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const restaurantId = new URLSearchParams(window.location.search).get('restaurantId');
    if (restaurantId) {
        displayFoodItems(restaurantId);
    }
});


// Function to place an order
function placeOrder(foodName, price) {
    const customerName = document.getElementById('customerName').value;
    const customerAddress = document.getElementById('customerAddress').value;
    const customerPhone = document.getElementById('customerPhone').value;
    const quantity = document.getElementById('quantity').value;

    if (customerName && customerAddress && customerPhone && quantity) {
        const totalPrice = price * quantity;

        // Create an order object
        const order = {
            orderId: Date.now(), // Unique order ID
            foodName,
            price: totalPrice,
            customerName,
            customerAddress,
            customerPhone,
            quantity,
            timestamp: new Date().toISOString() // Current timestamp
        };

        // Save the order to localStorage
        let orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));

        // Show a confirmation message
        alert(`Order placed for ${foodName}.\nQuantity: ${quantity}\nTotal Price: $${totalPrice}\nCustomer Name: ${customerName}\nCustomer Address: ${customerAddress}\nCustomer Phone: ${customerPhone}`);

        // Remove the order form
        document.getElementById('orderForm').remove();
    } else {
        alert("Please fill all the details to place the order.");
    }
}