import Form from 'next/form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const TicketCreateForm = () => {
  return (
    <Form action="" className="flex flex-col gap-y-4">
      <Label htmlFor="title">Title</Label>
      <Input required id="title" name="title" placeholder="Ticket title here..." type="text" />
      <Label htmlFor="content">Description</Label>
      <Textarea required id="content" name="content" placeholder="Ticket description here..." />
      <Button type="submit">Create Ticket</Button>
    </Form>
  );
};
export default TicketCreateForm;
