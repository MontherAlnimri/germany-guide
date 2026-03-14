"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useDict } from "@/lib/i18n/context";
import { VISA_TYPES, GERMAN_CITIES } from "@/lib/constants";

export default function OnboardingPage() {
  const dict = useDict();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [error, setError] = useState("");
  const [fullName, setFullName] = useState("");
  const [visaType, setVisaType] = useState("");
  const [applicationType, setApplicationType] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [visaExpiry, setVisaExpiry] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (profile && profile.onboarding_complete) {
        setIsUpdate(true);
        setFullName(profile.full_name || "");
        setVisaType(profile.visa_type || "");
        setApplicationType(profile.first_vs_renewal || "");
        setCity(profile.city || "");
        setZipCode(profile.zip_code || "");
        setVisaExpiry(profile.visa_expiry_date || "");
      }
    }
    loadProfile();
  }, []);

  const getVisaLabel = (key: string) => {
    const visaDict = dict?.visa as Record<string, string> | undefined;
    return visaDict?.[key] || key;
  };

  const autoStartFlow = async (userId: string, userVisaType: string, userAppType: string) => {
    try {
      const supabase = createClient();

      // Find matching flow variant for this user's visa type + application type
      const { data: matchingVariants } = await supabase
        .from("flow_variants")
        .select("id")
        .eq("visa_type", userVisaType)
        .eq("first_vs_renewal", userAppType);

      if (!matchingVariants || matchingVariants.length === 0) return null;

      // Check if user already has an instance for this variant
      const variantId = matchingVariants[0].id;
      const { data: existingInstances } = await supabase
        .from("flow_instances")
        .select("id")
        .eq("user_id", userId)
        .eq("flow_variant_id", variantId);

      if (existingInstances && existingInstances.length > 0) {
        // Already started — go to that flow
        return existingInstances[0].id;
      }

      // Fetch the steps for this variant
      const { data: steps } = await supabase
        .from("flow_steps")
        .select("*")
        .eq("flow_variant_id", variantId)
        .order("step_order");

      const snapshot = (steps || []).map((s) => ({
        ...s,
        is_done: false,
        user_notes: "",
      }));

      // Create the flow instance
      const { data: instance } = await supabase
        .from("flow_instances")
        .insert({
          user_id: userId,
          flow_variant_id: variantId,
          status: "in_progress",
          progress: 0,
          step_snapshot: snapshot,
        })
        .select("id")
        .single();

      return instance?.id || null;
    } catch (err) {
      console.error("Auto-start flow error:", err);
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!fullName || !visaType || !applicationType) {
      setError(dict?.onboarding?.step1Desc ?? "Please fill in all required fields");
      return;
    }
    if (!city) {
      setError(dict?.onboarding?.selectCity ?? "Please select a city");
      return;
    }
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error: updateError } = await supabase.from("profiles").update({
      full_name: fullName,
      visa_type: visaType,
      first_vs_renewal: applicationType,
      city,
      zip_code: zipCode || null,
      visa_expiry_date: visaExpiry || null,
      onboarding_complete: true,
    }).eq("id", user.id);

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    // If this is the first onboarding (not an update), auto-start the first flow
    if (!isUpdate) {
      const flowInstanceId = await autoStartFlow(user.id, visaType, applicationType);
      if (flowInstanceId) {
        router.push(`/flow/${flowInstanceId}`);
        router.refresh();
        return;
      }
    }

    // Fallback: go to dashboard
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="max-w-lg mx-auto py-8 px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          {isUpdate
            ? (dict?.onboarding?.title ?? "Set Up Your Profile")
            : (dict?.onboarding?.welcome ?? "Welcome to Germany Guide")}
        </h1>
        <div className="flex items-center gap-2 mb-6">
          <span className="text-sm text-gray-500">
            {(dict?.onboarding?.progress ?? "Step {current} of {total}")
              .replace("{current}", String(step))
              .replace("{total}", "3")}
          </span>
          <div className="flex-1 flex gap-1">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full ${s <= step ? "bg-blue-600" : "bg-gray-200"}`}
              />
            ))}
          </div>
        </div>
        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3 mb-4">{error}</div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {dict?.onboarding?.aboutYou ?? "About You"}
            </h2>
            <p className="text-sm text-gray-600">
              {dict?.onboarding?.step1Desc ?? "What type of visa do you have or are applying for?"}
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {dict?.auth?.fullName ?? "Full Name"}
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none min-h-[44px]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {dict?.onboarding?.visaType ?? "Visa Type"}
              </label>
              <select
                value={visaType}
                onChange={(e) => setVisaType(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white min-h-[44px]"
              >
                <option value="">{dict?.onboarding?.visaPlaceholder ?? "Choose your visa type"}</option>
                {VISA_TYPES.map((v) => (
                  <option key={v} value={v}>{getVisaLabel(v)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {dict?.onboarding?.applicationType ?? "Application Type"}
              </label>
              <select
                value={applicationType}
                onChange={(e) => setApplicationType(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white min-h-[44px]"
              >
                <option value="">{dict?.onboarding?.selectVisaType ?? "Select type"}</option>
                <option value="first">{dict?.onboarding?.firstApplication ?? "First Application"}</option>
                <option value="renewal">{dict?.onboarding?.renewal ?? "Renewal"}</option>
              </select>
            </div>
            <button
              onClick={() => setStep(2)}
              className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors min-h-[44px]"
            >
              {dict?.common?.next ?? "Next"}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {dict?.onboarding?.location ?? "Location"}
            </h2>
            <p className="text-sm text-gray-600">
              {dict?.onboarding?.step2Desc ?? "Where do you live or plan to live in Germany?"}
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {dict?.onboarding?.city ?? "City"}
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white min-h-[44px]"
              >
                <option value="">{dict?.onboarding?.cityPlaceholder ?? "Choose your city"}</option>
                {GERMAN_CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {dict?.onboarding?.zipCode ?? "ZIP Code"}
              </label>
              <input
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder={dict?.onboarding?.zipPlaceholder ?? "e.g. 10115"}
                maxLength={5}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none min-h-[44px]"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors min-h-[44px]"
              >
                {dict?.common?.back ?? "Back"}
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors min-h-[44px]"
              >
                {dict?.common?.next ?? "Next"}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {dict?.onboarding?.step3Title ?? "Important Dates"}
            </h2>
            <p className="text-sm text-gray-600">
              {dict?.onboarding?.step3Desc ?? "When does your current visa expire?"}
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {dict?.onboarding?.visaExpiry ?? "Visa Expiry Date"}
              </label>
              <input
                type="date"
                value={visaExpiry}
                onChange={(e) => setVisaExpiry(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none min-h-[44px]"
              />
              <p className="text-xs text-gray-500 mt-1">
                {dict?.onboarding?.expiryHint ?? "This helps us send you renewal reminders"}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors min-h-[44px]"
              >
                {dict?.common?.back ?? "Back"}
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 min-h-[44px]"
              >
                {loading
                  ? (dict?.common?.loading ?? "Loading...")
                  : isUpdate
                    ? (dict?.onboarding?.saveChanges ?? "Save Changes")
                    : (dict?.onboarding?.completeSetup ?? "Complete Setup")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}