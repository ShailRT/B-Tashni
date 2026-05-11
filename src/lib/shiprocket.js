export async function getShiprocketToken() {
    try {
        const response = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: process.env.SHIPROCKET_EMAIL,
                password: process.env.SHIPROCKET_PASSWORD
            }),
        });

        const data = await response.json();
        console.log("shiprocket data", data)
        if (!response.ok) throw new Error(data.message || "Failed to authenticate with Shiprocket");

        return data.token;
    } catch (error) {
        console.error("Shiprocket Auth Error:", error);
        return null;
    }
}

export async function createShiprocketOrder(orderData, token) {
    try {
        const payload = {
            order_id: orderData.id, // Your DB Order ID
            order_date: new Date(orderData.createdAt).toISOString().split('T')[0],
            pickup_location: "work", // Must match your Shiprocket pickup location name
            billing_customer_name: orderData.shippingAddress.firstName,
            billing_last_name: orderData.shippingAddress.lastName,
            billing_address: orderData.shippingAddress.address || orderData.shippingAddress.addressLine1 || "No Address Provided",
            billing_address_2: orderData.shippingAddress.apartment || orderData.shippingAddress.addressLine2 || "",
            billing_city: orderData.shippingAddress.city,
            billing_pincode: orderData.shippingAddress.pincode,
            billing_state: orderData.shippingAddress.state,
            billing_country: "India",
            billing_email: orderData.shippingAddress.email || (orderData.user ? orderData.user.email : "customer@example.com"),
            billing_phone: orderData.shippingAddress.phone || "0000000000",
            shipping_is_billing: true, // Assuming shipping matches billing
            order_items: orderData.items.map(item => ({
                name: (item.product && item.product.name) || item.name || "Product",
                sku: (item.product && item.product.sku) || item.sku || "N/A",
                units: item.quantity,
                selling_price: item.price,
            })),
            payment_method: "Prepaid", // Assuming Razorpay handled it
            sub_total: orderData.totalAmount,
            length: 10, // Default or dynamic packaging dimensions
            breadth: 10,
            height: 10,
            weight: 0.5, // Default or dynamic weight in KG
        };

        const response = await fetch("https://apiv2.shiprocket.in/v1/external/orders/create/adhoc", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to create Shiprocket order");

        return { success: true, shiprocketOrderId: data.order_id, shipmentId: data.shipment_id };
    } catch (error) {
        console.error("Shiprocket Order Creation Error:", error);
        return { success: false, error: error.message };
    }
}
