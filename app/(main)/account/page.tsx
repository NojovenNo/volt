'use client';

import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Address = {
  id: number;
  line1: string;
  line2?: string;
  city: string;
  postalCode: string;
  country: string;
};

export default function AccountPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressForm, setAddressForm] = useState<Omit<Address, "id">>({
    line1: "",
    line2: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [isSavingBilling, setIsSavingBilling] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const [billingName, setBillingName] = useState("");
  const [billingCard, setBillingCard] = useState("");
  const [billingExpiry, setBillingExpiry] = useState("");
  const [billingCvc, setBillingCvc] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  function handleChangeAddressField<K extends keyof typeof addressForm>(
    field: K,
    value: (typeof addressForm)[K],
  ) {
    setAddressForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleRemoveAddress(id: number) {
    // TODO: Replace with API call to delete address
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
  }

  async function handleAddOrUpdateAddress(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSavingAddress(true);
    try {
      // TODO: Replace with API call to create/update address for the authenticated user
      const newAddress: Address = {
        id: Date.now(),
        ...addressForm,
      };
      setAddresses((prev) => [...prev, newAddress]);
      setAddressForm({
        line1: "",
        line2: "",
        city: "",
        postalCode: "",
        country: "",
      });
      alert("Address saved (wire this up to your backend).");
    } finally {
      setIsSavingAddress(false);
    }
  }

  async function handleSaveBilling(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSavingBilling(true);
    try {
      // TODO: Replace with real billing integration (Stripe or another provider)
      console.log("Save billing", {
        billingName,
        billingCard,
        billingExpiry,
        billingCvc,
      });
      alert("Payment details saved. Connect this to your backend/payment provider.");
    } finally {
      setIsSavingBilling(false);
    }
  }

  async function handleChangePassword(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      alert("New passwords do not match.");
      return;
    }

    setIsSavingPassword(true);
    try {
      // TODO: Replace with secure API call to change password for the authenticated user
      console.log("Change password", {
        currentPassword,
        newPassword,
      });
      alert("Password change submitted. Wire this up to your backend.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } finally {
      setIsSavingPassword(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-10">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Account</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your shipping addresses, payment methods, and password.
        </p>
      </header>

      <section className="grid gap-8 md:grid-cols-2">
        <div className="rounded-xl border border-border/60 bg-card/80 p-6 shadow-sm">
          <h2 className="text-lg font-medium">Addresses</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Add, edit, or remove your shipping addresses.
          </p>

          <form onSubmit={handleAddOrUpdateAddress} className="mt-4 space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="address-line1">Address (line 1)</Label>
              <Input
                id="address-line1"
                required
                value={addressForm.line1}
                onChange={(e) => handleChangeAddressField("line1", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="address-line2">Address (line 2)</Label>
              <Input
                id="address-line2"
                value={addressForm.line2}
                onChange={(e) => handleChangeAddressField("line2", e.target.value)}
                placeholder="Apartment, floor, etc. (optional)"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="address-city">City</Label>
                <Input
                  id="address-city"
                  required
                  value={addressForm.city}
                  onChange={(e) => handleChangeAddressField("city", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="address-postal">Postal code</Label>
                <Input
                  id="address-postal"
                  required
                  value={addressForm.postalCode}
                  onChange={(e) =>
                    handleChangeAddressField("postalCode", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="address-country">Country</Label>
              <Input
                id="address-country"
                required
                value={addressForm.country}
                onChange={(e) => handleChangeAddressField("country", e.target.value)}
              />
            </div>

            <Button
              type="submit"
              className="mt-2 w-full sm:w-auto"
              disabled={isSavingAddress}
            >
              {isSavingAddress ? "Saving..." : "Save address"}
            </Button>
          </form>

          {addresses.length > 0 && (
            <div className="mt-6 space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">
              Your addresses
              </h3>
              <ul className="space-y-2 text-sm">
                {addresses.map((addr) => (
                  <li
                    key={addr.id}
                    className="flex items-start justify-between gap-3 rounded-lg border border-border/60 bg-background/60 p-3"
                  >
                    <div>
                      <p>{addr.line1}</p>
                      {addr.line2 && <p>{addr.line2}</p>}
                      <p>
                        {addr.postalCode} {addr.city}
                      </p>
                      <p>{addr.country}</p>
                    </div>
                    <div className="flex shrink-0 flex-col gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveAddress(addr.id)}
                      >
                      Remove
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="space-y-8">
          <div className="rounded-xl border border-border/60 bg-card/80 p-6 shadow-sm">
            <h2 className="text-lg font-medium">Billing</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Manage the payment method used for your orders.
            </p>

            <form onSubmit={handleSaveBilling} className="mt-4 space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="billing-name">Name on card</Label>
                <Input
                  id="billing-name"
                  required
                  value={billingName}
                  onChange={(e) => setBillingName(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="billing-card">Card number</Label>
                <Input
                  id="billing-card"
                  required
                  inputMode="numeric"
                  value={billingCard}
                  onChange={(e) => setBillingCard(e.target.value)}
                  placeholder="1234 5678 9012 3456"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-[2fr,1fr]">
                <div className="space-y-1.5">
                  <Label htmlFor="billing-expiry">Expiration date</Label>
                  <Input
                    id="billing-expiry"
                    required
                    placeholder="MM/AA"
                    value={billingExpiry}
                    onChange={(e) => setBillingExpiry(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="billing-cvc">CVC</Label>
                  <Input
                    id="billing-cvc"
                    required
                    inputMode="numeric"
                    value={billingCvc}
                    onChange={(e) => setBillingCvc(e.target.value)}
                    placeholder="123"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="mt-2 w-full sm:w-auto"
                disabled={isSavingBilling}
              >
                {isSavingBilling ? "Saving..." : "Save payment method"}
              </Button>
            </form>
          </div>

          <div className="rounded-xl border border-border/60 bg-card/80 p-6 shadow-sm">
            <h2 className="text-lg font-medium">Password</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Change the password you use to sign in.
            </p>

            <form onSubmit={handleChangePassword} className="mt-4 space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="current-password">Current password</Label>
                <Input
                  id="current-password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="new-password">New password</Label>
                <Input
                  id="new-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirm-new-password">Confirm new password</Label>
                <Input
                  id="confirm-new-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                className="mt-2 w-full sm:w-auto"
                disabled={isSavingPassword}
              >
                {isSavingPassword ? "Updating..." : "Change password"}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

