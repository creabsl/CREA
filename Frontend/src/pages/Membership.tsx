import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Input from "../components/Input";
import Button from "../components/Button";
import { getMembershipPricing, createMembershipOrder, verifyMembershipPayment } from "../services/api";
import { usePageTitle } from "../hooks/usePageTitle";
import type { MembershipFormData } from "../services/api";
import FileUploader from "../components/FileUploader";
import { STATES, getCitiesForState } from "../data/statesAndCities";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void;
      close: () => void;
    };
  }
}

type Form = MembershipFormData;

export default function Membership() {
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [membershipId, setMembershipId] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isStep2Valid, setIsStep2Valid] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [membershipFees, setMembershipFees] = useState({
    ordinary: 500,
    lifetime: 10000,
  });
  const [form, setForm] = useState<Form>({
    name: "",
    designation: "",
    division: "Bhusawal",
    department: "",
    place: "",
    unit: "",
    mobile: "",
    email: "",
    type: "ordinary",
    paymentMethod: "upi",
    paymentStatus: "pending",
    paymentAmount: 500,
    status: "pending",
    personalDetails: {},
    professionalDetails: {},
    documents: [],
  });

  usePageTitle("CREA • Choose Your Membership Plan");

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const pricing = await getMembershipPricing();
        setMembershipFees(pricing);
      } catch (error) {
        console.error("Failed to fetch membership pricing:", error);
      }
    };
    fetchPricing();
  }, []);

  const startApplication = (type: "ordinary" | "lifetime") => {
    setForm((f) => ({
      ...f,
      type,
      paymentAmount:
        type === "lifetime" ? membershipFees.lifetime : membershipFees.ordinary,
    }));
    setShowForm(true);
  };

  const onBasicInfoChange = (
    k: keyof Omit<
      Form,
      "personalDetails" | "professionalDetails" | "documents"
    >,
    v: string | number
  ) => {
    setForm((f) => {
      const updates: Partial<Form> = { [k]: v };

      // Update payment amount when type changes
      if (k === "type") {
        updates.paymentAmount =
          v === "lifetime" ? membershipFees.lifetime : membershipFees.ordinary;
      }

      return { ...f, ...updates };
    });
  };

  // Validate Step 1 form fields
  const validateStep1 = useCallback(() => {
    const nameValid =
      form.name.trim().length >= 3 && /^[a-zA-Z\s]+$/.test(form.name);
    const designationValid =
      form.designation.trim().length >= 2 &&
      /^[a-zA-Z\s]+$/.test(form.designation);
    const departmentValid =
      form.department.trim().length >= 2 &&
      /^[a-zA-Z\s]+$/.test(form.department);
    const placeValid =
      form.place.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(form.place);
    const unitValid =
      form.unit.trim().length >= 1 && /^[a-zA-Z\s]+$/.test(form.unit);
    const mobileValid = /^[6-9][0-9]{9}$/.test(form.mobile);
    const emailValid = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(
      form.email
    );
    const divisionValid = form.division.length > 0;

    const isValid =
      nameValid &&
      designationValid &&
      departmentValid &&
      placeValid &&
      unitValid &&
      mobileValid &&
      emailValid &&
      divisionValid;
    setIsFormValid(isValid);
  }, [
    form.name,
    form.designation,
    form.department,
    form.place,
    form.unit,
    form.mobile,
    form.email,
    form.division,
  ]);

  // Validate Step 2 form fields
  const validateStep2 = useCallback(() => {
    const dobValid = (form.personalDetails.dateOfBirth || "").trim().length > 0;
    const genderValid = (form.personalDetails.gender || "").trim().length > 0;
    const addressValid =
      (form.personalDetails.address || "").trim().length >= 5;
    const stateValid = (form.personalDetails.state || "").trim().length > 0;
    const cityValid = (form.personalDetails.city || "").trim().length > 0;
    const pincodeValid = /^[1-9][0-9]{5}$/.test(
      form.personalDetails.pincode || ""
    );

    const isValid =
      dobValid &&
      genderValid &&
      addressValid &&
      cityValid &&
      stateValid &&
      pincodeValid;
    setIsStep2Valid(isValid);
  }, [
    form.personalDetails.dateOfBirth,
    form.personalDetails.gender,
    form.personalDetails.address,
    form.personalDetails.city,
    form.personalDetails.state,
    form.personalDetails.pincode,
  ]);

  // Validate form whenever Step 1 fields change
  useEffect(() => {
    if (step === 1) {
      validateStep1();
    }
  }, [step, validateStep1]);

  // Validate form whenever Step 2 fields change
  useEffect(() => {
    if (step === 2) {
      validateStep2();
    }
  }, [step, validateStep2]);

  const onPersonalDetailsChange = (
    k: keyof Required<Form>["personalDetails"],
    v: string
  ) => {
    setForm((f) => ({
      ...f,
      personalDetails: { ...f.personalDetails, [k]: v },
    }));
  };

  const onProfessionalDetailsChange = (
    k: keyof Required<Form>["professionalDetails"],
    v: string | number
  ) => {
    setForm((f) => ({
      ...f,
      professionalDetails: { ...f.professionalDetails, [k]: v },
    }));
  };

  const onDocumentsChange = (files: File[]) => {
    setForm((f) => ({ ...f, documents: files }));
  };

  const submit = async () => {
    setSubmitting(true);
    setError(null);
    
    try {
      // Validate all required fields
      if (!form.name?.trim() || !form.email?.trim() || !form.mobile?.trim() || 
          !form.designation?.trim() || !form.division?.trim() || 
          !form.department?.trim() || !form.type || !form.paymentAmount) {
        setError("Please fill all required fields");
        setSubmitting(false);
        return;
      }

      // Step 1: Create order on backend
      const orderResponse = await createMembershipOrder({
        name: form.name,
        email: form.email,
        mobile: form.mobile,
        designation: form.designation,
        division: form.division,
        department: form.department,
        place: form.place || "",
        unit: form.unit || "",
        type: form.type,
        paymentMethod: form.paymentMethod || "upi",
        paymentStatus: form.paymentStatus,
        paymentAmount: form.paymentAmount,
        status: form.status,
        personalDetails: form.personalDetails,
        professionalDetails: form.professionalDetails,
      });

      if (!orderResponse.success) {
        setError("Failed to create payment order");
        setSubmitting(false);
        return;
      }

      // Step 2: Load Razorpay script if not already loaded
      if (!window.Razorpay) {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => openRazorpayModal(orderResponse);
        script.onerror = () => {
          setError("Failed to load Razorpay. Please try again.");
          setSubmitting(false);
        };
        document.body.appendChild(script);
      } else {
        openRazorpayModal(orderResponse);
      }
    } catch (error) {
      console.error("Error processing membership:", error);
      const errorMessage = error instanceof Error ? error.message : "An error occurred. Please try again.";
      setError(errorMessage);
      setSubmitting(false);
    }
  };

  const openRazorpayModal = (orderResponse: Record<string, unknown>) => {
    const options: Record<string, unknown> = {
      key: orderResponse.keyId,
      amount: Math.round((orderResponse.amount as number) * 100),
      currency: "INR",
      order_id: orderResponse.orderId,
      name: "CREA",
      description: `Membership - ${form.type}`,
      prefill: {
        name: form.name,
        email: form.email,
        contact: form.mobile,
      },
      method: {
        upi: true,
        card: true,
        wallet: true,
        netbanking: true,
      },
      upi: {
        flow: 'otp',
      },
      handler: async (response: Record<string, unknown>) => {
        // Step 3: Verify payment on backend
        try {
          const verifyResponse = await verifyMembershipPayment({
            razorpay_order_id: response.razorpay_order_id as string,
            razorpay_payment_id: response.razorpay_payment_id as string,
            razorpay_signature: response.razorpay_signature as string,
          });

          if (verifyResponse.success) {
            setMembershipId(verifyResponse.membershipNumber);
            setStep(5); // Success step
            
            // Reset form after showing success message
            setTimeout(() => {
              setForm({
                name: "",
                designation: "",
                division: "Bhusawal",
                department: "",
                place: "",
                unit: "",
                mobile: "",
                email: "",
                type: "ordinary",
                paymentMethod: "upi",
                paymentStatus: "completed",
                paymentAmount: 500,
                status: "active",
                personalDetails: {},
                professionalDetails: {},
                documents: [],
              });
              setShowForm(false);
              setStep(1);
            }, 5000);
          } else {
            setError(verifyResponse.message || "Payment verification failed");
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Unknown error";
          setError("Payment verification failed: " + errorMessage);
        }
        setSubmitting(false);
      },
      modal: {
        ondismiss: () => {
          setError("Payment cancelled");
          setSubmitting(false);
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  if (!showForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 py-6 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-block mb-3 sm:mb-4"
            >
              <span className="bg-gradient-to-r from-[var(--accent)] to-yellow-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider shadow-lg">
                ✦ Join CREA Today
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--primary)] mb-3 sm:mb-4 px-4"
            >
              Choose Your Membership Plan
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4"
            >
              Join a community of professionals dedicated to growth and
              collaboration.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {/* Ordinary Membership Card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="relative bg-white rounded-2xl shadow-xl overflow-hidden group"
            >
              {/* Gradient Border Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)] to-blue-600 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />

              <div className="relative p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-[var(--primary)] to-blue-600 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-[var(--primary)] mb-3">
                  Ordinary Membership
                </h3>
                <p className="text-gray-600 mb-6 min-h-[48px]">
                  Ideal for staying connected and accessing annual benefits.
                </p>

                <div className="flex items-baseline mb-8">
                  <span className="text-5xl font-bold bg-gradient-to-r from-[var(--primary)] to-blue-600 bg-clip-text text-transparent">
                    ₹{membershipFees.ordinary}
                  </span>
                  <span className="text-gray-500 ml-2 text-lg">/ year</span>
                </div>

                <div className="space-y-4 mb-8">
                  {[
                    "Access to all events",
                    "Forum participation",
                    "Receive circulars & updates",
                    "Networking opportunities",
                  ].map((benefit, idx) => (
                    <motion.div
                      key={benefit}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + idx * 0.1 }}
                      className="flex items-center"
                    >
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                        <svg
                          className="w-3 h-3 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <span className="text-gray-700">{benefit}</span>
                    </motion.div>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => startApplication("ordinary")}
                  className="w-full bg-gradient-to-r from-[var(--primary)] to-blue-600 text-white rounded-xl py-3.5 font-bold hover:shadow-lg transition-all duration-300"
                >
                  Apply Now
                </motion.button>
              </div>
            </motion.div>

            {/* Lifetime Membership Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="relative bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl shadow-xl overflow-hidden group border-2 border-[var(--accent)]"
            >
              {/* Recommended Badge */}
              <div className="absolute top-0 right-0">
                <div className="bg-gradient-to-r from-[var(--accent)] to-yellow-600 text-white px-6 py-2 rounded-bl-2xl text-sm font-bold uppercase tracking-wider shadow-lg">
                  ⭐ Recommended
                </div>
              </div>

              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/10 to-transparent opacity-50" />

              <div className="relative p-8 pt-12">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-[var(--accent)] to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                      />
                    </svg>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-[var(--primary)] mb-3">
                  Lifetime Membership
                </h3>
                <p className="text-gray-700 mb-6 min-h-[48px]">
                  A one-time payment for a lifetime of benefits and support.
                </p>

                <div className="flex items-baseline mb-8">
                  <span className="text-5xl font-bold bg-gradient-to-r from-[var(--accent)] to-yellow-600 bg-clip-text text-transparent">
                    ₹{membershipFees.lifetime.toLocaleString()}
                  </span>
                  <span className="text-gray-600 ml-2 text-lg">one-time</span>
                </div>

                <div className="space-y-4 mb-8">
                  {[
                    "All Ordinary benefits, for lifetime",
                    "Priority event registration",
                    "Special recognition",
                    "No annual renewals",
                    "Exclusive member badge",
                  ].map((benefit, idx) => (
                    <motion.div
                      key={benefit}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + idx * 0.1 }}
                      className="flex items-center"
                    >
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[var(--accent)] to-yellow-600 flex items-center justify-center mr-3 flex-shrink-0">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <span className="text-gray-800 font-medium">
                        {benefit}
                      </span>
                    </motion.div>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => startApplication("lifetime")}
                  className="w-full bg-gradient-to-r from-[var(--accent)] to-yellow-600 text-white rounded-xl py-3.5 font-bold hover:shadow-xl transition-all duration-300 shadow-lg"
                >
                  Apply Now
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Additional Benefits Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-16 text-center"
          >
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-[var(--primary)] mb-6">
                Why Join CREA?
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    icon: "🤝",
                    title: "Network",
                    desc: "Connect with railway engineers across divisions",
                  },
                  {
                    icon: "📚",
                    title: "Learn",
                    desc: "Access to workshops, training, and resources",
                  },
                  {
                    icon: "🎯",
                    title: "Grow",
                    desc: "Professional development and career support",
                  },
                ].map((item, idx) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + idx * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-4xl mb-3">{item.icon}</div>
                    <h4 className="font-bold text-[var(--primary)] mb-2">
                      {item.title}
                    </h4>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Back Button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 sm:mb-6"
        >
          <button
            onClick={() => setShowForm(false)}
            className="mb-2 sm:mb-3 flex items-center gap-1.5 text-[var(--primary)] hover:text-blue-700 transition-colors font-medium text-xs sm:text-sm"
          >
            <svg
              className="w-3 h-3 sm:w-4 sm:h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Plans
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
            Apply for Membership
          </h1>
          <p className="text-xs sm:text-sm text-gray-600">
            Fill in your details and complete the payment process.
          </p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 sm:mb-6 bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4"
          >
            <div className="flex items-start gap-2 sm:gap-3">
              <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs sm:text-sm text-red-700">{error}</p>
            </div>
          </motion.div>
        )}

        {membershipId ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-sm border border-green-200 p-4 sm:p-6"
          >
            <div className="text-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <svg
                  className="w-6 h-6 sm:w-7 sm:h-7 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-green-800 mb-2">
                Application Submitted Successfully!
              </h2>
              <p className="text-xs sm:text-sm text-gray-700 mb-2 sm:mb-3">
                Membership ID:{" "}
                <span className="font-mono font-bold text-[var(--primary)]">
                  {membershipId}
                </span>
              </p>
              <p className="text-[10px] sm:text-xs text-gray-600">
                Your membership will be activated after payment verification.
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-4 sm:space-y-5">
            {/* Progress Steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-5"
            >
              <div className="flex items-center justify-between">
                {[
                  { num: 1, label: "Basic", icon: "👤" },
                  { num: 2, label: "Personal", icon: "📋" },
                  { num: 3, label: "Professional", icon: "💼" },
                  { num: 4, label: "Payment", icon: "💳" },
                ].map((s, idx) => (
                  <div key={s.num} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm sm:text-base font-semibold transition-all duration-300 ${
                          step >= s.num
                            ? "bg-[var(--primary)] text-white shadow-sm"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {step > s.num ? "✓" : s.icon}
                      </div>
                      <span
                        className={`mt-1 sm:mt-1.5 text-[10px] sm:text-xs font-medium ${
                          step >= s.num
                            ? "text-[var(--primary)]"
                            : "text-gray-400"
                        }`}
                      >
                        {s.label}
                      </span>
                    </div>
                    {idx < 3 && (
                      <div
                        className={`h-0.5 flex-1 mx-1 sm:mx-2 rounded transition-all duration-300 ${
                          step > s.num ? "bg-[var(--primary)]" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Form Content */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200"
              >
                <div className="px-5 py-3 bg-blue-50 border-b border-blue-100">
                  <h3 className="text-sm sm:text-base font-semibold text-[var(--primary)] flex items-center gap-2">
                    <span className="text-base sm:text-lg">👤</span>
                    Basic Information
                  </h3>
                </div>
                <div className="p-4 sm:p-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <Input
                      label="Name *"
                      value={form.name}
                      onChange={(e) =>
                        onBasicInfoChange("name", e.target.value)
                      }
                      onKeyPress={(e) => {
                        if (!/^[a-zA-Z\s]$/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      required
                      minLength={3}
                      maxLength={100}
                      pattern="^[a-zA-Z\s]+$"
                      title="Name must contain only letters and spaces (min 3 characters)"
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Designation <span className="text-red-500">*</span>
                      </label>
                      <select
                        className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-gray-900 focus:ring-1 focus:ring-[var(--primary)]"
                        value={form.designation}
                        onChange={(e) =>
                          onBasicInfoChange("designation", e.target.value)
                        }
                        required
                      >
                        <option value="">Select Designation</option>
                        {["JE", "SSE"].map((designation) => (
                          <option key={designation} value={designation}>
                            {designation}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Division <span className="text-red-500">*</span>
                      </label>
                      <select
                        className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-gray-900 focus:ring-1 focus:ring-[var(--primary)]"
                        value={form.division}
                        onChange={(e) =>
                          onBasicInfoChange("division", e.target.value)
                        }
                        required
                      >
                        <option value="">Select Division</option>
                        {["Bhusawal", "NGP", "PA", "SUR", "MB", "HQ Unit"].map(
                          (division) => (
                            <option key={division} value={division}>
                              {division}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Department <span className="text-red-500">*</span>
                      </label>
                      <select
                        className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-gray-900 focus:ring-1 focus:ring-[var(--primary)]"
                        value={form.department}
                        onChange={(e) =>
                          onBasicInfoChange("department", e.target.value)
                        }
                        required
                      >
                        <option value="">Select Department</option>
                        {["Electrical", "Mechanical", "Engineering", "S&T"].map(
                          (department) => (
                            <option key={department} value={department}>
                              {department}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                    <Input
                      label="Place of working *"
                      value={form.place}
                      onChange={(e) =>
                        onBasicInfoChange("place", e.target.value)
                      }
                      onKeyPress={(e) => {
                        if (!/^[a-zA-Z\s]$/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      required
                      minLength={2}
                      maxLength={100}
                      pattern="^[a-zA-Z\s]+$"
                      title="Place of working must contain only letters and spaces (min 2 characters)"
                    />
                    <Input
                      label="Working Unit *"
                      value={form.unit}
                      onChange={(e) =>
                        onBasicInfoChange("unit", e.target.value)
                      }
                      onKeyPress={(e) => {
                        if (!/^[a-zA-Z\s]$/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      required
                      minLength={1}
                      maxLength={50}
                      pattern="^[a-zA-Z\s]+$"
                      title="Working Unit must contain only letters and spaces"
                    />
                    <Input
                      label="Mobile Number *"
                      value={form.mobile}
                      onChange={(e) =>
                        onBasicInfoChange("mobile", e.target.value)
                      }
                      onKeyPress={(e) => {
                        if (!/^[0-9]$/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      required
                      type="tel"
                      pattern="[6-9][0-9]{9}"
                      minLength={10}
                      maxLength={10}
                      title="Mobile number must be 10 digits starting with 6-9"
                    />
                    <Input
                      label="Email ID *"
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        onBasicInfoChange("email", e.target.value)
                      }
                      onKeyPress={(e) => {
                        if (!/^[a-zA-Z0-9@._+-]$/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      required
                      pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}"
                      title="Please enter a valid email address"
                    />
                  </div>
                  <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <Button
                      onClick={() => setStep(2)}
                      disabled={!isFormValid}
                      className="px-6 py-2 text-sm mt-4"
                    >
                      Next Step →
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200"
              >
                <div className="px-5 py-3 bg-orange-50 border-b border-orange-100">
                  <h3 className="text-base font-semibold text-[var(--accent)] flex items-center gap-2">
                    <span className="text-lg">📋</span>
                    Personal Details
                  </h3>
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      type="date"
                      label="Date of Birth *"
                      value={form.personalDetails.dateOfBirth || ""}
                      onChange={(e) =>
                        onPersonalDetailsChange("dateOfBirth", e.target.value)
                      }
                      required
                      max={new Date().toISOString().split("T")[0]}
                      title="Date of Birth is required"
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gender *
                      </label>
                      <select
                        className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-gray-900 focus:ring-1 focus:ring-[var(--primary)]"
                        value={form.personalDetails.gender || ""}
                        onChange={(e) =>
                          onPersonalDetailsChange(
                            "gender",
                            e.target.value as "male" | "female" | "other"
                          )
                        }
                        required
                      >
                        <option value="">Select gender...</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <Input
                      label="Address *"
                      value={form.personalDetails.address || ""}
                      onChange={(e) =>
                        onPersonalDetailsChange("address", e.target.value)
                      }
                      required
                      minLength={5}
                      maxLength={200}
                      title="Address must be at least 5 characters"
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State *
                      </label>
                      <select
                        className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-gray-900 focus:ring-1 focus:ring-[var(--primary)]"
                        value={form.personalDetails.state || ""}
                        onChange={(e) => {
                          onPersonalDetailsChange("state", e.target.value);
                          // Reset city when state changes
                          onPersonalDetailsChange("city", "");
                        }}
                        required
                      >
                        <option value="">Select state...</option>
                        {STATES.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City *
                      </label>
                      <select
                        className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-gray-900 focus:ring-1 focus:ring-[var(--primary)] disabled:bg-gray-100 disabled:cursor-not-allowed"
                        value={form.personalDetails.city || ""}
                        onChange={(e) =>
                          onPersonalDetailsChange("city", e.target.value)
                        }
                        disabled={!form.personalDetails.state}
                        required
                      >
                        <option value="">
                          {!form.personalDetails.state
                            ? "Select state first..."
                            : "Select city..."}
                        </option>
                        {form.personalDetails.state &&
                          getCitiesForState(form.personalDetails.state).map(
                            (city) => (
                              <option key={city} value={city}>
                                {city}
                              </option>
                            )
                          )}
                      </select>
                      {!form.personalDetails.state && (
                        <p className="text-xs text-gray-500 mt-1">
                          Please select a state first
                        </p>
                      )}
                    </div>
                    <Input
                      label="PIN Code *"
                      value={form.personalDetails.pincode || ""}
                      onChange={(e) =>
                        onPersonalDetailsChange("pincode", e.target.value)
                      }
                      onKeyPress={(e) => {
                        if (!/^[0-9]$/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      required
                      type="tel"
                      pattern="[1-9][0-9]{5}"
                      minLength={6}
                      maxLength={6}
                      title="PIN Code must be 6 digits and cannot start with 0"
                    />
                  </div>
                  <div className="flex justify-between pt-4 border-t border-gray-100 mt-4">
                    <Button
                      variant="ghost"
                      onClick={() => setStep(1)}
                      className="text-sm px-4 py-2"
                    >
                      ← Back
                    </Button>
                    <Button
                      onClick={() => setStep(3)}
                      disabled={!isStep2Valid}
                      className="text-sm px-6 py-2"
                    >
                      Next Step →
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200"
              >
                <div className="px-5 py-3 bg-blue-50 border-b border-blue-100">
                  <h3 className="text-base font-semibold text-[var(--primary)] flex items-center gap-2">
                    <span className="text-lg">💼</span>
                    Professional Details
                  </h3>
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Employee ID"
                      value={form.professionalDetails.employeeId || ""}
                      onChange={(e) =>
                        onProfessionalDetailsChange(
                          "employeeId",
                          e.target.value
                        )
                      }
                    />
                    <Input
                      type="date"
                      label="Joining Date"
                      value={form.professionalDetails.joiningDate || ""}
                      onChange={(e) =>
                        onProfessionalDetailsChange(
                          "joiningDate",
                          e.target.value
                        )
                      }
                    />
                    <Input
                      type="number"
                      label="Experience (years)"
                      value={form.professionalDetails.experience || ""}
                      onChange={(e) =>
                        onProfessionalDetailsChange(
                          "experience",
                          parseInt(e.target.value)
                        )
                      }
                    />
                    <Input
                      label="Specialization"
                      value={form.professionalDetails.specialization || ""}
                      onChange={(e) =>
                        onProfessionalDetailsChange(
                          "specialization",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div className="mt-4 space-y-3 pt-4 border-t border-gray-100">
                    <h4 className="text-sm font-medium text-gray-900">
                      Required Documents
                    </h4>
                    <FileUploader
                      accept="image/*,.pdf"
                      maxFiles={3}
                      onFiles={onDocumentsChange}
                      hint="Upload your ID proof, photo, and signature (max 3 files)"
                    />
                  </div>

                  <div className="flex justify-between pt-4 border-t border-gray-100 mt-4">
                    <Button
                      variant="ghost"
                      onClick={() => setStep(2)}
                      className="text-sm px-4 py-2"
                    >
                      ← Back
                    </Button>
                    <Button
                      onClick={() => setStep(4)}
                      className="text-sm px-6 py-2"
                    >
                      Next Step →
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200"
              >
                <div className="px-5 py-3 bg-orange-50 border-b border-orange-100">
                  <h3 className="text-base font-semibold text-[var(--accent)] flex items-center gap-2">
                    <span className="text-lg">💳</span>
                    Payment
                  </h3>
                </div>
                <div className="p-5">
                  <div className="space-y-4">
                    <div className="rounded border border-gray-200 bg-gray-50 p-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">
                        Payment Method
                      </h4>
                      <div className="grid gap-2.5 sm:grid-cols-2">
                        {(["upi", "qr", "card", "netbanking"] as const).map(
                          (method) => (
                            <label
                              key={method}
                              className="relative flex cursor-pointer rounded border bg-white p-3 shadow-sm hover:border-[var(--primary)] transition-colors focus:outline-none"
                            >
                              <input
                                type="radio"
                                name="payment"
                                className="sr-only"
                                checked={form.paymentMethod === method}
                                onChange={() =>
                                  onBasicInfoChange("paymentMethod", method)
                                }
                              />
                              <div className="flex flex-1">
                                <div className="flex flex-col">
                                  <span className="block text-xs font-semibold text-gray-900 capitalize">
                                    {method}
                                  </span>
                                  <span className="mt-0.5 flex items-center text-xs text-gray-500">
                                    {method === "upi" && "Pay using UPI apps"}
                                    {method === "qr" && "Scan QR code to pay"}
                                    {method === "card" && "Credit/Debit card"}
                                    {method === "netbanking" &&
                                      "Internet banking"}
                                  </span>
                                </div>
                              </div>
                              <div
                                className={`absolute -inset-px rounded border-2 pointer-events-none ${
                                  form.paymentMethod === method
                                    ? "border-[var(--primary)]"
                                    : "border-transparent"
                                }`}
                                aria-hidden="true"
                              />
                            </label>
                          )
                        )}
                      </div>
                    </div>

                    <div className="rounded border border-gray-200 bg-white p-4">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">
                        Payment Summary
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Membership Type</span>
                          <span className="font-medium text-gray-900 capitalize">
                            {form.type}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Duration</span>
                          <span className="font-medium text-gray-900">
                            {form.type === "lifetime" ? "Lifetime" : "1 year"}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Amount</span>
                          <span className="font-medium text-gray-900">
                            ₹{form.paymentAmount}
                          </span>
                        </div>
                        <div className="pt-2 border-t border-gray-200">
                          <div className="flex justify-between">
                            <span className="text-sm font-semibold text-gray-900">
                              Total Amount
                            </span>
                            <span className="text-sm font-semibold text-[var(--primary)]">
                              ₹{form.paymentAmount}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between pt-4 border-t border-gray-100">
                      <Button
                        variant="ghost"
                        onClick={() => setStep(3)}
                        className="text-sm px-4 py-2"
                      >
                        ← Back
                      </Button>
                      <Button
                        onClick={submit}
                        disabled={submitting}
                        loading={submitting}
                        className="text-sm px-6 py-2"
                      >
                        {submitting
                          ? "Processing..."
                          : `Pay ₹${form.paymentAmount}`}
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
