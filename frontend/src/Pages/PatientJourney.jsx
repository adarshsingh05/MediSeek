import { Globe, Smartphone, FileText, MessageCircle } from "lucide-react";

const steps = [
  {
    image: "/gd.webp", 
    text: "Patient submit there blood report at meediseek",
  },
  {
    image: "/gd2.webp",
    text: "Sample is processed automatically with AI",
  },
  {
    image: "/gd3.webp",
    text: "Smart report and dashboard is generated and deliverd to patient",
  },
  {
    image: "/gd4.webp",
    
    text: "QRcode + password protected",
  },
];

const deliveryMethods = [
  { icon: <Globe size={24} />,  label: "Web" },
  { icon: <Smartphone size={24} />, label: "Mobile" },
  { icon: <FileText size={24} />, label: "PDF" },
  { icon: <MessageCircle size={24} />, label: "SMS" },
];

export function PatientJourney() {
  return (
    <div className="bg-gray-100 py-10 px-5 text-center">
      <h2 className="text-3xl font-semibold font-mono text-gray-700 mb-6">
        workflow of a mediseek.ai
      </h2>
      <div className="flex justify-center gap-10 flex-wrap">
        {steps.map((step, index) => (
          <div key={index} className="text-center max-w-xs">
            <img src={step.image} alt="Step" className="w-56 h-48 mx-auto mb-4" />
            <p className="text-gray-600">{step.text}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-6 mt-8">
        {deliveryMethods.map((method, index) => (
          <div key={index} className="flex flex-col items-center text-[#842fed]">
            <div className="p-3 bg-white rounded-full shadow-md">{method.icon}</div>
            <p className="mt-2 text-sm">{method.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
