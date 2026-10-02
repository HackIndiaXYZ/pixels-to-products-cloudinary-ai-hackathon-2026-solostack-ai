function AlertIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 8v5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M12 16.5v.01"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M10.3 4.2 3.2 17a2 2 0 0 0 1.75 3h14.1a2 2 0 0 0 1.75-3L13.7 4.2a1.94 1.94 0 0 0-3.4 0Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const problems = [
  {
    title: "Heavy product images",
    description:
      "Large original files can increase page weight and slow down the shopping experience.",
  },
  {
    title: "Inconsistent media",
    description:
      "Different dimensions, formats and quality levels make product catalogs difficult to maintain.",
  },
  {
    title: "Manual organization",
    description:
      "Teams can spend unnecessary time naming, categorizing and searching through media assets.",
  },
];

export default function Problem() {
  return (
    <section className="section">
      <div className="container">
        <div className="problem-grid">
          <div>
            <span className="section-label">The problem</span>

            <h2 className="section-title">
              Product media gets messy fast.
            </h2>

            <p className="section-description">
              Small businesses often manage thousands of product images without
              a dedicated media engineering team. MediaGuard turns that manual
              work into an automated pipeline.
            </p>
          </div>

          <div className="problem-list">
            {problems.map((problem) => (
              <div className="problem-item" key={problem.title}>
                <div className="problem-icon">
                  <AlertIcon />
                </div>

                <div>
                  <h3>{problem.title}</h3>
                  <p>{problem.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}