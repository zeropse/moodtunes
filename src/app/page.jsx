import { ModeToggle } from "@/style/mode-toggle";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main>
      <h1>Welcome to the Home Page</h1>
      <p>This is the main landing page of the application.</p>
      <ModeToggle />

      <Button>Click Me</Button>
    </main>
  );
}
