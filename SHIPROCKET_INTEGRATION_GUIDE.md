# Shiprocket Integration for B-Tashni E-commerce Project

## Overview
This document outlines the complete integration of Shiprocket shipping services into the B-Tashni e-commerce platform. Shiprocket is India's leading shipping aggregator that provides doorstep delivery, tracking, and logistics management.

## Current State Analysis
The project currently has:
- Order management with status tracking (PENDING → PROCESSING → SHIPPED → DELIVERED)
- Razorpay payment integration
- Basic shipping address collection via Razorpay Magic Checkout
- Admin panel for order status updates
- trackingNumber field in database (unused)

## Shiprocket API Overview
Shiprocket provides REST APIs for:
- Authentication (login to get token)
- Order creation and management
- Shipment tracking
- Label generation
- Pickup scheduling
- Courier partner management

### Key API concepts
- **Authentication:** Shiprocket uses `POST /auth/login` to exchange your account credentials for a bearer token. The token is valid for a limited time, so your server should cache it and refresh only when expired.
- **Order creation:** Use `POST /orders/create/adhoc` to create an order in Shiprocket using your customer shipping data, item details, and package dimensions.
- **Order details:** Use `GET /orders/show/{order_id}` to fetch the current state of a Shiprocket order and verify shipment assignment.
- **Shipment tracking:** Use `GET /courier/track/awb/{awb_code}` to retrieve live courier status for the AWB number assigned by Shiprocket.
- **Label generation:** Use `POST /courier/generate/label` with the Shiprocket shipment ID to generate printable shipping labels.
- **Pickup scheduling and courier selection:** Shiprocket automatically schedules pickups for created orders, and its API can return courier partner lists and availability using endpoints like `/courier/courierListWithCounts`.

### Why this matters for B-Tashni
- Your order flow stays the same for customers: checkout and Razorpay payment remain unchanged.
- After payment, the order is created internally and later linked to a Shiprocket shipment.
- Admins can use Shiprocket APIs to create shipments, generate labels, and expose tracking details to customers.

## Required Changes

### 1. Environment Variables
Add these to your `.env.local` file:

```env
# Shiprocket API Credentials
SHIPROCKET_EMAIL=your_shiprocket_email@example.com
SHIPROCKET_PASSWORD=your_shiprocket_password
SHIPROCKET_BASE_URL=https://apiv2.shiprocket.in/v1/external
```

### 2. Database Schema Updates
Update `prisma/schema.prisma` to add Shiprocket-specific fields:

```prisma
model Order {
  // ... existing fields ...
  trackingNumber    String?
  shiprocketOrderId String?  // Add this
  shiprocketShipmentId String?  // Add this
  courierName       String?  // Add this
  awbCode           String?  // Add this
  // ... rest of model ...
}
```

### 3. Shiprocket API Client
Create `src/lib/shiprocket.js`:

