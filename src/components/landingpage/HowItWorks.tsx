import { ArrowRight } from "lucide-react";
 

type Step = {
  title: string;
  description: string;
  image: string;
  alt: string;
};

const HowItWorks = () => {
  const steps: Step[] = [
    {
      title: "Create",
      description:
        "Build surveys in minutes with a clean builder. Add questions, customize design, and set branching logic without writing code.",
      image:
        "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800",
      alt: "Person working on a creative project outdoors",
    },
    {
      title: "Share",
      description:
        "Send a survey link, embed it on your site, or share it with the right audience. Collect feedback wherever your users already are.",
      image:
        "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800",
      alt: "Person focused on laptop in a studio",
    },
    {
      title: "Understand",
      description:
        "Go beyond answers. See patterns in responses, hesitation, drop-offs, time spent, and behavior signals that reveal what users really mean.",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800",
      alt: "Woman observing feedback and insights",
    },
  ];

  return (
    <section className="how-section">
      <div className="how-container">
        {/* Header */}
        <div className="how-header">
          

          <h2 className="how-title">
         How feedback becomes insight
          </h2>

          <p className="how-subtitle">
            Create, share, and understand feedback in one seamless flow.
          </p>
        </div>

        {/* Steps */}
        <div className="how-grid">
          {steps.map((step, index) => (
            <div className="how-card" key={step.title}>
              {/* Number badge */}
              <div className="how-step-number">{index + 1}</div>

              {/* Image */}
              <div className="how-image-wrap">
                <img className="how-image" src={step.image} alt={step.alt} />
              </div>

              {/* Text */}
              <h3 className="how-step-title">{step.title}</h3>

              <p className="how-step-description">{step.description}</p>
            </div>
          ))}
        </div>

        
        
      </div>
    </section>
  );
};

export default HowItWorks;
