import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard, Shield, Check } from "lucide-react";
import { Link } from "wouter";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : null;

const CheckoutForm = ({ mvpData, contactData }: { mvpData: any, contactData: any }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/?payment=success`,
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Payment Successful",
        description: "Thank you for your purchase! You now have access to all premium features.",
      });
      
      // Update contact status to customer
      try {
        await apiRequest("PATCH", `/api/contacts/${contactData.id}/status`, { status: "customer" });
      } catch (err) {
        console.error("Failed to update contact status:", err);
      }
    }

    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Navigation */}
        <Link href="/" className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-8 transition-colors">
          <ArrowLeft className="mr-2" size={16} />
          Back to Dashboard
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-semibold text-slate-900">
                <CreditCard className="mr-2" size={20} />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* MVP Details */}
              <div className="bg-slate-50 rounded-lg p-4">
                <h3 className="font-semibold text-slate-900 mb-2">{mvpData?.name || "FlowBoost Pro Automation Suite"}</h3>
                <p className="text-sm text-slate-600 mb-4">Professional Plan - Full Access</p>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Check className="text-success mr-2" size={16} />
                    <span>Advanced Workflow Automation</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Check className="text-success mr-2" size={16} />
                    <span>AI-Powered Analytics Dashboard</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Check className="text-success mr-2" size={16} />
                    <span>Team Collaboration Tools</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Check className="text-success mr-2" size={16} />
                    <span>API Integration Hub</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Check className="text-success mr-2" size={16} />
                    <span>White-Label Branding</span>
                  </div>
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-3 pt-4 border-t border-slate-200">
                <div className="flex justify-between text-sm">
                  <span>Monthly Subscription</span>
                  <span>$235.00</span>
                </div>
                <div className="flex justify-between text-sm text-success">
                  <span>Quiz Completion Bonus</span>
                  <span>-$38.00</span>
                </div>
                <div className="flex justify-between text-lg font-semibold text-slate-900 pt-3 border-t border-slate-200">
                  <span>Total Monthly</span>
                  <span>$197.00</span>
                </div>
              </div>

              {/* Security Notice */}
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <div className="flex items-center text-sm text-primary">
                  <Shield className="mr-2" size={16} />
                  <span className="font-medium">Secure Payment</span>
                </div>
                <p className="text-xs text-primary/80 mt-1">
                  Your payment information is encrypted and secure. Cancel anytime.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-slate-900">Payment Details</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Customer Info */}
              <div className="mb-6 p-4 bg-slate-50 rounded-lg">
                <h4 className="font-medium text-slate-900 mb-2">Billing Information</h4>
                <div className="text-sm text-slate-600">
                  <div className="font-medium">{contactData?.name || "Demo User"}</div>
                  <div>{contactData?.email || "demo@example.com"}</div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="p-4 border border-slate-200 rounded-lg">
                  <PaymentElement />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={!stripe || isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                      Processing...
                    </>
                  ) : (
                    `Subscribe for $197/month`
                  )}
                </Button>

                <p className="text-xs text-slate-500 text-center">
                  By subscribing, you agree to our Terms of Service and Privacy Policy. 
                  You can cancel your subscription at any time.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const [mvpData, setMvpData] = useState(null);
  const [contactData, setContactData] = useState(null);
  const [paymentError, setPaymentError] = useState("");

  useEffect(() => {
    // Get MVP and contact data from URL params or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const mvpId = urlParams.get('mvpId') || 'demo-mvp-id';
    const contactId = urlParams.get('contactId') || 'demo-contact-id';
    
    // Create PaymentIntent as soon as the page loads
    apiRequest("POST", "/api/create-payment-intent", { 
      amount: 197, // $197 monthly subscription
      mvpId,
      contactId
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
      })
      .catch((error) => {
        console.error("Failed to create payment intent:", error);
        setPaymentError("Payment processing is currently unavailable. Please contact support.");
      });

    // Set mock data for demo purposes
    setMvpData({
      name: "FlowBoost Pro Automation Suite",
      type: "SaaS Application",
      features: [
        "Advanced Workflow Automation",
        "AI-Powered Analytics Dashboard", 
        "Team Collaboration Tools",
        "API Integration Hub",
        "White-Label Branding"
      ]
    });

    setContactData({
      id: contactId,
      name: "Demo User",
      email: "demo@example.com"
    });
  }, []);

  if (paymentError) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <div className="text-red-600 text-xl mb-4">⚠️</div>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Payment Unavailable</h2>
            <p className="text-slate-600 mb-4">{paymentError}</p>
            <Link href="/" className="inline-flex items-center text-primary hover:text-primary/80">
              <ArrowLeft className="mr-2" size={16} />
              Back to Dashboard
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-slate-600">Preparing your checkout...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!stripePromise) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <div className="text-yellow-600 text-xl mb-4">⚠️</div>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Payment Setup Required</h2>
            <p className="text-slate-600 mb-4">Stripe public key is not configured. Please contact support to enable payments.</p>
            <Link href="/" className="inline-flex items-center text-primary hover:text-primary/80">
              <ArrowLeft className="mr-2" size={16} />
              Back to Dashboard
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Make SURE to wrap the form in <Elements> which provides the stripe context.
  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm mvpData={mvpData} contactData={contactData} />
    </Elements>
  );
}
