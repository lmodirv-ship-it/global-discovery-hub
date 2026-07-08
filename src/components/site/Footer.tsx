export function Footer() {
  return (
    <footer className="mt-32 border-t border-white/5 py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground font-black">HN</div>
            <div>
              <p className="font-display text-base font-bold">HN Studio</p>
              <p className="text-xs text-muted-foreground">99 موقعاً · رؤية واحدة</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} HN Group. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
}
