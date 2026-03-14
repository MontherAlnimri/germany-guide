"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/hooks/useUser";
import { useProfile } from "@/hooks/useProfile";
import { useSubscription } from "@/hooks/useSubscription";
import { useEmailVerified } from "@/hooks/useEmailVerified";
import { useDict } from "@/lib/i18n/context";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";
import { VISA_TYPES, GERMAN_CITIES } from "@/lib/constants";

export default function SettingsPage() {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const { profile, loading: profileLoading, updateProfile } = useProfile();
  const { subscription } = useSubscription();
  const { verified } = useEmailVerified();
  const dict = useDict();
  const s = dict?.settings;

  // Profile form state
  const [fullName, setFullName] = useState("");
  const [visaType, setVisaType] = useState("");
  const [applicationType, setApplicationType] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [visaExpiry, setVisaExpiry] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState("");

  // Password form state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Delete account state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setVisaType(profile.visa_type || "");
      setApplicationType(profile.first_vs_renewal || "");
      setCity(profile.city || "");
      setZipCode(profile.zip_code || "");
      setVisaExpiry(profile.visa_expiry_date || "");
    }
  }, [profile]);

  const getVisaLabel = (key: string) => {
    const visaDict = dict?.visa as Record<string, string> | undefined;
    return visaDict?.[key] || key;
  };

  const handleProfileSave = async () => {
    setProfileSaving(true);
    setProfileError("");
    setProfileSuccess(false);

    const result = await updateProfile({
      full_name: fullName || null,
      visa_type: visaType || null,
      first_vs_renewal: applicationType || null,
      city: city || null,
      zip_code: zipCode || null,
      visa_expiry_date: visaExpiry || null,
    });

    if (result.error) {
      setProfileError(result.error);
    } else {
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    }
    setProfileSaving(false);
  };

  const handlePasswordChange = async () => {
    setPasswordError("");
    setPasswordSuccess(false);

    if (newPassword.length < 6) {
      setPasswordError(dict?.auth?.passwordTooShort ?? "Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError(dict?.auth?.passwordMismatch ?? "Passwords do not match");
      return;
    }

    setPasswordSaving(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setPasswordError(error.message);
    } else {
      setPasswordSuccess(true);
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSuccess(false), 3000);
    }
    setPasswordSaving(false);
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") return;
    setDeleting(true);
    setDeleteError("");

    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        setDeleteError("Not authenticated");
        setDeleting(false);
        return;
      }

      const res = await fetch("/api/account/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setDeleteError(data.error || "Failed to delete account");
        setDeleting(false);
        return;
      }

      await supabase.auth.signOut();
      router.push("/");
    } catch {
      setDeleteError("An unexpected error occurred");
      setDeleting(false);
    }
  };

  if (userLoading || profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">{dict?.common?.loading ?? "Loading..."}</p>
        </div>
      </div>
    );
  }

  const isPremium = subscription?.plan === "monthly" || subscription?.plan === "yearly";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          {s?.title ?? "Settings"}
        </h1>
        <p className="text-gray-600 text-sm mt-1">
          {s?.subtitle ?? "Manage your account and preferences"}
        </p>
      </div>

      {/* Account Info */}
      <Card className="p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {s?.accountInfo ?? "Account Information"}
        </h2>
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="text-sm text-gray-600">{dict?.auth?.email ?? "Email"}</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900">{user?.email}</span>
              {verified === true && (
                <Badge variant="success">{dict?.verification?.verified ?? "Verified"}</Badge>
              )}
              {verified === false && (
                <Badge variant="warning">{dict?.verification?.notVerified ?? "Not verified"}</Badge>
              )}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="text-sm text-gray-600">{s?.plan ?? "Plan"}</span>
            <div className="flex items-center gap-2">
              {isPremium ? (
                <Badge variant="warning">{"\u2B50"} {dict?.premium?.premiumBadge ?? "Premium"}</Badge>
              ) : (
                <Badge variant="neutral">{dict?.premium?.free ?? "Free"}</Badge>
              )}
              {isPremium ? (
                <button
                  onClick={async () => {
                    const supabase = createClient();
                    const { data: { session } } = await supabase.auth.getSession();
                    if (!session) return;
                    const res = await fetch("/api/stripe/portal", {
                      method: "POST",
                      headers: { Authorization: `Bearer ${session.access_token}` },
                    });
                    const { url } = await res.json();
                    if (url) window.location.href = url;
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  {dict?.premium?.managePlan ?? "Manage"}
                </button>
              ) : (
                <button
                  onClick={() => router.push("/premium")}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  {dict?.premium?.upgradeNow ?? "Upgrade"}
                </button>
              )}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="text-sm text-gray-600">{dict?.common?.language ?? "Language"}</span>
            <LanguageSwitcher />
          </div>
        </div>
      </Card>

      {/* Profile */}
      <Card className="p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {s?.profileSection ?? "Profile"}
        </h2>

        {profileSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg p-3 mb-4">
            {dict?.common?.success ?? "Saved successfully"}
          </div>
        )}
        {profileError && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">
            {profileError}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {dict?.auth?.fullName ?? "Full Name"}
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none min-h-[44px]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {dict?.onboarding?.visaType ?? "Visa Type"}
              </label>
              <select
                value={visaType}
                onChange={(e) => setVisaType(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white min-h-[44px]"
              >
                <option value="">{dict?.onboarding?.visaPlaceholder ?? "Choose visa type"}</option>
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
                <option value="">{dict?.onboarding?.selectVisaType ?? "Select"}</option>
                <option value="first">{dict?.onboarding?.firstApplication ?? "First Application"}</option>
                <option value="renewal">{dict?.onboarding?.renewal ?? "Renewal"}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {dict?.onboarding?.city ?? "City"}
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white min-h-[44px]"
              >
                <option value="">{dict?.onboarding?.cityPlaceholder ?? "Choose city"}</option>
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
          </div>

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
          </div>

          <Button
            onClick={handleProfileSave}
            disabled={profileSaving}
            className="min-h-[44px]"
          >
            {profileSaving ? (dict?.common?.loading ?? "Saving...") : (dict?.common?.save ?? "Save")}
          </Button>
        </div>
      </Card>

      {/* Change Password */}
      <Card className="p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {s?.changePassword ?? "Change Password"}
        </h2>

        {passwordSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg p-3 mb-4">
            {s?.passwordChanged ?? "Password updated successfully"}
          </div>
        )}
        {passwordError && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">
            {passwordError}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {dict?.auth?.newPassword ?? "New Password"}
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="********"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none min-h-[44px]"
            />
            <p className="text-xs text-gray-500 mt-1">
              {dict?.auth?.passwordHint ?? "At least 6 characters"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {dict?.auth?.confirmNewPassword ?? "Confirm New Password"}
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="********"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none min-h-[44px]"
            />
          </div>
          <Button
            onClick={handlePasswordChange}
            disabled={passwordSaving || !newPassword}
            className="min-h-[44px]"
          >
            {passwordSaving ? (dict?.common?.loading ?? "Saving...") : (s?.updatePassword ?? "Update Password")}
          </Button>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="p-4 sm:p-6 border-red-200">
        <h2 className="text-lg font-semibold text-red-700 mb-2">
          {s?.dangerZone ?? "Danger Zone"}
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          {s?.deleteAccountDesc ?? "Permanently delete your account and all associated data. This action cannot be undone."}
        </p>
        <Button
          onClick={() => setShowDeleteModal(true)}
          className="bg-red-600 hover:bg-red-700 text-white min-h-[44px]"
        >
          {s?.deleteAccount ?? "Delete Account"}
        </Button>
      </Card>

      {/* Delete Account Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => { setShowDeleteModal(false); setDeleteConfirmText(""); setDeleteError(""); }}
        title={s?.deleteAccountConfirmTitle ?? "Delete Account"}
      >
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800 font-medium mb-2">
              {s?.deleteAccountWarning ?? "This will permanently delete:"}
            </p>
            <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
              <li>{s?.deleteItem1 ?? "Your profile and account"}</li>
              <li>{s?.deleteItem2 ?? "All your flows and progress"}</li>
              <li>{s?.deleteItem3 ?? "All your documents"}</li>
              <li>{s?.deleteItem4 ?? "All your deadlines"}</li>
              <li>{s?.deleteItem5 ?? "Your subscription (if any)"}</li>
            </ul>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {(s?.typeDeleteConfirm ?? 'Type "DELETE" to confirm').replace('"DELETE"', '')}
              <span className="font-bold text-red-600"> DELETE </span>
              {s?.toConfirm ?? "to confirm"}
            </label>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="DELETE"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none min-h-[44px]"
            />
          </div>

          {deleteError && (
            <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3">{deleteError}</div>
          )}

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => { setShowDeleteModal(false); setDeleteConfirmText(""); setDeleteError(""); }}
              className="flex-1 min-h-[44px]"
            >
              {dict?.common?.cancel ?? "Cancel"}
            </Button>
            <Button
              onClick={handleDeleteAccount}
              disabled={deleteConfirmText !== "DELETE" || deleting}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white min-h-[44px] disabled:opacity-50"
            >
              {deleting ? (dict?.common?.loading ?? "Deleting...") : (s?.confirmDelete ?? "Delete My Account")}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}