"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays,
  Calendar as CalendarIcon,
  Clock,
  Video,
  X,
  ArrowRight,
  Send,
} from "lucide-react";
import api from "@/lib/api";

interface EventItem {
  id: number;
  title: string;
  description: string;
  date: string | null;
  thumbnail_image_url: string | null;
  meeting_url: string | null;
  published: boolean;
  created_at: string;
}

const formatDate = (raw: string | null) => {
  if (!raw) return "Tanggal akan diumumkan";
  return new Date(raw).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const formatTime = (raw: string | null) => {
  if (!raw) return null;
  return new Date(raw).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const isUpcoming = (raw: string | null) => {
  if (!raw) return false;
  return new Date(raw).getTime() >= Date.now();
};

export default function EventsSection() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState<EventItem | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const response = await api.get("/events?limit=12");
        if (mounted && response.data.success) {
          setEvents(response.data.data);
        }
      } catch (error) {
        // silent fail on landing page
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (selected) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selected]);

  return (
    <section id="events" className="py-20 bg-light-50 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px]" />
      </div>

      <div className="container-app relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="badge badge-primary mb-4">Events</span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Jangan Lewatkan <span className="text-gradient">Event</span> Kami
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Workshop, webinar, dan kegiatan seru lainnya dari Codelab. Klik
            salah satu untuk lihat detailnya.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-72 rounded-2xl bg-white border border-light-200 animate-pulse"
              />
            ))}
          </div>
        ) : events.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-xl mx-auto text-center py-16 px-6 bg-white rounded-3xl border border-dashed border-light-300 shadow-card"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary mb-6">
              <CalendarDays className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Belum Ada Event
            </h3>
            <p className="text-gray-600">
              Saat ini belum ada event yang dijadwalkan. Pantau terus halaman
              ini untuk update terbaru dari Codelab!
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, index) => {
              const upcoming = isUpcoming(event.date);
              return (
                <motion.button
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -6 }}
                  onClick={() => setSelected(event)}
                  className="group text-left bg-white rounded-2xl overflow-hidden border border-light-200 shadow-card hover:shadow-glow-primary transition-all flex flex-col"
                >
                  {/* Banner */}
                  <div className="relative h-44 bg-gradient-primary overflow-hidden">
                    {event.thumbnail_image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={event.thumbnail_image_url}
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <CalendarDays className="w-14 h-14 text-white/70" />
                      </div>
                    )}

                    {/* Status badge */}
                    <div className="absolute top-3 left-3">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md ${
                          upcoming
                            ? "bg-success/90 text-white border-success"
                            : event.date
                              ? "bg-gray-900/70 text-white border-gray-700"
                              : "bg-primary/90 text-white border-primary"
                        }`}
                      >
                        {upcoming
                          ? "Upcoming"
                          : event.date
                            ? "Selesai"
                            : "Coming Soon"}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem] group-hover:text-primary transition-colors">
                      {event.title}
                    </h3>

                    <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                      {event.description}
                    </p>

                    <div className="mt-auto space-y-1.5 text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-3.5 h-3.5 text-primary" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      {formatTime(event.date) && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-primary" />
                          <span>{formatTime(event.date)} WIB</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      Lihat detail
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSelected(null)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative bg-white w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header / Banner */}
              <div className="relative h-56 sm:h-64 bg-gradient-primary flex-shrink-0">
                {selected.thumbnail_image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={selected.thumbnail_image_url}
                    alt={selected.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <CalendarDays className="w-20 h-20 text-white/70" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                <button
                  onClick={() => setSelected(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-lg transition-all"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg line-clamp-2">
                    {selected.title}
                  </h3>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 sm:p-8 overflow-y-auto flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-light-50 border border-light-200">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <CalendarIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">
                        Tanggal
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatDate(selected.date)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-light-50 border border-light-200">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Waktu</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatTime(selected.date)
                          ? `${formatTime(selected.date)} WIB`
                          : "TBA"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                    Deskripsi
                  </h4>
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {selected.description}
                  </p>
                </div>

                {selected.meeting_url &&
                  (() => {
                    const notStarted =
                      !!selected.date && isUpcoming(selected.date);
                    if (notStarted) {
                      return (
                        <button
                          type="button"
                          disabled
                          className="btn btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-2 opacity-60 cursor-not-allowed"
                          title="Meeting belum dimulai"
                        >
                          <Video className="w-5 h-5" />
                          Belum Dimulai
                        </button>
                      );
                    }

                    return (
                      <a
                        href={selected.meeting_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-2"
                      >
                        <Send className="w-5 h-5" />
                        Lihat Postingan Event
                      </a>
                    );
                  })()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
