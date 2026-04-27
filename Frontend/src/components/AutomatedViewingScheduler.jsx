import { useState } from "react";
import { Calendar, Clock, User, Phone, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/dialog";
import { Button } from "@/components/button";

export default function AutomatedViewingScheduler({ brokerName = "Sarah Jenkins" }) {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [isBooked, setIsBooked] = useState(false);

  const dates = [
    { day: "Mon", date: "12" },
    { day: "Tue", date: "13" },
    { day: "Wed", date: "14" },
    { day: "Thu", date: "15" },
    { day: "Fri", date: "16" },
  ];

  const times = ["10:00 AM", "1:30 PM", "3:00 PM", "5:30 PM"];

  const handleBooking = () => {
    if (selectedDate && selectedTime) {
      setIsBooked(true);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full bg-navy text-white hover:bg-navy/90 h-12">
          <Calendar className="mr-2 h-4 w-4" /> Schedule a Viewing
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Book a Tour</DialogTitle>
        </DialogHeader>

        {isBooked ? (
          <div className="py-8 flex flex-col items-center justify-center text-center">
            <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-navy mb-2">Viewing Confirmed!</h3>
            <p className="text-muted-foreground text-sm">
              You are scheduled to view this property on <strong>{selectedDate}</strong> at <strong>{selectedTime}</strong> with {brokerName}.
            </p>
            <Button className="mt-6 w-full" variant="outline" onClick={() => setIsBooked(false)}>Done</Button>
          </div>
        ) : (
          <div className="grid gap-6 py-4">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground">Select Date</label>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                {dates.map((d) => (
                  <button
                    key={d.date}
                    onClick={() => setSelectedDate(`${d.day}, Oct ${d.date}`)}
                    className={`flex flex-col items-center justify-center min-w-[4rem] rounded-xl border p-2 transition-all ${selectedDate.includes(d.date) ? "border-navy bg-navy text-white shadow-md" : "border-border bg-white text-muted-foreground hover:border-navy/50"}`}
                  >
                    <span className="text-[10px] font-bold uppercase">{d.day}</span>
                    <span className="text-xl font-extrabold">{d.date}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground">Select Time</label>
              <div className="grid grid-cols-2 gap-2">
                {times.map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTime(t)}
                    className={`flex items-center justify-center gap-2 rounded-lg border p-3 text-sm font-medium transition-all ${selectedTime === t ? "border-navy bg-navy/5 text-navy font-bold shadow-inner" : "border-border bg-white text-muted-foreground hover:bg-secondary/50"}`}
                  >
                    <Clock className="h-4 w-4" /> {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-border">
              <label className="text-sm font-semibold text-foreground">Your Details</label>
              <div className="space-y-2">
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input type="text" placeholder="Full Name" className="w-full rounded-md border border-border bg-background px-9 py-2 text-sm focus:border-navy focus:outline-none" />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input type="tel" placeholder="Phone Number" className="w-full rounded-md border border-border bg-background px-9 py-2 text-sm focus:border-navy focus:outline-none" />
                </div>
              </div>
            </div>

            <Button onClick={handleBooking} disabled={!selectedDate || !selectedTime} className="w-full bg-navy text-white hover:bg-navy/90 h-12 mt-2">
              Confirm Booking
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
