export default function BeforeAfter() {
  return (
    <section className="section">
      <div className="container">
        <span className="section-label">Optimization in action</span>

        <h2 className="section-title">
          Less weight. Better delivery.
        </h2>

        <p className="section-description">
          MediaGuard prepares product assets for modern web experiences while
          preserving the original media.
        </p>

        <div className="before-after-grid">
          <div className="comparison-card">
            <div className="comparison-header">
              <span>Original asset</span>
              <span className="comparison-size">3.8 MB</span>
            </div>

            <div className="comparison-image">
              <div className="demo-product" />
            </div>

            <div className="comparison-footer">
              <span>JPEG · 4000 × 4000</span>
              <span>Original</span>
            </div>
          </div>

          <div className="comparison-card optimized">
            <div className="comparison-header">
              <span>Optimized asset</span>
              <span className="comparison-size">680 KB</span>
            </div>

            <div className="comparison-image">
              <div className="demo-product" />
            </div>

            <div className="comparison-footer">
              <span>Web-ready · 1200 × 1200</span>
              <span className="saving">82% smaller</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}