import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IconSend2, IconMusic } from "@tabler/icons-react";

export default function AppPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div className="relative flex h-full flex-col items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-2xl space-y-10">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-secondary text-primary">
                  <IconMusic size={20} />
                </div>
                <CardTitle className="text-xl font-semibold">
                  How are you feeling today?
                </CardTitle>
              </div>
              <CardDescription className="text-base">
                Type anything from a specific mood to your current surroundings.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Textarea
                placeholder="I'm sipping coffee on a rainy Tuesday, feeling productive yet nostalgic..."
                className="min-h-45 text-lg leading-relaxed bg-background/50 border-muted-foreground/20 focus-visible:ring-primary/50 transition-all resize-none p-5 rounded-xl"
              />
            </CardContent>

            <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-8 px-6">
              <p className="text-xs text-muted-foreground italic">
                Try: &ldquo;Sunset drive on a highway&rdquo; or
                &ldquo;Post-workout energy&rdquo;
              </p>
              <Button
                size="lg"
                className="w-full sm:w-auto px-8 font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95 bg-linear-to-r from-primary to-primary/90"
              >
                Generate Playlist
                <IconSend2 className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
