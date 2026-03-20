/**
 * Email Notification Service
 *
 * Uses Nodemailer with Ethereal (dev) or SMTP (production) to send
 * reservation-related email notifications to users who have enabled them.
 */

const nodemailer = require('nodemailer');

let transporter = null;

/**
 * Initialize the email transporter.
 * Uses env vars if set, otherwise creates an Ethereal test account.
 */
async function initTransporter() {
    if (transporter) return transporter;

    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        // Production SMTP
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    } else {
        // Dev: Ethereal test account — emails are caught and viewable at ethereal.email
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass
            }
        });
        console.log('[Email] Using Ethereal test account:', testAccount.user);
    }

    return transporter;
}

/**
 * Format a timeSlots array into a readable string.
 */
function formatSlots(timeSlots) {
    if (!timeSlots || timeSlots.length === 0) return '-';
    if (timeSlots.length === 1) return timeSlots[0];
    const first = timeSlots[0].split(' - ')[0];
    const last = timeSlots[timeSlots.length - 1].split(' - ')[1];
    return first + ' – ' + last + ' (' + timeSlots.length + ' slots)';
}

/**
 * Format a Date object to a readable string.
 */
function formatDate(date) {
    const months = ['January','February','March','April','May','June',
                    'July','August','September','October','November','December'];
    const d = new Date(date);
    return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
}

/**
 * Send an email. Logs the preview URL in dev (Ethereal).
 */
async function sendMail(to, subject, html) {
    try {
        const t = await initTransporter();
        const from = process.env.SMTP_FROM || '"OpenLab Reservations" <noreply@openlab.dlsu.edu.ph>';

        const info = await t.sendMail({ from, to, subject, html });

        // In dev, log the Ethereal preview URL so you can view the email
        const previewUrl = nodemailer.getTestMessageUrl(info);
        if (previewUrl) {
            console.log('[Email] Preview:', previewUrl);
        }

        return info;
    } catch (err) {
        console.error('[Email] Failed to send:', err.message);
    }
}

// ─── Notification functions ───────────────────────────────────────────────

/**
 * Reservation confirmed notification.
 */
async function notifyReservationCreated(user, reservation) {
    if (!user.notifications) return;

    const subject = 'Reservation Confirmed – ' + reservation.lab + ' Seat ' + reservation.seat;
    const html = `
        <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;">
            <h2 style="color:#04AA6D;">Reservation Confirmed</h2>
            <p>Hi ${user.firstName},</p>
            <p>Your reservation has been confirmed:</p>
            <table style="border-collapse:collapse;width:100%;margin:16px 0;">
                <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666;">Lab</td><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">${reservation.lab}</td></tr>
                <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666;">Building</td><td style="padding:8px;border-bottom:1px solid #eee;">${reservation.building}</td></tr>
                <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666;">Seat</td><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">${reservation.seat}</td></tr>
                <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666;">Date</td><td style="padding:8px;border-bottom:1px solid #eee;">${formatDate(reservation.date)}</td></tr>
                <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666;">Time</td><td style="padding:8px;border-bottom:1px solid #eee;">${formatSlots(reservation.timeSlots)}</td></tr>
            </table>
            <p style="color:#666;font-size:13px;">Remember to arrive within 10 minutes of your reservation time.</p>
            <p style="color:#999;font-size:12px;">– OpenLab Reservation System</p>
        </div>`;

    await sendMail(user.email, subject, html);
}

/**
 * Reservation updated notification.
 */
async function notifyReservationUpdated(user, reservation) {
    if (!user.notifications) return;

    const subject = 'Reservation Updated – ' + reservation.lab + ' Seat ' + reservation.seat;
    const html = `
        <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;">
            <h2 style="color:#2196F3;">Reservation Updated</h2>
            <p>Hi ${user.firstName},</p>
            <p>Your reservation has been updated:</p>
            <table style="border-collapse:collapse;width:100%;margin:16px 0;">
                <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666;">Lab</td><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">${reservation.lab}</td></tr>
                <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666;">Seat</td><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">${reservation.seat}</td></tr>
                <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666;">Date</td><td style="padding:8px;border-bottom:1px solid #eee;">${formatDate(reservation.date)}</td></tr>
                <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666;">Time</td><td style="padding:8px;border-bottom:1px solid #eee;">${formatSlots(reservation.timeSlots)}</td></tr>
            </table>
            <p style="color:#999;font-size:12px;">– OpenLab Reservation System</p>
        </div>`;

    await sendMail(user.email, subject, html);
}

/**
 * Reservation cancelled notification.
 */
async function notifyReservationCancelled(user, reservation) {
    if (!user.notifications) return;

    const subject = 'Reservation Cancelled – ' + reservation.lab + ' Seat ' + reservation.seat;
    const html = `
        <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;">
            <h2 style="color:#ff6b6b;">Reservation Cancelled</h2>
            <p>Hi ${user.firstName},</p>
            <p>Your reservation has been cancelled:</p>
            <table style="border-collapse:collapse;width:100%;margin:16px 0;">
                <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666;">Lab</td><td style="padding:8px;border-bottom:1px solid #eee;">${reservation.lab}</td></tr>
                <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666;">Seat</td><td style="padding:8px;border-bottom:1px solid #eee;">${reservation.seat}</td></tr>
                <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666;">Date</td><td style="padding:8px;border-bottom:1px solid #eee;">${formatDate(reservation.date)}</td></tr>
                <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666;">Time</td><td style="padding:8px;border-bottom:1px solid #eee;">${formatSlots(reservation.timeSlots)}</td></tr>
            </table>
            <p style="color:#666;font-size:13px;">The seat is now available for other students.</p>
            <p style="color:#999;font-size:12px;">– OpenLab Reservation System</p>
        </div>`;

    await sendMail(user.email, subject, html);
}

module.exports = {
    notifyReservationCreated,
    notifyReservationUpdated,
    notifyReservationCancelled
};