```javascript
class ShiprocketAPI {
    constructor() {
        this.baseURL = process.env.SHIPROCKET_BASE_URL || 'https://apiv2.shiprocket.in/v1/external';
        this.token = null;
        this.tokenExpiry = null;
    }

    async authenticate() {
        // Check if token is still valid
        if (this.token && this.tokenExpiry && Date.now() < this.tokenExpiry) {
            return this.token;
        }

        const response = await fetch(`${this.baseURL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: process.env.SHIPROCKET_EMAIL,
                password: process.env.SHIPROCKET_PASSWORD,
            }),
        });

        if (!response.ok) {
            throw new Error(`Shiprocket auth failed: ${response.statusText}`);
        }

        const data = await response.json();
        this.token = data.token;
        // Token typically valid for 24 hours
        this.tokenExpiry = Date.now() + (24 * 60 * 60 * 1000);
        return this.token;
    }

    async makeRequest(endpoint, options = {}) {
        const token = await this.authenticate();

        const response = await fetch(`${this.baseURL}${endpoint}`, {
            ...options,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Shiprocket API error: ${response.status} ${error}`);
        }

        return response.json();
    }

    async createOrder(orderData) {
        return this.makeRequest('/orders/create/adhoc', {
            method: 'POST',
            body: JSON.stringify(orderData),
        });
    }

    async trackShipment(awbCode) {
        return this.makeRequest(`/courier/track/awb/${awbCode}`);
    }

    async getOrderDetails(orderId) {
        return this.makeRequest(`/orders/show/${orderId}`);
    }

    async generateLabel(shipmentId) {
        return this.makeRequest(`/courier/generate/label`, {
            method: 'POST',
            body: JSON.stringify({ shipment_id: [shipmentId] }),
        });
    }

    async getCouriers() {
        return this.makeRequest('/courier/courierListWithCounts');
    }
}

export default new ShiprocketAPI();
```

### 4. Update Prisma Queries
Update `src/lib/prisma-queries.js` to include Shiprocket fields:

```javascript
// Update createOrder function to include Shiprocket fields
export async function createOrder(userId, orderData) {
    // ... existing code ...
    return await prisma.$transaction(async (tx) => {
        const order = await tx.order.create({
            data: {
                orderNumber,
                totalAmount: orderData.totalAmount,
                shippingAddress: orderData.shippingAddress,
                billingAddress: orderData.billingAddress,
                razorpayOrderId: orderData.razorpayOrderId,
                razorpayPaymentId: orderData.razorpayPaymentId,
                paymentMethod: orderData.paymentMethod,
                // Add Shiprocket fields (initially null)
                shiprocketOrderId: null,
                shiprocketShipmentId: null,
                courierName: null,
                awbCode: null,
                // ... rest of data ...
            },
            // ... rest of function ...
        });
        // ... rest of function ...
    });
}

// Add function to update Shiprocket details
export async function updateOrderShiprocketDetails(orderId, shiprocketData) {
    return await prisma.order.update({
        where: { id: orderId },
        data: {
            shiprocketOrderId: shiprocketData.orderId,
            shiprocketShipmentId: shiprocketData.shipmentId,
            courierName: shiprocketData.courierName,
            awbCode: shiprocketData.awbCode,
            trackingNumber: shiprocketData.awbCode, // Use AWB as tracking number
        },
    });
}

// Update updateOrderStatus to accept tracking number
export async function updateOrderStatus(orderId, status, trackingNumber = null, shiprocketData = null) {
    const updateData = { status };
    if (trackingNumber) updateData.trackingNumber = trackingNumber;
    if (shiprocketData) {
        updateData.shiprocketOrderId = shiprocketData.orderId;
        updateData.shiprocketShipmentId = shiprocketData.shipmentId;
        updateData.courierName = shiprocketData.courierName;
        updateData.awbCode = shiprocketData.awbCode;
    }
    return await prisma.order.update({
        where: { id: orderId },
        data: updateData,
    });
}
```

### 5. Shiprocket Order Actions
Create `src/app/actions/shiprocket.js`:

```javascript
'use server';
import shiprocketAPI from '@/lib/shiprocket';
import { updateOrderShiprocketDetails, getOrderById } from '@/lib/prisma-queries';
import { auth } from '@clerk/nextjs/server';

/**
 * Create a Shiprocket order from our internal order
 */
export async function createShiprocketOrder(orderId) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        // Get order details
        const order = await getOrderById(orderId);
        if (!order) throw new Error("Order not found");

        // Check if already has Shiprocket order
        if (order.shiprocketOrderId) {
            return { success: true, message: "Shiprocket order already exists" };
        }

        // Prepare Shiprocket order data
        const shiprocketOrderData = {
            order_id: order.orderNumber,
            order_date: new Date(order.createdAt).toISOString().split('T')[0],
            pickup_location: "Primary Warehouse", // Configure this based on your warehouse
            billing_customer_name: order.shippingAddress.fullName,
            billing_last_name: "", // Can split name if needed
            billing_address: order.shippingAddress.addressLine1,
            billing_address_2: order.shippingAddress.addressLine2 || "",
            billing_city: order.shippingAddress.city,
            billing_pincode: order.shippingAddress.pincode,
            billing_state: order.shippingAddress.state,
            billing_country: order.shippingAddress.country,
            billing_email: order.shippingAddress.email,
            billing_phone: order.shippingAddress.phone,
            shipping_is_billing: true, // Using same address for shipping
            shipping_customer_name: order.shippingAddress.fullName,
            shipping_last_name: "",
            shipping_address: order.shippingAddress.addressLine1,
            shipping_address_2: order.shippingAddress.addressLine2 || "",
            shipping_city: order.shippingAddress.city,
            shipping_pincode: order.shippingAddress.pincode,
            shipping_state: order.shippingAddress.state,
            shipping_country: order.shippingAddress.country,
            shipping_email: order.shippingAddress.email,
            shipping_phone: order.shippingAddress.phone,
            order_items: order.items.map(item => ({
                name: item.product.name,
                sku: item.product.sku || item.product.id,
                units: item.quantity,
                selling_price: item.price,
                discount: 0,
                tax: 0,
                hsn: "" // Add HSN code if available
            })),
            payment_method: order.paymentMethod === 'razorpay' ? 'Prepaid' : 'COD',
            sub_total: order.totalAmount,
            length: 10, // Package dimensions in cm
            breadth: 10,
            height: 10,
            weight: 0.5 // Package weight in kg
        };

        // Create order in Shiprocket
        const shiprocketResponse = await shiprocketAPI.createOrder(shiprocketOrderData);

        if (shiprocketResponse.status && shiprocketResponse.order_id) {
            // Update our database with Shiprocket details
            await updateOrderShiprocketDetails(orderId, {
                orderId: shiprocketResponse.order_id,
                shipmentId: shiprocketResponse.shipment_id,
                courierName: shiprocketResponse.courier_name || null,
                awbCode: shiprocketResponse.awb_code || null
            });

            return {
                success: true,
                shiprocketOrderId: shiprocketResponse.order_id,
                awbCode: shiprocketResponse.awb_code,
                courierName: shiprocketResponse.courier_name
            };
        } else {
            throw new Error("Failed to create Shiprocket order");
        }

    } catch (error) {
        console.error("Create Shiprocket Order Error:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Track shipment using AWB code
 */
export async function trackShipment(awbCode) {
    try {
        const trackingData = await shiprocketAPI.trackShipment(awbCode);
        return { success: true, tracking: trackingData };
    } catch (error) {
        console.error("Track Shipment Error:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Generate shipping label
 */
export async function generateShippingLabel(shipmentId) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const labelData = await shiprocketAPI.generateLabel(shipmentId);
        return { success: true, label: labelData };
    } catch (error) {
        console.error("Generate Label Error:", error);
        return { success: false, error: error.message };
    }
}
```

### 6. Update Order Actions
Update `src/app/actions/orders.js` to integrate Shiprocket:

```javascript
// ... existing code ...

/**
 * Update order status (Admin only) - Enhanced with Shiprocket integration
 */
export async function updateOrderAdmin(orderId, status, trackingNumber = null) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        // TODO: Add proper admin check here

        // If status is being changed to SHIPPED and no tracking number provided,
        // try to create Shiprocket order if not already done
        if (status === 'SHIPPED' && !trackingNumber) {
            const { createShiprocketOrder } = await import('./shiprocket');
            const shiprocketResult = await createShiprocketOrder(orderId);

            if (shiprocketResult.success && shiprocketResult.awbCode) {
                trackingNumber = shiprocketResult.awbCode;
            }
        }

        await updateOrderStatus(orderId, status, trackingNumber);

        return { success: true };
    } catch (error) {
        console.error("Update Order Error:", error);
        return { success: false, error: error.message };
    }
}

// ... rest of file ...
```

### 7. API Routes for Shiprocket
Create `src/app/api/shiprocket/track/route.js`:

```javascript
import { NextResponse } from 'next/server';
import { trackShipment } from '@/app/actions/shiprocket';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const awbCode = searchParams.get('awb');

        if (!awbCode) {
            return NextResponse.json({ error: "AWB code required" }, { status: 400 });
        }

        const result = await trackShipment(awbCode);

        if (result.success) {
            return NextResponse.json(result.tracking);
        } else {
            return NextResponse.json({ error: result.error }, { status: 500 });
        }
    } catch (error) {
        console.error('[API /api/shiprocket/track] Error:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
```

Create `src/app/api/admin/orders/[id]/shiprocket/route.js`:

```javascript
import { NextResponse } from 'next/server';
import { createShiprocketOrder, generateShippingLabel } from '@/app/actions/shiprocket';

export async function POST(request, { params }) {
    try {
        const orderId = params.id;
        const { action } = await request.json();

        if (action === 'create_order') {
            const result = await createShiprocketOrder(orderId);
            return NextResponse.json(result);
        } else if (action === 'generate_label') {
            const result = await generateShippingLabel(orderId);
            return NextResponse.json(result);
        } else {
            return NextResponse.json({ error: "Invalid action" }, { status: 400 });
        }
    } catch (error) {
        console.error('[API /api/admin/orders/[id]/shiprocket] Error:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
```

### 8. Update Admin Orders Page
Update `src/app/admin/orders/page.js` to include Shiprocket functionality:

```javascript
// ... existing code ...

const handleCreateShiprocketOrder = async (orderId) => {
    try {
        const response = await fetch(`/api/admin/orders/${orderId}/shiprocket`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'create_order' }),
        });
        const result = await response.json();

        if (result.success) {
            alert(`Shiprocket order created! AWB: ${result.awbCode || 'Pending'}`);
            loadOrders();
        } else {
            alert(`Error: ${result.error}`);
        }
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
};

const handleGenerateLabel = async (orderId) => {
    try {
        const response = await fetch(`/api/admin/orders/${orderId}/shiprocket`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'generate_label' }),
        });
        const result = await response.json();

        if (result.success) {
            // Open label in new tab or download
            window.open(result.label.label_url, '_blank');
        } else {
            alert(`Error: ${result.error}`);
        }
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
};

// In the order details modal, add Shiprocket controls
{/* Shiprocket Controls */}
<div className="space-y-4">
    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Shipping</h3>
    <div className="space-y-2">
        {selectedOrder.awbCode && (
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                AWB: <span className="font-bold text-black">{selectedOrder.awbCode}</span>
                {selectedOrder.courierName && ` (${selectedOrder.courierName})`}
            </p>
        )}

        {!selectedOrder.shiprocketOrderId ? (
            <button
                onClick={() => handleCreateShiprocketOrder(selectedOrder.id)}
                className="w-full flex items-center justify-center gap-2 p-3 bg-orange-50 text-orange-700 rounded-xl text-[10px] font-bold uppercase tracking-[0.1em] hover:bg-orange-100 transition-colors"
            >
                <Truck className="w-4 h-4" /> Create Shiprocket Order
            </button>
        ) : (
            <div className="space-y-2">
                <button
                    onClick={() => handleGenerateLabel(selectedOrder.shiprocketShipmentId)}
                    className="w-full flex items-center justify-center gap-2 p-3 bg-blue-50 text-blue-700 rounded-xl text-[10px] font-bold uppercase tracking-[0.1em] hover:bg-blue-100 transition-colors"
                >
                    <Package className="w-4 h-4" /> Generate Label
                </button>
                {selectedOrder.awbCode && (
                    <button
                        onClick={() => window.open(`https://shiprocket.co/tracking/${selectedOrder.awbCode}`, '_blank')}
                        className="w-full flex items-center justify-center gap-2 p-3 bg-green-50 text-green-700 rounded-xl text-[10px] font-bold uppercase tracking-[0.1em] hover:bg-green-100 transition-colors"
                    >
                        <MapPin className="w-4 h-4" /> Track Shipment
                    </button>
                )}
            </div>
        )}
    </div>
