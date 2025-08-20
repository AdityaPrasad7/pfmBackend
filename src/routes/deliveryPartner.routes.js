import { Router } from "express";
import { verifyJWT, verifyRole } from "../middlewares/auth.middleware.js";
import { validateRequest } from "../middlewares/validation.middleware.js";
import { deliveryPartnerSendOtp, deliveryPartnerVerifyLogin, deliveryPartnerRefreshToken } from "../controllers/auth.controller.js";
import {
    getDeliveryPartnerProfile,
    updateDeliveryPartnerProfile,
    getDocumentStatus,
    uploadDocument,
    getDeliveryStatistics,
    updateLastActive,
    getAssignedOrders,
    toggleOnlineStatus,
    getOnlineStatus,
    getDashboardData,
    assignAvailableOrders,
    respondToOrder
} from "../controllers/deliveryPartner/deliveryPartner.controller.js";
import {
    updateProfileValidation,
    documentUploadValidation,
    toggleOnlineStatusValidation,
    updateOnlineStatusValidation,
    respondToOrderValidation
} from "../validations/deliveryPartner.validation.js";

const router = Router()

// Delivery Partner authentication routes (OTP-based)
router.post("/send-otp", deliveryPartnerSendOtp);
router.post("/verify-login", deliveryPartnerVerifyLogin);

// Delivery Partner refresh token route
router.post("/refresh-token", deliveryPartnerRefreshToken);

// Protected routes (require authentication)
router.use(verifyJWT, verifyRole("deliveryPartner"));

// Profile management
router.get("/profile", getDeliveryPartnerProfile);
router.put("/profile", validateRequest(updateProfileValidation, 'body'), updateDeliveryPartnerProfile);

// Document verification
router.get("/documents/status", getDocumentStatus);
router.post("/documents/upload", validateRequest(documentUploadValidation, 'body'), uploadDocument);

// Delivery operations and online status
router.get("/statistics", getDeliveryStatistics);
router.put("/last-active", validateRequest(updateOnlineStatusValidation, 'body'), updateLastActive);
router.get("/orders", getAssignedOrders);

// Online status management
router.post("/toggle-status", validateRequest(toggleOnlineStatusValidation, 'body'), toggleOnlineStatus);
router.get("/online-status", getOnlineStatus);
router.get("/dashboard", getDashboardData);

// Order assignment and management
router.post("/assign-orders", assignAvailableOrders);
router.post("/respond-to-order", validateRequest(respondToOrderValidation, 'body'), respondToOrder);

export default router