import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FAQs, PRICING_PLANS } from "@/constants";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { FaRegCircleCheck } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";

const PricingPage = () => {
  const [billingInterval, setBillingInterval] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const navigate = useNavigate();

  const handleSubscribe = (planId: string) => {
    navigate(`/dashboard/subscription?plan=${planId}`);
  };

  return (
    <div className="container py-12 mx-auto ">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl mb-4 font-bold">Simple, Transparent Pricing</h1>
        <p className="text-lg text-muted-foreground">
          Choose the plan that's right for you and start building amazing
          projects with CloudIDE.
        </p>
      </div>
      <div className="flex justify-center mb-8">
        <Tabs
          defaultValue="monthly"
          value={billingInterval}
          onValueChange={(value) =>
            setBillingInterval(value as "monthly" | "yearly")
          }
          className="w-full max-w-md"
        >
          <TabsList className="grid  grid-cols-2">
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">
              Yearly{" "}
              <span className="ml-1.5 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                Save 20%
              </span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {PRICING_PLANS.map((plan) => {
          const price: string =
            billingInterval === "yearly"
              ? (plan.price * 0.8 * 12).toFixed(2)
              : plan.price.toFixed(2);
          const isCurrentPlan: boolean = false;

          return (
            <Card
              key={plan.id}
              className={cn(
                "flex flex-col overflow-hidden",
                plan.isPopular && "border-primary shadow-md"
              )}
            >
              {plan.isPopular && (
                <div className="bg-primary text-primary-foreground text-center py-1 text-sm font-medium ">
                  Most Popular
                </div>
              )}

              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="flex-1">
                <div className="mb-4">
                  <span className="text-4xl font-bold">${price}</span>
                  <span className="text-muted-foreground ml-1">
                    {billingInterval === "monthly" ? "/month" : "/year"}
                  </span>
                </div>

                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <FaRegCircleCheck className="size-4 text-primary  mr-2 " />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                {isCurrentPlan ? (
                  <Button className="w-full" variant="outline" disabled>
                    Current Plan
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() => handleSubscribe(plan.id)}
                    variant={plan.isPopular ? "default" : "outline"}
                  >
                    {plan.price === 0 ? "Get Started" : "Subscribe"}
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto mt-20">
        <h2 className="text-2xl font-bold text-center mb-8">
          Frequently Asked Questions
        </h2>

        {FAQs.map((faq) => (
          <Accordion key={faq.id} type="single" collapsible className="w-full">
            <AccordionItem
              value={`item-${faq.id}`}
              className="bg-card rounded-lg border px-6 py-2 mb-4 shadow-sm"
            >
              <AccordionTrigger className="text-lg font-medium mb-2 flex items-center hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>

      {/* Call To Action */}
      <div className="my-20 text-center max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">
          Ready to start coding in the CodeIDE?
        </h2>
        <p className="text-muted-foreground mb-8">
          Join thousands of developers who are already using CodeIDE to build
          amazing projects.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link to="/register">Get Started for Free</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/templates">Explore Templates</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
