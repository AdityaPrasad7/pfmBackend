import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import DeliveryPartner from "../../models/deliveryPartner/deliveryPartner.model.js";
import Order from "../../models/catalog/order.model.js";

// Get delivery partner profile
export const getDeliveryPartnerProfile = asyncHandler(async (req, res) => {
    const deliveryPartnerId = req.user.userId;

    const deliveryPartner = await DeliveryPartner.findById(deliveryPartnerId)
        .select('-__v')
        .populate('assignedOrders', 'orderId status totalAmount');

    if (!deliveryPartner) {
        return res.status(404).json(
            new ApiResponse(404, null, "Delivery partner not found")
        );
    }

    return res.status(200).json(
        new ApiResponse(200, deliveryPartner, "Profile retrieved successfully")
    );
});

// Update delivery partner profile
export const updateDeliveryPartnerProfile = asyncHandler(async (req, res) => {
    const deliveryPartnerId = req.user.userId;
    const { name, phone } = req.body;

    // Validate input
    if (!name && !phone) {
        return res.status(400).json(
            new ApiResponse(400, null, "At least one field is required to update")
        );
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;

    // Check if phone is already taken by another delivery partner
    if (phone) {
        const existingPartner = await DeliveryPartner.findOne({ 
            phone, 
            _id: { $ne: deliveryPartnerId } 
        });
        if (existingPartner) {
            return res.status(400).json(
                new ApiResponse(400, null, "Phone number is already registered")
            );
        }
    }

    const updatedPartner = await DeliveryPartner.findByIdAndUpdate(
        deliveryPartnerId,
        updateData,
        { new: true, runValidators: true }
    ).select('-__v');

    return res.status(200).json(
        new ApiResponse(200, updatedPartner, "Profile updated successfully")
    );
});

// Get document verification status
export const getDocumentStatus = asyncHandler(async (req, res) => {
    const deliveryPartnerId = req.user.userId;

    const deliveryPartner = await DeliveryPartner.findById(deliveryPartnerId)
        .select('documentStatus overallDocumentStatus verificationNotes status');

    if (!deliveryPartner) {
        return res.status(404).json(
            new ApiResponse(404, null, "Delivery partner not found")
        );
    }

    return res.status(200).json(
        new ApiResponse(200, {
            documentStatus: deliveryPartner.documentStatus,
            overallDocumentStatus: deliveryPartner.overallDocumentStatus,
            verificationNotes: deliveryPartner.verificationNotes,
            status: deliveryPartner.status
        }, "Document status retrieved successfully")
    );
});

// Upload document for verification (placeholder - you'll need to implement file upload)
export const uploadDocument = asyncHandler(async (req, res) => {
    const deliveryPartnerId = req.user.userId;
    const { documentType, documentUrl } = req.body;

    if (!documentType || !documentUrl) {
        return res.status(400).json(
            new ApiResponse(400, null, "Document type and URL are required")
        );
    }

    const validDocumentTypes = ['idProof', 'addressProof', 'vehicleDocuments', 'drivingLicense', 'insuranceDocuments'];
    
    if (!validDocumentTypes.includes(documentType)) {
        return res.status(400).json(
            new ApiResponse(400, null, "Invalid document type")
        );
    }

    // Here you would typically:
    // 1. Save the document file to cloud storage
    // 2. Update the document status to 'pending'
    // 3. Store the document URL

    return res.status(200).json(
        new ApiResponse(200, null, "Document uploaded successfully and pending verification")
    );
});

// Get delivery statistics
export const getDeliveryStatistics = asyncHandler(async (req, res) => {
    const deliveryPartnerId = req.user.userId;

    const deliveryPartner = await DeliveryPartner.findById(deliveryPartnerId)
        .select('totalDeliveries totalAccepted totalRejected rating lastActive');

    if (!deliveryPartner) {
        return res.status(404).json(
            new ApiResponse(404, null, "Delivery partner not found")
        );
    }

    return res.status(200).json(
        new ApiResponse(200, deliveryPartner, "Statistics retrieved successfully")
    );
});

// Update last active status and online/offline status
export const updateLastActive = asyncHandler(async (req, res) => {
    const deliveryPartnerId = req.user.userId;
    const { isOnline, onlineStatus } = req.body;

    const updateData = {
        lastActive: new Date()
    };

    // Update online status if provided
    if (typeof isOnline === 'boolean') {
        updateData.isOnline = isOnline;
        if (isOnline) {
            updateData.onlineStatus = 'online';
            updateData.lastOnlineAt = new Date();
            updateData.lastOfflineAt = null;
        } else {
            updateData.onlineStatus = 'offline';
            updateData.lastOfflineAt = new Date();
            updateData.lastOnlineAt = null;
        }
    }

    // Update online status if provided separately
    if (onlineStatus && ['online', 'offline', 'busy'].includes(onlineStatus)) {
        updateData.onlineStatus = onlineStatus;
        if (onlineStatus === 'online') {
            updateData.isOnline = true;
            updateData.lastOnlineAt = new Date();
        } else if (onlineStatus === 'offline') {
            updateData.isOnline = false;
            updateData.lastOfflineAt = new Date();
        }
    }

    const updatedPartner = await DeliveryPartner.findByIdAndUpdate(
        deliveryPartnerId,
        updateData,
        { new: true }
    ).select('isOnline onlineStatus lastOnlineAt lastOfflineAt lastActive');

    return res.status(200).json(
        new ApiResponse(200, updatedPartner, "Status updated successfully")
    );
});

// Toggle online/offline status
export const toggleOnlineStatus = asyncHandler(async (req, res) => {
    const deliveryPartnerId = req.user.userId;
    const { action } = req.body; // 'go_online' or 'go_offline'

    if (!['go_online', 'go_offline'].includes(action)) {
        return res.status(400).json(
            new ApiResponse(400, null, "Invalid action. Use 'go_online' or 'go_offline'")
        );
    }

    const isOnline = action === 'go_online';
    const onlineStatus = isOnline ? 'online' : 'offline';

    const updateData = {
        isOnline,
        onlineStatus,
        lastActive: new Date()
    };

    if (isOnline) {
        updateData.lastOnlineAt = new Date();
        updateData.lastOfflineAt = null;
    } else {
        updateData.lastOfflineAt = new Date();
        updateData.lastOnlineAt = null;
        // Clear current order when going offline
        updateData.currentOrder = null;
    }

    const updatedPartner = await DeliveryPartner.findByIdAndUpdate(
        deliveryPartnerId,
        updateData,
        { new: true }
    ).select('isOnline onlineStatus lastOnlineAt lastOfflineAt lastActive currentOrder');

    return res.status(200).json(
        new ApiResponse(200, updatedPartner, `Successfully went ${onlineStatus}`)
    );
});

// Get current online status and dashboard data
export const getOnlineStatus = asyncHandler(async (req, res) => {
    const deliveryPartnerId = req.user.userId;

    const deliveryPartner = await DeliveryPartner.findById(deliveryPartnerId)
        .select('isOnline onlineStatus lastOnlineAt lastOfflineAt lastActive currentOrder')
        .populate('currentOrder', 'orderId status totalAmount customerAddress deliveryAddress createdAt');

    if (!deliveryPartner) {
        return res.status(404).json(
            new ApiResponse(404, null, "Delivery partner not found")
        );
    }

    return res.status(200).json(
        new ApiResponse(200, deliveryPartner, "Online status retrieved successfully")
    );
});

// Get dashboard data (orders count, current order, online status)
export const getDashboardData = asyncHandler(async (req, res) => {
    const deliveryPartnerId = req.user.userId;

    const deliveryPartner = await DeliveryPartner.findById(deliveryPartnerId)
        .select('isOnline onlineStatus totalDeliveries totalAccepted totalRejected rating currentOrder')
        .populate('currentOrder', 'orderId status totalAmount customerAddress deliveryAddress createdAt orderDetails');

    if (!deliveryPartner) {
        return res.status(404).json(
            new ApiResponse(404, null, "Delivery partner not found")
        );
    }

    // Calculate today's orders count
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayOrders = await Order.countDocuments({
        deliveryPartner: deliveryPartnerId,
        createdAt: { $gte: today }
    });

    const dashboardData = {
        isOnline: deliveryPartner.isOnline,
        onlineStatus: deliveryPartner.onlineStatus,
        currentOrder: deliveryPartner.currentOrder,
        statistics: {
            totalDeliveries: deliveryPartner.totalDeliveries,
            totalAccepted: deliveryPartner.totalAccepted,
            totalRejected: deliveryPartner.totalRejected,
            rating: deliveryPartner.rating,
            todayOrders
        }
    };

    return res.status(200).json(
        new ApiResponse(200, dashboardData, "Dashboard data retrieved successfully")
    );
});

// Assign available orders when delivery partner goes online
export const assignAvailableOrders = asyncHandler(async (req, res) => {
    const deliveryPartnerId = req.user.userId;

    // Check if delivery partner is online
    const deliveryPartner = await DeliveryPartner.findById(deliveryPartnerId);
    if (!deliveryPartner || !deliveryPartner.isOnline) {
        return res.status(400).json(
            new ApiResponse(400, null, "Delivery partner must be online to receive orders")
        );
    }

    // Find available orders that need delivery
    const availableOrders = await Order.find({
        status: 'ready',
        deliveryPartner: { $exists: false },
        isUrgent: { $ne: true } // Don't auto-assign urgent orders
    }).limit(5); // Limit to 5 orders at a time

    if (availableOrders.length === 0) {
        return res.status(200).json(
            new ApiResponse(200, { assignedOrders: [] }, "No available orders at the moment")
        );
    }

    // Assign orders to this delivery partner
    const orderIds = availableOrders.map(order => order._id);
    
    await Order.updateMany(
        { _id: { $in: orderIds } },
        { 
            deliveryPartner: deliveryPartnerId,
            status: 'assigned',
            assignedAt: new Date()
        }
    );

    // Update delivery partner's assigned orders
    await DeliveryPartner.findByIdAndUpdate(
        deliveryPartnerId,
        { 
            $push: { assignedOrders: { $each: orderIds } },
            currentOrder: orderIds[0] // Set first order as current
        }
    );

    // Get updated assigned orders with details
    const assignedOrders = await Order.find({
        _id: { $in: orderIds }
    }).select('orderId status totalAmount customerAddress deliveryAddress createdAt orderDetails');

    return res.status(200).json(
        new ApiResponse(200, { 
            assignedOrders,
            message: `Successfully assigned ${assignedOrders.length} orders`
        }, "Orders assigned successfully")
    );
});

// Accept or reject an assigned order
export const respondToOrder = asyncHandler(async (req, res) => {
    const deliveryPartnerId = req.user.userId;
    const { orderId, action } = req.body; // action: 'accept' or 'reject'

    if (!['accept', 'reject'].includes(action)) {
        return res.status(400).json(
            new ApiResponse(400, null, "Invalid action. Use 'accept' or 'reject'")
        );
    }

    // Check if order is assigned to this delivery partner
    const order = await Order.findOne({
        _id: orderId,
        deliveryPartner: deliveryPartnerId
    });

    if (!order) {
        return res.status(404).json(
            new ApiResponse(404, null, "Order not found or not assigned to you")
        );
    }

    if (action === 'accept') {
        // Accept the order
        await Order.findByIdAndUpdate(orderId, {
            status: 'accepted',
            acceptedAt: new Date()
        });

        // Update delivery partner stats
        await DeliveryPartner.findByIdAndUpdate(deliveryPartnerId, {
            $inc: { totalAccepted: 1 },
            currentOrder: orderId
        });

        return res.status(200).json(
            new ApiResponse(200, null, "Order accepted successfully")
        );
    } else {
        // Reject the order
        await Order.findByIdAndUpdate(orderId, {
            deliveryPartner: null,
            status: 'ready',
            assignedAt: null
        });

        // Remove from delivery partner's assigned orders
        await DeliveryPartner.findByIdAndUpdate(deliveryPartnerId, {
            $pull: { assignedOrders: orderId },
            $inc: { totalRejected: 1 }
        });

        return res.status(200).json(
            new ApiResponse(200, null, "Order rejected successfully")
        );
    }
});

// Get assigned orders
export const getAssignedOrders = asyncHandler(async (req, res) => {
    const deliveryPartnerId = req.user.userId;

    const deliveryPartner = await DeliveryPartner.findById(deliveryPartnerId)
        .populate('assignedOrders', 'orderId status totalAmount customerAddress deliveryAddress createdAt');

    if (!deliveryPartner) {
        return res.status(404).json(
            new ApiResponse(404, null, "Delivery partner not found")
        );
    }

    return res.status(200).json(
        new ApiResponse(200, deliveryPartner.assignedOrders, "Assigned orders retrieved successfully")
    );
});

