"use client";

import { useEffect, useState } from "react";
import {
  getHistory,
  clearHistory,
  deleteHistoryItem,
} from "@/lib/history-utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  IconTrash,
  IconCalendar,
  IconMusic,
  IconClock,
  IconExternalLink,
} from "@tabler/icons-react";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadHistory = () => {
      setIsLoading(true);
      setHistory(getHistory());
      setIsLoading(false);
    };

    loadHistory();

    const handleHistoryUpdate = () => {
      setHistory(getHistory());
    };

    window.addEventListener("moodHistoryUpdated", handleHistoryUpdate);
    return () => {
      window.removeEventListener("moodHistoryUpdated", handleHistoryUpdate);
    };
  }, []);

  const handleClearHistory = () => {
    clearHistory();
  };

  const handleDeleteSingle = () => {
    if (deleteId) {
      deleteHistoryItem(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <IconCalendar className="h-8 w-8 text-primary" />
          History
        </h1>

        {!isLoading && history.length > 0 && (
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                className="gap-2 cursor-pointer"
              >
                <IconTrash size="16" />
                Clear All
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Clear History</DialogTitle>
                <DialogDescription>
                  This will permanently delete your entire mood history.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button variant="destructive" onClick={handleClearHistory}>
                    Clear All
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Loading state */}
      {isLoading && (
        <Card className="border-dashed">
          <CardContent className="flex items-center justify-center py-16">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Spinner />
              Loading history…
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty state */}
      {!isLoading && history.length === 0 && (
        <Card className="bg-secondary/20 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-4 rounded-full bg-secondary mb-4">
              <IconMusic className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No history yet</h3>
            <p className="text-muted-foreground max-w-sm mt-2">
              Start by generating a playlist based on your mood.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      {!isLoading && history.length > 0 && (
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Mood</TableHead>
                <TableHead>Playlist Size</TableHead>
                <TableHead className="w-20 text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {history.map((item) => (
                <TableRow
                  key={item.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="font-medium whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <IconCalendar
                        size={14}
                        className="text-muted-foreground"
                      />
                      {new Date(item.timestamp).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </TableCell>

                  <TableCell className="text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <IconClock size={14} />
                      {new Date(item.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize border border-primary/20">
                      {item.mood}
                    </span>
                  </TableCell>

                  <TableCell>
                    <span className="text-sm font-medium flex items-center gap-1.5">
                      <IconMusic size={14} className="text-muted-foreground" />
                      {item.tracks.length} tracks
                    </span>
                  </TableCell>

                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      {/* View playlist */}
                      <Button
                        asChild
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 text-primary"
                      >
                        <Link href={`/app/history/${item.id}`}>
                          <IconExternalLink size={16} />
                        </Link>
                      </Button>

                      {/* Delete */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="icon"
                            className="h-8 w-8 cursor-pointer"
                            onClick={() => setDeleteId(item.id)}
                          >
                            <IconTrash size={16} />
                          </Button>
                        </DialogTrigger>

                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete {item.mood}?</DialogTitle>
                            <DialogDescription>
                              This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <DialogClose asChild>
                              <Button
                                variant="destructive"
                                onClick={handleDeleteSingle}
                              >
                                Delete
                              </Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
