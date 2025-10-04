import Link from 'next/link';
import { Button } from './ui/button';
import { HelpDrawer } from './help-drawer';

export function CTAButtons() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button asChild>
        <Link href="/onboarding">Start onboarding</Link>
      </Button>
      <Button variant="outline" asChild>
        <Link href="/documents">View documents</Link>
      </Button>
      <HelpDrawer />
    </div>
  );
}
