import React from "react";

const PlanCard = ({
  title,
  price,
  period = "/year",
  subtitle,
  features = [],
  bgClass = "bg-white",
  textClass = "text-black",
}) => (
  <div className={`rounded-lg shadow-lg p-8 flex-1 ${bgClass} ${textClass}`}>
    <h3 className="text-2xl font-semibold mb-2">{title}</h3>
    <div className="text-4xl font-extrabold mb-2 flex items-baseline gap-2">
      <span className="text-sm font-semibold">USD</span>
      <span>${price}</span>
      {period && (
        <span className="text-base font-medium text-gray-200 sm:text-gray-600">
          {period}
        </span>
      )}
    </div>
    {subtitle && <p className="text-sm mb-4 opacity-90">{subtitle}</p>}
    <ul className="mb-6 space-y-2 text-sm">
      {features.map((f, i) => (
        <li key={i} className="leading-relaxed">
          • {f}
        </li>
      ))}
    </ul>
    <button className="mt-auto px-6 py-2 rounded-full bg-amber-300 text-black font-semibold">
      Subscribe
    </button>
  </div>
);

const Plans = () => {
  const commonFeatures = [
    "Unlimited projects",
    "Exclusive 3d model library",
    "Automatic and downloadable bill of materials",
    "Online/offline support",
  ];

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center py-12 px-6">
      <div className="max-w-7xl w-full">
        <h1 className="text-4xl font-bold mb-8 text-center">Plans</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PlanCard
            title="Platinum"
            price="682"
            period="/year"
            subtitle="INCLUDES ONE YEAR DOME 7 LICENCE"
            features={[
              ...commonFeatures,
              "Up to 500 3d models upload",
              "500 4k rendering per year",
            ]}
            bgClass="bg-black text-white"
            textClass=""
          />

          <PlanCard
            title="Gold"
            price="3978"
            period="/year"
            subtitle="INCLUDES VR INTEGRATED LICENCE PLUS ONE YEAR DOME 7 LICENCE"
            features={[
              ...commonFeatures,
              "Unlimited 4k rendering",
              "Unlimited 720-degree tours",
              "Removable finest logo",
            ]}
            bgClass="bg-gradient-to-b from-yellow-400 to-amber-600 text-black"
            textClass=""
          />

          <PlanCard
            title="Diamond Ultra"
            price="Custom"
            period=""
            subtitle="CUSTOM LICENCE AND FEATURES"
            features={[
              "Custom integrations",
              "Priority support",
              "Dedicated account manager",
              "Tailored feature set",
            ]}
            bgClass="bg-white text-black border"
            textClass=""
          />
        </div>
      </div>
    </div>
  );
};

export default Plans;
