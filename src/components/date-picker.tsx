'use client';

import { useState } from 'react';

import { format } from 'date-fns';
import { LucideCalendar } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface DatePickerProps {
  id: string;
  name: string;
  defaultValue?: string | undefined;
}

const DatePicker = ({ id, name, defaultValue }: DatePickerProps) => {
  const [date, setDate] = useState<Date | undefined>(
    defaultValue ? new Date(defaultValue) : new Date()
  );
  const [open, setOpen] = useState(false);

  const formattedStringDate = date ? format(date, 'yyyy-MM-dd') : '';

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild id={id}>
        <Button className="w-48 justify-between font-normal" id="date" variant="outline">
          {formattedStringDate}
          <LucideCalendar />
          <input name={name} type="hidden" value={formattedStringDate} />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto overflow-hidden p-0">
        <Calendar
          captionLayout="dropdown"
          fromYear={new Date().getFullYear()}
          mode="single"
          selected={date}
          toYear={new Date().getFullYear() + 5}
          onSelect={(date) => {
            setDate(date);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
};
export default DatePicker;
