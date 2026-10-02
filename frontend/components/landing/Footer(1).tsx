export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <div className="footer-copy">
            © {new Date().getFullYear()} MediaGuard AI. Built for Pixels to
            Products.
          </div>

          <div className="footer-links">
            <a href="#features" className="footer-link">
              Features
            </a>

            <a href="#how-it-works" className="footer-link">
              How it works
            </a>

            <a href="#cloudinary" className="footer-link">
              Cloudinary
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}