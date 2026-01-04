"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { getHistory } from "@/lib/history-utils";
import { PlaylistResults } from "@/components/playlist-results";
import { Button } from "@/components/ui/button";
import { IconArrowLeft, IconAlertCircle } from "@tabler/icons-react";
import { Spinner } from "@/components/ui/spinner";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function HistoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const item = useMemo(() => {
    const history = getHistory();
    return history.find((i) => i.id === params.id);
  }, [params.id]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader className="space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <IconAlertCircle className="h-6 w-6 text-destructive" />
            </div>

            <CardTitle>Item not found</CardTitle>
            <CardDescription>
              The item you are looking for does not exist or may have been
              removed.
            </CardDescription>
          </CardHeader>

          <CardFooter className="flex justify-center w-full">
            <Button
              onClick={() => router.push("/app/history")}
              className={"w-full cursor-pointer"}
            >
              Back to History
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="mb-6 flex justify-center">
        <Button
          variant="secondary"
          onClick={() => router.push("/app/history")}
          className="gap-2 cursor-pointer"
        >
          <IconArrowLeft size="20" />
          Back to History List
        </Button>
      </div>
      <PlaylistResults result={item} onReset={() => router.push("/app")} />
    </div>
  );
}
