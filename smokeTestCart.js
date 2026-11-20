const BASE_URL = 'http://localhost:3000/cart';

async function runSmokeTest() {
    console.log('--- Starting Shopping Cart API Smoke Test ---\n');

    try {
        console.log('1. Testing POST /cart/add (Add Book)...');
        let res = await fetch(`${BASE_URL}/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: 1, bookId: 1, quantity: 1 })
        });
        console.log('Status:', res.status, await res.json(), '\n');

        console.log('2. Testing GET /cart/1 (Retrieve Items)...');
        res = await fetch(`${BASE_URL}/1`);
        const cartData = await res.json();
        console.log('Status:', res.status, cartData, '\n');

        const cartId = cartData.cartId || 1;

        console.log('3. Testing PUT /cart/item (Update Quantity to 2)...');
        res = await fetch(`${BASE_URL}/item`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cartId: cartId, bookId: 1, quantity: 2 })
        });
        console.log('Status:', res.status, await res.json(), '\n');

        console.log('4. Testing GET /cart/subtotal/1 (Calculate Subtotal)...');
        res = await fetch(`${BASE_URL}/subtotal/1`);
        console.log('Status:', res.status, await res.json(), '\n');

        console.log(`5. Testing DELETE /cart/item/${cartId}/1 (Remove Book)...`);
        res = await fetch(`${BASE_URL}/item/${cartId}/1`, {
            method: 'DELETE'
        });
        console.log('Status:', res.status, await res.json(), '\n');

        console.log('--- Smoke Test Completed Successfully ---');
    } catch (error) {
        console.error('Smoke Test Failed:', error.message);
    }
}

runSmokeTest();