</div>
```

### 9. Update User Order Tracking
Update `src/components/UserOrders.jsx` to show tracking information:

```javascript
// ... existing code ...

// In the order display, add tracking info
{order.trackingNumber && (
    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
            <Truck className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Shipping Information</span>
        </div>
        <p className="text-sm text-blue-800">
            Tracking Number: <span className="font-mono">{order.trackingNumber}</span>
        </p>
        {order.courierName && (
            <p className="text-sm text-blue-800">Courier: {order.courierName}</p>
        )}
        {order.awbCode && (
            <button
                onClick={() => window.open(`https://shiprocket.co/tracking/${order.awbCode}`, '_blank')}
                className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
            >
                Track Package →
            </button>
        )}
    </div>
)}
```

### 10. Update Package.json
Add axios for HTTP requests (optional, fetch is used above):

```json
{
  "dependencies": {
    // ... existing dependencies ...
    "axios": "^1.6.0"  // Optional, for more robust HTTP requests
  }
}
```

## Implementation Steps

1. **Database Migration**: Run `npx prisma migrate dev --name add_shiprocket_fields`
2. **Environment Setup**: Add Shiprocket credentials to `.env.local`
3. **Test Integration**: Create a test order and verify Shiprocket order creation
4. **Admin Training**: Train admins on using the new shipping features
5. **Monitoring**: Monitor Shiprocket API usage and error rates

## Testing Checklist

- [ ] Shiprocket authentication works
- [ ] Order creation in Shiprocket succeeds
- [ ] Tracking information updates correctly
- [ ] Admin can generate shipping labels
- [ ] Users can track their orders
- [ ] Error handling for failed API calls
- [ ] Webhook integration for status updates (if needed)

## Additional Considerations

1. **Webhook Integration**: Set up Shiprocket webhooks for automatic status updates
2. **Warehouse Management**: Configure pickup locations in Shiprocket dashboard
3. **Courier Selection**: Implement logic to choose best courier based on destination
4. **International Shipping**: Add support for international orders if needed
5. **Cost Optimization**: Implement courier selection based on rates
6. **Error Handling**: Add retry logic for failed API calls
7. **Rate Limiting**: Implement rate limiting for Shiprocket API calls

## Cost Estimation

- Shiprocket API: Free for basic usage, premium plans start at ₹999/month
- Development time: 2-3 days for basic integration
- Testing: 1-2 days
- Training: 0.5 days

## Support and Documentation

- Shiprocket API Docs: https://apidocs.shiprocket.in/
- Support: Shiprocket dashboard and email support
- Webhooks: Configure in Shiprocket dashboard for real-time updates

This integration will provide seamless shipping management, automatic tracking, and improved customer experience for your B-Tashni e-commerce platform.

Complete Order Flow with Shiprocket Integration
Here's how the entire process works from the user's perspective, with the Shiprocket integration:

Phase 1: Pre-Purchase (User Journey)
User browses products → Adds items to cart
User clicks "Checkout" → Goes to /checkout page
User fills shipping information → Form collects:
Name, email, phone
Shipping address (address, city, state, pincode)
This data gets stored as shippingAddress in the order
Phase 2: Payment Processing
User clicks "Pay Now" → Triggers handlePayment() function

System creates order in database → initiateCheckout() action:

Creates Razorpay order (for payment)
Creates internal order in your database with status PENDING
Stores shipping address from the form
Razorpay payment popup opens → User completes payment

Payment verification → verifyAndCompleteOrder():

Verifies payment signature with Razorpay
Updates order status from PENDING → PROCESSING
Sends confirmation email
User redirected to success page → /order-success

Phase 3: Admin Processing (Current vs With Shiprocket)
Current Flow:

Admin sees order in "PROCESSING" status
Admin manually marks as "SHIPPED"
Admin manually enters tracking number (if any)
Customer has no tracking info
New Flow with Shiprocket:

Admin sees order in "PROCESSING" status
Admin clicks "Create Shiprocket Order" button
System automatically:
Calls Shiprocket API with order details
Creates shipment in Shiprocket
Gets AWB number and courier assignment
Updates database with tracking info
Changes status to "SHIPPED"
Admin can generate shipping labels
Customer gets automatic tracking updates
Phase 4: Shipping & Tracking
Shiprocket processes shipment:

Assigns courier (e.g., Delhivery, BlueDart, etc.)
Generates AWB (tracking number)
Schedules pickup from your warehouse
Provides tracking updates
Customer tracking:

Customer sees tracking info in their order history
Can click "Track Package" button
Links to Shiprocket tracking page
Real-time status updates (Picked up → In Transit → Out for Delivery → Delivered)
Key Integration Points:
When Admin Marks Order as "SHIPPED":

Shiprocket Order Creation Data:

Customer shipping address (from checkout form)
Order items with quantities
Payment method (Prepaid/COD)
Package dimensions (configurable)
Pickup location (your warehouse)
Database Updates:

Customer Experience:
Order Confirmation Email → Contains order details
Order History Page → Shows tracking section when shipped:
Real-time Updates → Status changes automatically via Shiprocket webhooks (optional enhancement)
Admin Workflow:
Order comes in → Status: PROCESSING
Prepare package in warehouse
Click "Create Shiprocket Order" → Automatic pickup scheduled
Generate and print shipping label
Package gets picked up by courier
Customer can track in real-time
Error Handling:
If Shiprocket API fails → Admin gets error message, can retry
If payment fails → Order cancelled, stock restored
If shipping address invalid → Shiprocket returns error, admin can fix
This integration makes shipping management seamless - from manual tracking entry to automated courier assignment and real-time customer tracking! 🚚✨

Raptor mini (Preview) • 1x