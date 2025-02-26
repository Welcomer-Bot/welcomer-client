"use client";

import { Button, Card, CardBody } from "@heroui/react";
import { FaCheckCircle, FaClock, FaMailBulk, FaShieldAlt, FaStar } from "react-icons/fa";
import { ImWarning } from "react-icons/im";

export default function WelcomerBetaLanding() {
  return (
    <div className="h-full w-full bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="py-20 text-center align-middle justify-center px-6">
        <h1 className="text-4xl font-bold">
          🚀 Join the Welcomer Beta Program!
        </h1>
        <p className="text-lg mt-4">
          Be the first to test new features and receive{" "}
          <strong>Welcomer Premium for life</strong>!
        </p>
        <Button className="mt-6 px-6 py-3 text-lg bg-blue-600 hover:bg-blue-700">
          Join the Beta
        </Button>
      </section>

      {/* Why Join the Beta? */}
      <section className="py-20 px-6 bg-gray-800 text-center">
        <h2 className="text-3xl font-bold">Why Join the Beta?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {advantages.map((adv, index) => (
            <Card key={index} className="bg-gray-700 p-6">
              <CardBody className="flex flex-col items-center">
                {adv.icon}
                <h3 className="text-xl font-semibold mt-4">{adv.title}</h3>
                <p className="mt-2 text-gray-300">{adv.description}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 text-center">
        <h2 className="text-3xl font-bold">Exclusive Beta Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-gray-700 p-6">
              <CardBody className="flex flex-col items-center">
                {feature.icon}
                <h3 className="text-xl font-semibold mt-4">{feature.title}</h3>
                <p className="mt-2 text-gray-300">{feature.description}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      {/* How to Join? */}
      <section className="py-20 px-6 text-center">
        <h2 className="text-3xl font-bold">
          How to Join the Beta in 3 Simple Steps?
        </h2>
        <ol className="mt-6 space-y-4">
          <li>
            ✅ Ensure your server meets the requirements (200+ members, active,
            no NSFW content).
          </li>
          <li>✅ Sign up using the form.</li>
          <li>✅ Get access and start testing!</li>
        </ol>
        <Button className="mt-6 px-6 py-3 text-lg bg-green-600 hover:bg-green-700">
          Sign Up Now
        </Button>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-gray-800 text-center">
        <h2 className="text-3xl font-bold">What Our Testers Say 🚀</h2>
        <div className="mt-8 space-y-6">
          <div className="text-lg italic">
            &quot;Welcomer completely transformed my server’s onboarding! The
            beta is amazing. 👏&quot; – User123
          </div>
          <div className="text-lg italic">
            &quot;Super smooth, easy to use, and packed with new options!
            😍&quot; – ServerOwnerX
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 text-center">
        <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
        <div className="mt-6 space-y-4">
          <p>
            <strong>❓ Can I leave the beta anytime?</strong> ✅ Yes, you can
            remove the bot whenever you want.
          </p>
          <p>
            <strong>❓ Are there any risks?</strong> ✅ No, but some features
            may be unstable.
          </p>
          <p>
            <strong>❓ When will the final version be released?</strong> ✅ We
            are actively working on it, stay tuned!
          </p>
        </div>
      </section>
    </div>
  );
}

const advantages = [
  {
    title: "Exclusive Access",
    description: "Try new features before anyone else.",
    icon: <FaStar className="h-10 w-10 text-yellow-500" />,
  },
  {
    title: "Lifetime Premium",
    description: "Get Welcomer Premium for free as a tester.",
    icon: <FaCheckCircle className="h-10 w-10 text-green-500" />,
  },
  {
    title: "Help Improve the Bot",
    description: "Provide feedback and shape Welcomer's future.",
    icon: <ImWarning className="h-10 w-10 text-red-500" />,
  },
];

const features = [
  {
    title: "Advanced Message Customization",
    description: "Edit messages more efficiently using the new dashboard.",
    icon: <FaMailBulk className="h-10 w-10 text-blue-500" />,
  },
  {
    title: "Optimized Performance",
    description: "Faster processing and lower latency.",
    icon: <FaClock className="h-10 w-10 text-purple-500" />,
  },
  {
    title: "Smarter User Detection",
    description: "Improved tracking for a better welcome experience.",
    icon: <FaShieldAlt className="h-10 w-10 text-teal-500" />,
  },
];
