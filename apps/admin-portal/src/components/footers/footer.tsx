export default function Footer() {
  return (
    <div className="footer bg-primary text-white" data-testid="footer">
      <div className="container py-5">
        <p className="text-center" data-testid="content">
          Designed and built with ❤️ by&nbsp;
          <a className="text-white" href="#" target="_blank" rel="noreferrer" data-testid="link">
            Ammodesk
          </a>
        </p>
      </div>
    </div>
  );
}
