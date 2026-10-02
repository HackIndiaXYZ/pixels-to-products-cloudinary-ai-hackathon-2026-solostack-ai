function UploadIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 16V4M7 9l5-5 5 5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 16v3a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function OptimizeIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TransformIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="m8 15 3-3 2 2 2-3 2 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <path
        d="m5 12 4 4L19 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const steps = [
  {
    number: "01",
    icon: <UploadIcon />,
    title: "Upload",
    description: "Send your original product media.",
  },
  {
    number: "02",
    icon: <SparkIcon />,
    title: "Analyze",
    description: "AI understands the image and its content.",
  },
  {
    number: "03",
    icon: <OptimizeIcon />,
    title: "Optimize",
    description: "Improve size, quality and format.",
  },
  {
    number: "04",
    icon: <TransformIcon />,
    title: "Transform",
    description: "Create dimensions for different surfaces.",
  },
  {
    number: "05",
    icon: <CheckIcon />,
    title: "Deliver",
    description: "Serve a fast, web-ready asset.",
  },
];

export default function Pipeline() {
  return (
    <section id="how-it-works" className="section pipeline-section">
      <div className="container">
        <span className="section-label">How it works</span>

        <h2 className="section-title">
          One pipeline. Every media transformation.
        </h2>

        <p className="section-description">
          Upload once and let MediaGuard handle the repetitive work from
          analysis to delivery.
        </p>

        <div className="pipeline-flow">
          {steps.map((step) => (
            <div className="flow-item" key={step.number}>
              <div className="flow-number">{step.number}</div>

              <div className="flow-icon">{step.icon}</div>

              <h3>{step.title}</h3>

              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}