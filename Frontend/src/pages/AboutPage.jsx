export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16">
      <h1 className="font-serif text-4xl font-bold">About HomeTrust</h1>
      <p className="mt-3 text-base text-muted-foreground leading-relaxed">
        HomeTrust is a free, institutional-grade neighborhood intelligence and
        verified rental marketplace. We believe every renter deserves
        transparent livability data and scam-free listings — without paying a
        premium.
      </p>

      <div className="mt-10 space-y-10 text-sm leading-relaxed">
        <section id="contact">
          <h2 className="font-serif text-2xl font-semibold">Contact</h2>
          <p className="mt-2 text-muted-foreground">
            For partnerships, data questions or broker verification queries,
            write to us at{" "}
            <a
              className="font-semibold text-navy"
              href="mailto:hello@hometrust.demo"
            >
              hello@hometrust.demo
            </a>
            . We respond within one business day.
          </p>
        </section>
        <section id="privacy">
          <h2 className="font-serif text-2xl font-semibold">Privacy</h2>
          <p className="mt-2 text-muted-foreground">
            We collect only the minimum data required to operate the platform:
            your email and role. Reports are generated from aggregated public
            datasets. You can delete your account at any time from Profile &
            Settings.
          </p>
        </section>
        <section id="terms">
          <h2 className="font-serif text-2xl font-semibold">Terms</h2>
          <p className="mt-2 text-muted-foreground">
            HomeTrust is provided as a free demonstration. Data, badges and
            trust scores in this preview are simulated using mock data and
            should not be used for real-world financial decisions.
          </p>
        </section>
      </div>
    </div>
  );
}
