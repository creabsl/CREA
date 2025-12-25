const Donation = require('../models/donationModel');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Initialize Razorpay instance
let razorpay = null;
console.log('[Donation Controller] RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID ? 'present' : 'MISSING');
console.log('[Donation Controller] RAZORPAY_KEY_SECRET:', process.env.RAZORPAY_KEY_SECRET ? 'present' : 'MISSING');

if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
  console.log('[Donation Controller] Razorpay initialized successfully');
} else {
  console.log('[Donation Controller] WARNING: Razorpay NOT initialized - missing credentials');
}

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your-app-password'
  }
});

/**
 * Generate PDF Receipt
 */
const generateDonationReceipt = async (donation, razorpayPaymentId) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const receiptsDir = path.join(__dirname, '../uploads/receipts');
      
      // Create receipts directory if it doesn't exist
      if (!fs.existsSync(receiptsDir)) {
        fs.mkdirSync(receiptsDir, { recursive: true });
      }
      
      const fileName = `donation-receipt-${donation._id}.pdf`;
      const filePath = path.join(receiptsDir, fileName);
      const stream = fs.createWriteStream(filePath);
      
      doc.pipe(stream);
      
      // Header
      doc.fontSize(20).font('Helvetica-Bold').text('DONATION RECEIPT', 100, 50);
      doc.moveTo(50, 80).lineTo(550, 80).stroke();
      
      // Receipt Details
      doc.fontSize(11).font('Helvetica').text(`Receipt No: ${donation._id}`, 50, 100);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 50, 120);
      doc.text(`Payment ID: ${razorpayPaymentId}`, 50, 140);
      
      // Donor Information
      doc.fontSize(12).font('Helvetica-Bold').text('Donor Information', 50, 170);
      doc.fontSize(11).font('Helvetica');
      doc.text(`Name: ${donation.fullName}`, 50, 190);
      doc.text(`Email: ${donation.email}`, 50, 210);
      doc.text(`Mobile: ${donation.mobile}`, 50, 230);
      
      if (donation.address) {
        doc.text(`Address: ${donation.address}, ${donation.city}, ${donation.state} ${donation.pincode}`, 50, 250);
      }
      
      // Donation Details
      doc.fontSize(12).font('Helvetica-Bold').text('Donation Details', 50, 290);
      doc.fontSize(11).font('Helvetica');
      doc.text(`Amount: ₹${donation.amount}`, 50, 310);
      doc.text(`Purpose: ${donation.purpose || 'General'}`, 50, 330);
      
      if (donation.message) {
        doc.text(`Message: ${donation.message}`, 50, 350);
      }
      
      if (donation.isEmployee) {
        doc.text(`Employee ID: ${donation.employeeId}`, 50, 370);
        doc.text(`Designation: ${donation.designation}`, 50, 390);
        doc.text(`Division: ${donation.division}`, 50, 410);
      }
      
      // Payment Information
      doc.fontSize(12).font('Helvetica-Bold').text('Payment Information', 50, 450);
      doc.fontSize(11).font('Helvetica');
      doc.text(`Payment Gateway: Razorpay`, 50, 470);
      doc.text(`Status: ${donation.paymentStatus.toUpperCase()}`, 50, 490);
      doc.text(`Payment Date: ${new Date(donation.paymentDate).toLocaleString()}`, 50, 510);
      
      // Footer
      doc.moveTo(50, 550).lineTo(550, 550).stroke();
      doc.fontSize(10).text('This is an officially generated receipt powered by Razorpay.', 50, 560, { align: 'center' });
      doc.text('Thank you for your generous donation!', 50, 575, { align: 'center' });
      
      doc.end();
      
      stream.on('finish', () => {
        resolve(filePath);
      });
      
      stream.on('error', (err) => {
        reject(err);
      });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Send Receipt Email
 */
const sendReceiptEmail = async (donation, receiptPath, razorpayPaymentId) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@crea.org',
      to: donation.email,
      subject: `Donation Receipt - ₹${donation.amount} | Payment ID: ${razorpayPaymentId}`,
      html: `
        <h2>Thank you for your donation!</h2>
        <p>Dear ${donation.fullName},</p>
        <p>Your donation of <strong>₹${donation.amount}</strong> has been received successfully.</p>
        <p><strong>Donation Details:</strong></p>
        <ul>
          <li>Receipt Number: ${donation._id}</li>
          <li>Payment ID: ${razorpayPaymentId}</li>
          <li>Amount: ₹${donation.amount}</li>
          <li>Purpose: ${donation.purpose || 'General'}</li>
          <li>Date: ${new Date(donation.paymentDate).toLocaleString()}</li>
        </ul>
        <p>Your official receipt is attached to this email.</p>
        <p>With gratitude,<br/>CREA Team</p>
      `,
      attachments: [
        {
          filename: `donation-receipt-${donation._id}.pdf`,
          path: receiptPath
        }
      ]
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`Receipt email sent to ${donation.email}`);
  } catch (error) {
    console.error('Error sending receipt email:', error);
    // Don't throw error - receipt generation shouldn't fail email delivery
  }
};

/**
 * Create Razorpay Order for Donation
 * Step 1: Create donation record in DB with status 'pending'
 * Step 2: Generate Razorpay Order
 */
