"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  TrendingUp,
  DollarSign,
  BarChart3,
  History,
  Wallet,
  User,
  LogOut,
  Calculator,
  X,
} from "lucide-react";
import { createInvestor, loginInvestor, withdrawFunds } from "@/services/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useInvestorStore } from "@/store/investor-store";
import {
  getInvestmentsOption,
  getInvestorOption,
  getRoiOption,
} from "@/services/query-options";
import { investmentStatus } from "@/types/data-types";

const BRAND = "#06E84E";
const INK = "#0F0F0F";

// Mock data for dashboard
const mockInvestmentData = [
  { date: "2024-01-15", amount: "$5,000", status: "Active", returns: "$750" },
  {
    date: "2024-02-20",
    amount: "$3,000",
    status: "Completed",
    returns: "$450",
  },
  { date: "2024-03-10", amount: "$7,500", status: "Active", returns: "$1,125" },
  { date: "2024-04-05", amount: "$2,000", status: "Pending", returns: "$0" },
];

export default function InvestorPage() {
  const queryClient = useQueryClient();
  const { setInvestorData, investorData } = useInvestorStore();
  const { data: investor } = useQuery(getInvestorOption(investorData?._id));
  const { mutate } = useMutation({
    mutationFn: createInvestor,
    onSuccess: () => {
      setSignupForm({
        name: "",
        phone: "",
        email: "",
        investRange: "",
        investPeriod: "",
        agreeTerms: false,
      });
      toast.success("Investor created successfully");
    },
  });
  const { mutate: loginMutate } = useMutation({
    mutationFn: loginInvestor,
    onSuccess: (data) => {
      setInvestorData(data);
      setLoginForm({
        phone: "",
        otp: "",
      });
    },
  });
  const { mutate: withdraw } = useMutation({
    mutationFn: withdrawFunds,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["investments", investorData?._id],
      });
    },
  });

  const { data: roiData } = useQuery(getRoiOption());

  const [showTermsModal, setShowTermsModal] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [loginForm, setLoginForm] = useState({ phone: "", otp: "" });
  const [signupForm, setSignupForm] = useState({
    name: "",
    phone: "",
    email: "",
    investRange: "",
    investPeriod: "",
    agreeTerms: false,
  });
  const [roiCalculator, setRoiCalculator] = useState({
    amount: "",
    roi: Number(roiData?.[0]?.roi) * 100 || 18,
    years: "1",
  });

  useEffect(() => {
    setRoiCalculator((prev) => ({
      ...prev,
      roi: Number(roiData?.[0]?.roi) * 100 || 18,
    }));
  }, [roiData]);

  const { data: investments } = useQuery(
    getInvestmentsOption(investorData?._id)
  );

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutate(loginForm);
  };

  const handleSendOTP = () => {
    if (loginForm.phone) {
      setOtpSent(true);
      console.log("OTP sent to:", loginForm.phone);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    mutate(signupForm);
  };

  const calculateROI = () => {
    const amount = Number.parseFloat(roiCalculator.amount) || 0;
    const roi = roiCalculator.roi || 0;
    const years = Number.parseFloat(roiCalculator.years) || 0;
    const returns = amount * (roi / 100) * years;
    return amount + returns;
  };

  const handleWithdraw = () => {
    if (investor?.withdrawableAmount <= 0) {
      toast.error("Withdraw amount is not sufficient");
    } else {
      withdraw(investorData!._id);
    }
  };

  const TermsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-none border-[3px] border-black shadow-[8px_8px_0_0_#0F0F0F] max-w-4xl max-h-[80vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-black">Terms & Conditions</h2>
            <Button
              onClick={() => setShowTermsModal(false)}
              className="rounded-none border-[2px] border-black p-2"
              style={{ backgroundColor: "white", color: INK }}
            >
              <X className="size-5" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-black mb-2" style={{ color: BRAND }}>
                  Investment Limits
                </h3>
                <p className="font-medium">
                  Minimum investment: 50,000 BDT, Maximum: 500,000 BDT.
                </p>
              </div>
              <div>
                <h3 className="font-black mb-2" style={{ color: BRAND }}>
                  Returns
                </h3>
                <p className="font-medium">
                  16–20% per year, based on the chosen package.
                </p>
              </div>
              <div>
                <h3 className="font-black mb-2" style={{ color: BRAND }}>
                  Payment
                </h3>
                <p className="font-medium">
                  ROI paid after 1 year via bank transfer or preferred method.
                </p>
              </div>
              <div>
                <h3 className="font-black mb-2" style={{ color: BRAND }}>
                  Risk Disclosure
                </h3>
                <p className="font-medium">
                  All investments carry inherent risks. Past performance does
                  not guarantee future results.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-black mb-2" style={{ color: BRAND }}>
                  Withdrawal Policy
                </h3>
                <p className="font-medium">
                  No early withdrawal, except with prior approval (may include
                  deductions).
                </p>
              </div>
              <div>
                <h3 className="font-black mb-2" style={{ color: BRAND }}>
                  Legal Compliance
                </h3>
                <p className="font-medium">
                  Investments follow the laws & financial regulations of
                  Bangladesh.
                </p>
              </div>
              <div>
                <h3 className="font-black mb-2" style={{ color: BRAND }}>
                  Account Management
                </h3>
                <p className="font-medium">
                  Investors receive unique IDs and access to online dashboard
                  for tracking.
                </p>
              </div>
              <div>
                <h3 className="font-black mb-2" style={{ color: BRAND }}>
                  Dispute Resolution
                </h3>
                <p className="font-medium">
                  Any disputes will be resolved through arbitration under
                  Bangladesh law.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-gray-50 rounded-none border-[2px] border-gray-300">
            <p className="text-sm font-medium text-gray-700">
              By creating an investor account, you acknowledge that you have
              read, understood, and agree to be bound by these Terms &
              Conditions. For questions or clarifications, contact us at
              info@topmostsourcing.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  if (investorData) {
    return (
      <div className="min-h-screen bg-white">
        <SiteHeader />
        <main className="max-w-6xl mx-auto px-4 md:px-8 lg:px-12 py-8">
          {/* Dashboard Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-black mb-2">Investor Dashboard</h1>
              <p className="text-gray-600">Welcome back, {investorData.name}</p>
            </div>
            <Button
              onClick={() => setInvestorData(null)}
              className="rounded-none border-[3px] font-bold"
              style={{
                backgroundColor: "white",
                color: INK,
                borderColor: INK,
                boxShadow: `4px 4px 0 0 ${INK}`,
              }}
            >
              <LogOut className="size-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 rounded-none border-[3px] border-black shadow-[4px_4px_0_0_#0F0F0F]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-600 uppercase">
                    Total Investment
                  </p>
                  <p className="text-2xl font-black">
                    {investor?.totalInvestment}
                  </p>
                </div>
                <TrendingUp className="size-8" style={{ color: BRAND }} />
              </div>
            </Card>
            <Card className="p-6 rounded-none border-[3px] border-black shadow-[4px_4px_0_0_#0F0F0F]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-600 uppercase">
                    Total Returns
                  </p>
                  <p className="text-2xl font-black">
                    {investor?.totalReturns}
                  </p>
                </div>
                <DollarSign className="size-8" style={{ color: BRAND }} />
              </div>
            </Card>
            <Card className="p-6 rounded-none border-[3px] border-black shadow-[4px_4px_0_0_#0F0F0F]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-600 uppercase">
                    Pending Returns
                  </p>
                  <p className="text-2xl font-black">
                    {investor?.pendingReturns}
                  </p>
                </div>
                <History className="size-8" style={{ color: BRAND }} />
              </div>
            </Card>
            <Card className="p-6 rounded-none border-[3px] border-black shadow-[4px_4px_0_0_#0F0F0F]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-600 uppercase">
                    Withdrawable
                  </p>
                  <p className="text-2xl font-black">
                    {investor?.withdrawableAmount}
                  </p>
                </div>
                <Wallet className="size-8" style={{ color: BRAND }} />
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Investment History */}
            <div className="lg:col-span-2">
              <Card className="p-6 rounded-none border-[3px] border-black shadow-[4px_4px_0_0_#0F0F0F]">
                <h2 className="text-xl font-black mb-4 flex items-center">
                  <BarChart3 className="size-5 mr-2" />
                  Investment History
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-black">
                        <th className="text-left py-3 font-bold uppercase text-sm">
                          Date
                        </th>
                        <th className="text-left py-3 font-bold uppercase text-sm">
                          Amount
                        </th>
                        <th className="text-left py-3 font-bold uppercase text-sm">
                          Status
                        </th>
                        <th className="text-left py-3 font-bold uppercase text-sm">
                          Returns
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {investments?.map((investment: any, index: number) => (
                        <tr key={index} className="border-b border-gray-200">
                          <td className="py-3 font-medium">
                            {investment.createdAt &&
                              new Date(investment.createdAt).toLocaleString(
                                "en-GB",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                          </td>
                          <td className="py-3 font-bold">
                            {investment?.amount}
                          </td>
                          <td className="py-3">
                            <span
                              className={`px-2 py-1 text-xs font-bold rounded-none border-2 ${
                                investment.status === investmentStatus.PAID
                                  ? "bg-green-100 border-green-600 text-green-800"
                                  : investment.status ===
                                    investmentStatus.WITHDRAWABLE
                                  ? "bg-blue-100 border-blue-600 text-blue-800"
                                  : "bg-yellow-100 border-yellow-600 text-yellow-800"
                              }`}
                            >
                              {investment?.status}
                            </span>
                          </td>
                          <td className="py-3 font-bold">
                            {investment?.returns}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>

            {/* Profile & Actions */}
            <div className="space-y-6">
              <Card className="p-6 rounded-none border-[3px] border-black shadow-[4px_4px_0_0_#0F0F0F]">
                <h2 className="text-xl font-black mb-4 flex items-center">
                  <User className="size-5 mr-2" />
                  Profile
                </h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-bold text-gray-600 uppercase">
                      Investor ID
                    </p>
                    <p className="font-bold">{investorData.publicId}</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-600 uppercase">
                      Full Name
                    </p>
                    <p className="font-bold">{investorData.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-600 uppercase">
                      Email
                    </p>
                    <p className="font-bold">{investorData.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-600 uppercase">
                      Mobile
                    </p>
                    <p className="font-bold">{investorData.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-600 uppercase">
                      Amount
                    </p>
                    <p className="font-bold">{investor?.withdrawableAmount}</p>
                  </div>
                </div>
              </Card>

              <Button
                onClick={handleWithdraw}
                className="w-full rounded-none border-[3px] font-bold text-lg py-6 transition-all duration-300 hover:scale-105 hover:-translate-y-1"
                style={{
                  backgroundColor: BRAND,
                  color: INK,
                  borderColor: INK,
                  boxShadow: `4px 4px 0 0 ${INK}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `6px 6px 0 0 ${INK}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = `4px 4px 0 0 ${INK}`;
                }}
              >
                <Wallet className="size-5 mr-2" />
                Withdraw Funds
              </Button>
            </div>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  // Landing Page View
  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <main>
        {/* Hero Section */}
        <section className="bg-white py-16">
          <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-12 text-center">
            <h1 className="text-4xl md:text-6xl font-black mb-4">
              Investment Opportunity with{" "}
              <span style={{ color: BRAND }}>Topmost Sourcing</span>
            </h1>
            <p className="text-xl md:text-2xl font-medium text-gray-600 max-w-3xl mx-auto">
              Empowering Our Business, Empowering Your Returns
            </p>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-12 py-8">
          {/* Top Information Cards */}
          <section className="mb-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-8 rounded-none border-[3px] border-black shadow-[4px_4px_0_0_#0F0F0F]">
                <div className="text-center">
                  <TrendingUp
                    className="size-12 mx-auto mb-4"
                    style={{ color: BRAND }}
                  />
                  <h3 className="text-xl font-black mb-4">Annual Returns</h3>
                  <p className="font-medium mb-4">
                    Investors benefit from consistent{" "}
                    <strong>16–20% annual returns</strong> with a 1-year
                    investment.
                  </p>
                  <p className="font-medium text-gray-600">
                    Our proven fashion sourcing and resale network ensures
                    stability and long-term profitability.
                  </p>
                </div>
              </Card>

              <Card className="p-8 rounded-none border-[3px] border-black shadow-[4px_4px_0_0_#0F0F0F]">
                <div className="text-center">
                  <BarChart3
                    className="size-12 mx-auto mb-4"
                    style={{ color: BRAND }}
                  />
                  <h3 className="text-xl font-black mb-4">Business Growth</h3>
                  <p className="font-medium mb-4">
                    Topmost Sourcing has achieved{" "}
                    <strong>18% year-on-year growth</strong>.
                  </p>
                  <p className="font-medium text-gray-600">
                    Ability to scale operations while adapting to global textile
                    market trends.
                  </p>
                </div>
              </Card>

              <Card className="p-8 rounded-none border-[3px] border-black shadow-[4px_4px_0_0_#0F0F0F]">
                <div className="text-center">
                  <DollarSign
                    className="size-12 mx-auto mb-4"
                    style={{ color: BRAND }}
                  />
                  <h3 className="text-xl font-black mb-4">Financial Profile</h3>
                  <p className="font-medium mb-4">
                    Maintained a <strong>27% profit margin</strong> last year.
                  </p>
                  <p className="font-medium text-gray-600">
                    Supported by a lean cost structure and reinvestment in
                    technology & operations.
                  </p>
                </div>
              </Card>
            </div>
          </section>

          {/* Market Opportunities */}
          <section className="mb-16">
            <Card className="p-8 rounded-none border-[3px] border-black shadow-[4px_4px_0_0_#0F0F0F]">
              <h2 className="text-3xl font-black mb-6 text-center">
                Expanding Market Opportunities
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <h3
                    className="text-xl font-black mb-3"
                    style={{ color: BRAND }}
                  >
                    $47+ Billion
                  </h3>
                  <p className="font-medium">
                    Positioned in the Bangladeshi RMG sector
                  </p>
                </div>
                <div>
                  <h3
                    className="text-xl font-black mb-3"
                    style={{ color: BRAND }}
                  >
                    Africa Expansion
                  </h3>
                  <p className="font-medium">
                    Serving Africa's growing demand for affordable apparel
                  </p>
                </div>
                <div>
                  <h3
                    className="text-xl font-black mb-3"
                    style={{ color: BRAND }}
                  >
                    Southeast Asia
                  </h3>
                  <p className="font-medium">
                    Future expansion ensures further growth opportunities
                  </p>
                </div>
              </div>
            </Card>
          </section>

          {/* Global Industry Potential */}
          <section className="mb-16">
            <Card className="p-8 rounded-none border-[3px] border-black shadow-[4px_4px_0_0_#0F0F0F]">
              <h2 className="text-3xl font-black mb-6 text-center">
                Global Industry Potential
              </h2>
              <div className="text-center max-w-4xl mx-auto">
                <p className="text-lg font-medium mb-4">
                  The global apparel market is valued at{" "}
                  <strong style={{ color: BRAND }}>$1.7 trillion</strong>,
                  growing at <strong>4–5% annually</strong>.
                </p>
                <p className="text-lg font-medium">
                  By aligning with sustainability and circular economy trends,
                  Topmost Sourcing is ready to capture a significant share.
                </p>
              </div>
            </Card>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Create Investor Account */}
            <Card className="p-8 rounded-none border-[3px] border-black shadow-[4px_4px_0_0_#0F0F0F]">
              <h2 className="text-2xl font-black mb-6">
                Create Investor Account
              </h2>
              <form onSubmit={handleSignup} className="space-y-6">
                <div>
                  <Label
                    htmlFor="fullName"
                    className="text-sm font-bold uppercase"
                  >
                    Full Name (Required)
                  </Label>
                  <Input
                    id="fullName"
                    value={signupForm.name}
                    onChange={(e) =>
                      setSignupForm({ ...signupForm, name: e.target.value })
                    }
                    className="mt-2 rounded-none border-[3px] border-black font-medium"
                    required
                  />
                </div>
                <div>
                  <Label
                    htmlFor="phone"
                    className="text-sm font-bold uppercase"
                  >
                    Phone Number (Required)
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={signupForm.phone}
                    onChange={(e) =>
                      setSignupForm({ ...signupForm, phone: e.target.value })
                    }
                    className="mt-2 rounded-none border-[3px] border-black font-medium"
                    required
                  />
                </div>
                <div>
                  <Label
                    htmlFor="email"
                    className="text-sm font-bold uppercase"
                  >
                    Email (Required)
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={signupForm.email}
                    onChange={(e) =>
                      setSignupForm({ ...signupForm, email: e.target.value })
                    }
                    className="mt-2 rounded-none border-[3px] border-black font-medium"
                    required
                  />
                </div>
                <div>
                  <Label
                    htmlFor="investmentAmount"
                    className="text-sm font-bold uppercase"
                  >
                    Investment Amount
                  </Label>
                  <Select
                    value={signupForm.investRange}
                    onValueChange={(value) =>
                      setSignupForm({ ...signupForm, investRange: value })
                    }
                  >
                    <SelectTrigger className="mt-2 rounded-none border-[3px] border-black font-medium">
                      <SelectValue placeholder="Select investment amount" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="50000-100000">
                        50,000 - 100,000
                      </SelectItem>
                      <SelectItem value="100000-200000">
                        100,000 - 200,000
                      </SelectItem>
                      <SelectItem value="200000-300000">
                        200,000 - 300,000
                      </SelectItem>
                      <SelectItem value="300000-400000">
                        300,000 - 400,000
                      </SelectItem>
                      <SelectItem value="400000-500000">
                        400,000 - 500,000
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label
                    htmlFor="investmentPeriod"
                    className="text-sm font-bold uppercase"
                  >
                    Investment Period
                  </Label>
                  <Select
                    value={signupForm.investPeriod}
                    onValueChange={(value) =>
                      setSignupForm({ ...signupForm, investPeriod: value })
                    }
                  >
                    <SelectTrigger className="mt-2 rounded-none border-[3px] border-black font-medium">
                      <SelectValue placeholder="Select investment period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6months">6 Months</SelectItem>
                      <SelectItem value="1year">1 Year</SelectItem>
                      <SelectItem value="2years">2 Years</SelectItem>
                      <SelectItem value="3years">3 Years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="agreeTerms"
                    checked={signupForm.agreeTerms}
                    onCheckedChange={(checked) =>
                      setSignupForm({
                        ...signupForm,
                        agreeTerms: checked as boolean,
                      })
                    }
                    className="rounded-none border-[2px] border-black"
                  />
                  <Label htmlFor="agreeTerms" className="text-sm font-medium">
                    I agree to the Terms & Conditions
                  </Label>
                  <Button
                    type="button"
                    onClick={() => setShowTermsModal(true)}
                    className="ml-2 text-xs px-3 py-1 rounded-none border-[2px] font-bold hover:scale-105 transition-transform"
                    style={{
                      backgroundColor: BRAND,
                      color: INK,
                      borderColor: INK,
                    }}
                  >
                    Terms & Conditions
                  </Button>
                </div>
                <Button
                  type="submit"
                  disabled={!signupForm.agreeTerms}
                  className="w-full rounded-none border-[3px] font-bold text-lg py-6 transition-all duration-300 hover:scale-105 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: BRAND,
                    color: INK,
                    borderColor: INK,
                    boxShadow: `4px 4px 0 0 ${INK}`,
                  }}
                  onMouseEnter={(e) => {
                    if (!signupForm.agreeTerms) return;
                    e.currentTarget.style.boxShadow = `6px 6px 0 0 ${INK}`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = `4px 4px 0 0 ${INK}`;
                  }}
                >
                  Become an Investor
                </Button>
              </form>
            </Card>

            {/* ROI Calculator */}
            <Card className="p-8 rounded-none border-[3px] border-black shadow-[4px_4px_0_0_#0F0F0F]">
              <h2 className="text-2xl font-black mb-6 flex items-center">
                <Calculator className="size-6 mr-2" />
                ROI Calculator
              </h2>
              <div className="space-y-6">
                <div>
                  <Label
                    htmlFor="calcAmount"
                    className="text-sm font-bold uppercase"
                  >
                    Investment Amount (BDT)
                  </Label>
                  <Input
                    id="calcAmount"
                    type="number"
                    value={roiCalculator.amount}
                    onChange={(e) =>
                      setRoiCalculator({
                        ...roiCalculator,
                        amount: e.target.value,
                      })
                    }
                    className="mt-2 rounded-none border-[3px] border-black font-medium"
                    placeholder="100000"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="calcROI"
                    className="text-sm font-bold uppercase"
                  >
                    Annual ROI (%)
                  </Label>
                  <p className="w-full p-1 border-3 border-black mt-2 px-3">
                    {roiCalculator.roi}
                  </p>
                </div>
                <div>
                  <Label
                    htmlFor="calcYears"
                    className="text-sm font-bold uppercase"
                  >
                    Time (Years)
                  </Label>
                  <Select
                    value={roiCalculator.years}
                    onValueChange={(value) =>
                      setRoiCalculator({ ...roiCalculator, years: value })
                    }
                  >
                    <SelectTrigger className="mt-2 rounded-none border-[3px] border-black font-medium">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.5">0.5 Years</SelectItem>
                      <SelectItem value="1">1 Year</SelectItem>
                      <SelectItem value="2">2 Years</SelectItem>
                      <SelectItem value="3">3 Years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-gray-50 p-6 rounded-none border-[3px] border-black">
                  <h3 className="text-lg font-black mb-4">
                    Calculation Result
                  </h3>
                  <div className="space-y-2">
                    <p className="font-medium">
                      <span className="text-gray-600">Investment:</span>{" "}
                      {roiCalculator.amount
                        ? `${Number.parseFloat(
                            roiCalculator.amount
                          ).toLocaleString()} BDT`
                        : "0 BDT"}
                    </p>
                    <p className="font-medium">
                      <span className="text-gray-600">Returns:</span>{" "}
                      {roiCalculator.amount
                        ? `${(
                            Number.parseFloat(roiCalculator.amount) *
                            (roiCalculator.roi / 100) *
                            Number.parseFloat(roiCalculator.years)
                          ).toLocaleString()} BDT`
                        : "0 BDT"}
                    </p>
                    <div className="border-t-2 border-black pt-2">
                      <p
                        className="text-xl font-black"
                        style={{ color: BRAND }}
                      >
                        Total Return:{" "}
                        {roiCalculator.amount
                          ? `${calculateROI().toLocaleString()} BDT`
                          : "0 BDT"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-none border-[2px] border-blue-600">
                  <h4 className="font-black mb-2">Example:</h4>
                  <p className="text-sm font-medium">
                    If 100,000 BDT invested for 1 year @ {roiCalculator.roi}% →
                    Return = 118,000 BDT
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Login Section */}
          <section>
            <Card className="p-8 rounded-none border-[3px] border-black shadow-[4px_4px_0_0_#0F0F0F] max-w-md mx-auto">
              <h2 className="text-2xl font-black mb-6 text-center">
                Existing Investor Login
              </h2>
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <Label
                    htmlFor="phoneNumber"
                    className="text-sm font-bold uppercase"
                  >
                    Phone Number
                  </Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={loginForm.phone}
                    onChange={(e) =>
                      setLoginForm({
                        ...loginForm,
                        phone: e.target.value,
                      })
                    }
                    className="mt-2 rounded-none border-[3px] border-black font-medium"
                    placeholder="+880 1234 567890"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="otp" className="text-sm font-bold uppercase">
                    OTP (One Time Password)
                  </Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="otp"
                      type="text"
                      value={loginForm.otp}
                      onChange={(e) =>
                        setLoginForm({ ...loginForm, otp: e.target.value })
                      }
                      className="rounded-none border-[3px] border-black font-medium"
                      placeholder="Enter 6-digit OTP"
                      maxLength={6}
                      disabled={!otpSent}
                      required
                    />
                    <Button
                      type="button"
                      onClick={handleSendOTP}
                      disabled={!loginForm.phone || otpSent}
                      className="rounded-none border-[3px] font-bold px-4 whitespace-nowrap"
                      style={{
                        backgroundColor: otpSent ? "#gray" : BRAND,
                        color: INK,
                        borderColor: INK,
                        boxShadow: `2px 2px 0 0 ${INK}`,
                      }}
                    >
                      {otpSent ? "OTP Sent" : "Send OTP"}
                    </Button>
                  </div>
                  {otpSent && (
                    <p
                      className="text-sm font-medium mt-2"
                      style={{ color: BRAND }}
                    >
                      OTP sent to {loginForm.phone}. Check your SMS.
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="text-sm font-bold hover:underline"
                    style={{ color: BRAND }}
                  >
                    Resend OTP?
                  </button>
                </div>
                <Button
                  type="submit"
                  disabled={!otpSent || !loginForm.otp}
                  className="w-full rounded-none border-[3px] font-bold text-lg py-6 transition-all duration-300 hover:scale-105 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: BRAND,
                    color: INK,
                    borderColor: INK,
                    boxShadow: `4px 4px 0 0 ${INK}`,
                  }}
                  onMouseEnter={(e) => {
                    if (otpSent && loginForm.otp) {
                      e.currentTarget.style.boxShadow = `6px 6px 0 0 ${INK}`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = `4px 4px 0 0 ${INK}`;
                  }}
                >
                  Verify OTP & Login
                </Button>
              </form>
            </Card>
          </section>
        </div>
      </main>
      <SiteFooter />

      {/* Terms & Conditions Modal */}
      {showTermsModal && <TermsModal />}
    </div>
  );
}
