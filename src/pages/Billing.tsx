import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles, CreditCard, Download, ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    credits: 10,
    features: ["Post up to 3 jobs", "10 credits/month", "Basic AI matching"],
    highlighted: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$99",
    period: "/month",
    credits: 50,
    features: ["Unlimited job posts", "50 credits/month", "Priority matching", "Advanced analytics", "Priority support"],
    highlighted: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "",
    credits: -1,
    features: ["Everything in Pro", "Unlimited credits", "Dedicated account manager", "Custom integrations", "SLA guarantees"],
    highlighted: false,
  },
];

export default function Billing() {
  const [currentPlan] = useState("free");
  const [invoiceHistory] = useState([
    { id: "1", date: "2024-01-15", amount: 99, status: "Paid" },
    { id: "2", date: "2024-02-15", amount: 99, status: "Paid" },
  ]);

  const handleCheckout = async (planId: string) => {
    try {
      const response = await fetch("/api/v1/payments/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credits: PLANS.find(p => p.id === planId)?.credits || 10 }),
      });
      const data = await response.json();
      if (data.url) window.location.href = data.url;
    } catch (error) {
      console.error("Checkout failed", error);
    }
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl pt-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold mb-2">Billing & Subscription</h1>
          <p className="text-muted-foreground">Manage your plan, credits, and view payment history.</p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {PLANS.map((plan) => (
            <Card
              key={plan.id}
              className={cn(
                "relative overflow-hidden transition-all duration-300",
                plan.highlighted
                  ? "border-primary glass-strong scale-105 shadow-[var(--shadow-glow)]"
                  : "glass"
              )}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-primary to-accent text-primary-foreground border-0">
                    <Sparkles className="size-3 mr-1" />
                    Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="mt-2">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">{plan.period}</span>
                </div>
                <CardDescription className="mt-2">
                  {plan.credits === -1 ? "Unlimited" : `${plan.credits} credits`} per month
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-2">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="size-4 text-primary" />
                    <span>{feature}</span>
                  </div>
                ))}
              </CardContent>

              <CardFooter className="pt-4">
                {plan.id === "enterprise" ? (
                  <Button variant="outline" className="w-full">
                    Contact Sales
                  </Button>
                ) : plan.id === currentPlan ? (
                  <Button variant="secondary" className="w-full" disabled>
                    Current Plan
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleCheckout(plan.id)}
                    className={cn("w-full", plan.highlighted ? "btn-liquid" : "")}
                  >
                    <CreditCard className="size-4 mr-2" />
                    Upgrade to {plan.name}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Current Usage */}
        <Card className="glass-strong mb-8">
          <CardHeader>
            <CardTitle>Current Usage</CardTitle>
            <CardDescription>Your credit usage this billing period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Credits used</span>
                  <span className="text-sm font-semibold">47 / 50</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full w-[94%] bg-gradient-to-r from-primary to-accent rounded-full" />
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => handleCheckout("pro")}>
                Buy more credits
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Invoice History */}
        <Card className="glass-strong">
          <CardHeader>
            <CardTitle>Invoice History</CardTitle>
            <CardDescription>Download past invoices and receipts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {invoiceHistory.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-muted/50">
                      <Download className="size-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">Invoice #{invoice.id}</p>
                      <p className="text-sm text-muted-foreground">{invoice.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary">{invoice.status}</Badge>
                    <span className="font-mono font-semibold">${invoice.amount}</span>
                    <Button variant="ghost" size="sm">
                      <Download className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}
