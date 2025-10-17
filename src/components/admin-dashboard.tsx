
"use client";

import { AddDonationPoint } from "./add-donation-point";
import { AdminCategoryManager } from "./admin-category-manager";
import { Separator } from "./ui/separator";

export function AdminDashboard() {
  return (
    <div className="space-y-8">
      <AdminCategoryManager />
      <Separator />
      <AddDonationPoint />
    </div>
  );
}
