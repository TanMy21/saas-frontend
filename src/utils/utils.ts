import { BarChart3, Headphones, Shield, Smartphone, Users } from "lucide-react";

 

export const generateOptionLabel = (index: number, qType: string) => {
  if (qType === "RADIO" || qType === "MULTIPLE_CHOICE" || qType === "MEDIA") {
    return String.fromCharCode(65 + index);
  }
  return `${index + 1}`;
};

export const getSquareImageURL = (url: string) =>
  url.replace("/upload/", "/upload/w_250,h_250,c_fill,g_auto/");

export const features = [
  {
    id: 1,
    icon: BarChart3,
    title: "Real-time Analytics",
    description:
      "Get instant insights with our advanced analytics dashboard. Track performance metrics, user behavior, and business growth in real-time.",
    image:
      "https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: 2,
    icon: Users,
    title: "Team Collaboration",
    description:
      "Seamlessly collaborate with your team members. Share projects, assign tasks, and communicate effectively all in one place.",
    image:
      "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: 3,
    icon: Shield,
    title: "Advanced Security",
    description:
      "Enterprise-grade security with end-to-end encryption, multi-factor authentication, and regular security audits.",
    image:
      "https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: 4,
    icon: Smartphone,
    title: "Mobile Optimization",
    description:
      "Access your workspace anywhere with our fully responsive design and native mobile apps for iOS and Android.",
    image:
      "https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: 5,
    icon: Headphones,
    title: "24/7 Support",
    description:
      "Our dedicated support team is available round the clock to help you succeed. Get expert assistance whenever you need it.",
    image:
      "https://images.pexels.com/photos/7887807/pexels-photo-7887807.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
];