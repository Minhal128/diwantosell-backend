import express from 'express';
import {
    registerUser,
    authUser,
    updateUserProfile,
    getUserProfile,
    clerkAuth,
    verifyOTP,
    resendOTP,
    forgotPassword,
    verifyResetOTP,
    resetPassword,
    submitKYC,
    getKYCStatus,
    getUserNotifications,
    markNotificationRead,
    getUnreadNotificationCount,
    changePassword,
    changeEmail,
    deleteAccount,
} from '../controllers/userController';
import { protectUser } from '../middleware/userAuthMiddleware';
// import passport from 'passport'; // Google OAuth disabled
// import generateToken from '../utils/generateToken'; // Google OAuth disabled

const router = express.Router();

// Auth
router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/clerk-auth', clerkAuth);

// OTP Verification
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);

// Password Reset
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-otp', verifyResetOTP);
router.post('/reset-password', resetPassword);

// Profile
router.route('/profile')
    .get(protectUser, getUserProfile)
    .put(protectUser, updateUserProfile);

// Security
router.put('/change-password', protectUser, changePassword);
router.put('/change-email', protectUser, changeEmail);
router.delete('/account', protectUser, deleteAccount);

// KYC
router.post('/kyc', protectUser, submitKYC);
router.get('/kyc-status', protectUser, getKYCStatus);

// Notifications
router.get('/notifications/unread-count', protectUser, getUnreadNotificationCount);
router.get('/notifications', protectUser, getUserNotifications);
router.put('/notifications/:id/read', protectUser, markNotificationRead);

// Google OAuth disabled
/*
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login', session: false }),
    async (req: any, res) => {
        try {
            req.user.lastLogin = new Date();
            await req.user.save();
        } catch (_) { non-critical, continue }
        const token = generateToken(req.user._id.toString());
        const needsProfileCompletion = !req.user.phone || !req.user.country;
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        res.redirect(`${frontendUrl}/login-success?token=${token}&userData=${encodeURIComponent(JSON.stringify({
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            phone: req.user.phone,
            country: req.user.country,
            kycStatus: req.user.kycStatus,
            isEmailVerified: true,
            isProfileComplete: !needsProfileCompletion,
            needsProfileCompletion,
        }))}`);
    }
);
*/

export default router;