exports.createOrder = async (req, res) => {
  try {
    // Check if Razorpay is initialized
    if (!razorpay) {
      console.error('Razorpay not initialized. KEY_ID:', process.env.RAZORPAY_KEY_ID ? 'present' : 'missing', 'KEY_SECRET:', process.env.RAZORPAY_KEY_SECRET ? 'present' : 'missing');
      return res.status(500).json({ 
        success: false, 
        message: 'Razorpay is not configured. Please check your environment variables.' 
      });
    }

    const { fullName, email, mobile, amount, purpose, isEmployee, employeeId, designation, division, department, isAnonymous, address, city, state, pincode, message, paymentMethod, upiId } = req.body;

    console.log('Received donation request:', { fullName, email, mobile, amount, purpose });

    if (!fullName || !email || !mobile || !amount || amount <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing or invalid required fields' 
      });
    }

    // Create donation record with pending status
    const donation = new Donation({
      fullName,
      email,
      mobile,
      amount: Math.round(amount * 100) / 100, // Ensure valid amount
      purpose: (purpose || 'general').toLowerCase(),
      isEmployee: isEmployee || false,
      employeeId,
      designation,
      division,
      department,
      isAnonymous,
      address,
      city,
      state,
      pincode,
      message,
      paymentMethod: paymentMethod || 'card',
      upiId: upiId || null,
      paymentStatus: 'pending'
    });

    console.log('Saving donation:', donation);
    await donation.save();
    console.log('Donation saved successfully with ID:', donation._id);

    // Create Razorpay Order (amount in paise)
    const options = {
      amount: Math.round(donation.amount * 100), // Convert to paise
      currency: 'INR',
      receipt: `donation_${donation._id.toString()}`,
      notes: {
        donationId: donation._id.toString(),
        purpose: donation.purpose
      }
    };

    console.log('Creating Razorpay order with options:', options);
    const order = await razorpay.orders.create(options);
    console.log('Razorpay order created:', order.id);

    // Save Razorpay order ID to donation
    donation.razorpayOrderId = order.id;
    await donation.save();
    console.log('Donation updated with Razorpay order ID');

    res.status(201).json({
      success: true,
      orderId: order.id,
      keyId: process.env.RAZORPAY_KEY_ID,
      donationDbId: donation._id,
      amount: donation.amount
    });
  } catch (error) {
    console.error('Error creating donation order:');
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    console.error('Full error:', JSON.stringify(error, null, 2));
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create order',
      error: error.message,
      stack: error.stack
    });
  }
};

/**
 * Verify Razorpay Payment Signature
 * Step 3: Verify signature using HMAC SHA256
 * Step 4: Update donation status to 'completed'
 * Step 5: Generate and send receipt
 */
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing payment verification details' 
      });
    }

    // Generate expected signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    // Verify signature matches
    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ 
        success: false, 
        message: 'Payment verification failed - Invalid signature' 
      });
    }

    // Find and update donation
    const donation = await Donation.findOne({ razorpayOrderId: razorpay_order_id });

    if (!donation) {
      return res.status(404).json({ 
        success: false, 
        message: 'Donation record not found' 
      });
    }

    // Fetch payment details from Razorpay to get payment method
    let paymentMethod = 'card';
    let upiId = null;
    try {
      if (razorpay) {
        const paymentDetails = await razorpay.payments.fetch(razorpay_payment_id);
        paymentMethod = paymentDetails.method || 'card'; // upi, card, netbanking, wallet
        if (paymentDetails.vpa) {
          upiId = paymentDetails.vpa; // VPA for UPI payments
        }
      }
    } catch (fetchError) {
      console.error('Error fetching payment details:', fetchError);
      // Continue with default payment method
    }

    // Update donation with payment details
    donation.razorpayPaymentId = razorpay_payment_id;
    donation.razorpaySignature = razorpay_signature;
    donation.paymentStatus = 'completed';
    donation.paymentDate = new Date();
    donation.paymentReference = razorpay_payment_id;
    donation.paymentMethod = paymentMethod;
    donation.upiId = upiId;

    await donation.save();

    // Generate receipt PDF asynchronously (don't block response)
    try {
      const receiptPath = await generateDonationReceipt(donation, razorpay_payment_id);
      await sendReceiptEmail(donation, receiptPath, razorpay_payment_id);
    } catch (receiptError) {
      console.error('Receipt generation error (non-blocking):', receiptError);
      // Continue - don't fail payment verification
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      donationId: donation._id,
      paymentStatus: donation.paymentStatus,
      receiptSent: true
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Payment verification failed',
      error: error.message 
    });
  }
};

// Get all donations (admin only)
exports.getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.status(200).json({ 
      success: true, 
      data: donations 
    });
  } catch (error) {
    console.error('Error fetching donations:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch donations',
      error: error.message 
    });
  }
};

// Get donation by ID (admin only)
exports.getDonationById = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ 
        success: false, 
        message: 'Donation not found' 
      });
    }
    res.status(200).json({ 
      success: true, 
      data: donation 
    });
  } catch (error) {
    console.error('Error fetching donation:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch donation',
      error: error.message 
    });
  }
};

// Update donation (admin only - for payment status updates)
exports.updateDonation = async (req, res) => {
  try {
    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!donation) {
      return res.status(404).json({ 
        success: false, 
        message: 'Donation not found' 
      });
    }
    res.status(200).json({ 
      success: true, 
      message: 'Donation updated successfully',
      data: donation 
    });
  } catch (error) {
    console.error('Error updating donation:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update donation',
      error: error.message 
    });
  }
};

// Delete donation (admin only)
exports.deleteDonation = async (req, res) => {
  try {
    const donation = await Donation.findByIdAndDelete(req.params.id);
    if (!donation) {
      return res.status(404).json({ 
        success: false, 
        message: 'Donation not found' 
      });
    }
    res.status(200).json({ 
      success: true, 
      message: 'Donation deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting donation:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete donation',
      error: error.message 
    });
  }
};
