import { Button } from "@/components/ui/button";
import { features, testimonials } from "@/constants";
import { useEffect, useState } from "react";
import {
  FaCss3,
  FaExclamationCircle,
  FaHtml5,
  FaRegStar,
  FaStar,
} from "react-icons/fa";
import { IoLogoJavascript } from "react-icons/io5";
import {
  MdChevronLeft,
  MdChevronRight,
  MdOutlineCreateNewFolder,
} from "react-icons/md";
import { VscNewFile } from "react-icons/vsc";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-primary/15 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)] z-0" />
        <div className="container mx-auto relative z-10">
          <div className="flex flex-col  items-center text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Code Anywhere, Anytime with CodeIDE
            </h1>
            <p className="mt-6 text-xl text-muted-foreground">
              A modern, full-stack cloud-based integrated development
              environment that allows you to write, run, and share code from
              anywhere.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row w-full sm:w-auto gap-4">
              <Button asChild className="w-full sm:w-auto">
                <Link to="/register" className="w-full sm:w-auto">
                  Get Started for Free
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link to="/templates">Explore Templates</Link>
              </Button>
            </div>
          </div>
          <div className="mt-16 md:mt-24 relative">
            <div className="bg-card shadow-xl border rounded-lg overflow-hidden">
              <div className="bg-muted p-2 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="bg-red-500 rounded-full size-3" />
                  <div className="bg-yellow-500 rounded-full size-3" />
                  <div className="bg-green-500 rounded-full size-3" />
                </div>
                <div className="bg-background/70 text-xs font-mono rounded flex-1 py-1 px-1">
                  codeide.com/editor/project-123
                </div>
              </div>
              <div className="grid grid-cols-12 h-[400px]">
                <div className="col-span-3 bg-muted/50 border-r px-2">
                  <div className="text-sm font-medium mb-2 flex justify-between items-center">
                    <p>Files</p>
                    <div className="flex gap-2 mr-2">
                      <VscNewFile className="cursor-pointer" />
                      <MdOutlineCreateNewFolder className="cursor-pointer" />
                    </div>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="px-2 py-1 flex items-center gap-1 rounded bg-accent text-accent-foreground">
                      <FaHtml5 className="text-red-600" />
                      <p>index.html</p>
                    </div>
                    <div className="px-2 py-1 flex items-center gap-1 rounded hover:bg-accent/50 cursor-pointer">
                      <FaCss3 className="text-blue-500" />
                      <p>style.css</p>
                    </div>
                    <div className="px-2 py-1 flex items-center gap-1 rounded hover:bg-accent/50 cursor-pointer">
                      <IoLogoJavascript className="text-yellow-400" />
                      <p>script.js</p>
                    </div>
                    <div className="px-2 py-1 flex items-center  gap-1 rounded hover:bg-accent/50 cursor-pointer">
                      <FaExclamationCircle className="text-[#00BCD4]" />
                      <p>Readme.md</p>
                    </div>
                  </div>
                </div>
                <div className="col-span-9 p-4 bg-card text-sm overflow-hidden font-mono">
                  <pre className="text-xs md:text-sm font-mono">
                    <code>
                      {`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>CodeIDE Project</title>
<link rel="stylesheet" href="styles.css">
</head>
<body>
<div class="container">
  <h1>Welcome to CodeIDE</h1>
  <p>Start coding in the cloud today!</p>
  <button id="start-btn">Get Started</button>
</div>
<script src="script.js"></script>
</body>
</html>`}
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold">
              Powerful Features for Developers
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Everything you need to code efficiently in one place
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => {
              return (
                <div key={feature.id} className="bg-card rounded-lg p-6 border">
                  <div className="size-12 rounded-full flex justify-center items-center  bg-primary/10 mb-4">
                    {feature.icon && (
                      <feature.icon className="size-6 text-primary" />
                    )}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section  */}
      <section className="py-20 bg-background">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold">What Our Users Say</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join thousands of developers who love CodeIDE
            </p>
          </div>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentTestimonial * 100}%)`,
              }}
            >
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="w-full flex-shrink-0 px-4 bg-primary/10 [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]"
                >
                  <div className=" border rounded-lg p-8 text-center">
                    <div className="flex items-center justify-center size-20 mb-6 mx-auto ">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="size-full object-cover rounded-full"
                      />
                    </div>
                    <div className="flex items-center justify-center mb-4">
                      {[...Array(5)].map((_, i) =>
                        i < testimonial.rating ? (
                          <FaStar key={i} className="text-yellow-500" />
                        ) : (
                          <FaRegStar key={i} className="text-gray-300" />
                        )
                      )}
                    </div>
                    <blockquote className="text-lg mb-6">
                      {testimonial.content}
                    </blockquote>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={prevTestimonial}
              className="absolute top-1/2 -left-2 -translate-y-1/2 bg-background rounded-full p-2 shadow-md hover:bg-muted"
            >
              <MdChevronLeft className="size-6" />
            </button>
            <button
              onClick={nextTestimonial}
              className="absolute top-1/2 -right-2 -translate-y-1/2 bg-background rounded-full p-2 shadow-md hover:bg-muted"
            >
              <MdChevronRight className="size-6" />
            </button>

            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentTestimonial(index);
                  }}
                  className={`size-3 rounded-full   ${index === currentTestimonial ? "bg-primary" : "bg-muted"}`}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/80 to-primary/90 text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold">
            Ready to Start Coding in the Cloud?
          </h2>
          <p className="mt-4 text-xl max-w-2xl mx-auto">
            Join thousands of developers who trust CloudIDE for their coding
            needs.
          </p>
          <div className="mt-10">
            <Button asChild variant="secondary">
              <Link to="/register">Get Started for Frees</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
